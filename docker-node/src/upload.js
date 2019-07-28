const IncomingForm = require('formidable').IncomingForm;
const fs = require('fs');
const Joi = require('@hapi/joi');
const errRes = require('./err.js');

function rename(randPart,fileName,res) {
  // Try to rename hashed upload name to our original name
  fs.rename(`/tmp/upload_${randPart}`, fileName, function(err) {
    if ( err ) {
      console.log('ERROR: ' + err);
      errRes(err,res);
    } else {
      console.log('renamed')
    };
  });
}

// If things went bad and there was a race condition, delete files
function deleteFiles(files, callback){
  var i = files.length;
  files.forEach(function(filepath){
    fs.unlink(filepath, function(err) {
      i--;
      if (err) {
        callback(err);
        return;
      } else if (i <= 0) {
        callback(null);
      }
    });
  });
}

const filesSetToDelete = [];

module.exports = function upload(req, res) {
  try {
    const form = new IncomingForm();

    // TODO: save it to the database or S3 instead
    form.on('fileBegin', (name, file) => {
      const schema = Joi.object().keys({
        fileName: Joi.string(),
        fileType: Joi.string().valid(["image/png","image/jpg","image/jpeg"]),
        fileSize: Joi.number().less(10 * 1024 * 1024)
      });
      
      Joi.validate({ fileName: file.name, fileType: file.type,  fileSize: file.size }, schema, function (err, value) {
        if (err) {
          console.log(`${JSON.stringify(err)}`);
          errRes(err,res);
          // can't stop upload so set to delete
          filesSetToDelete.push(file.path);
        }
      });
    });

    form.on('file', (field, file) => {
      // If file is not to be deleted, rename it.
      if (!filesSetToDelete.includes(file.path)) {
        console.log(`File ${file.name} saved.`);
        /* {"size":709415,"path":"/var/folders/15/74q47bt55yv0cmvb68wcl7rc0000gn/T/upload_3a0d99b42b4f453a2f229822ced04593",
        "name":"4-latestTT.png","type":"image/png",} */
        let fileName = `/tmp/${file.name}`;
        let fileNameExists = false;
        const randPart = file.path.split('_')[1];

        const accessPromise = fs.access(fileName, fs.F_OK, (err) => {
          if (err) {
            console.log(`File ${fileName} doesn't exist, creating`);
            // Do not send a 500 response as it's not needed
          } else {
            console.log("File fileNameExists");
            fileNameExists = true;
          }
        });
        
        if (accessPromise) {
          accessPromise.then(() => {
            // Take the generated hash            
            if (fileNameExists) {
              // quick fix if filename fileNameExists
              fileName = `/tmp/upload_${randPart}`;
            }
            // Rename upload_<gibberish> to origin name
            rename(randPart,fileName,res);
          });
        } else {
          // File didn't exist, now it does (hopefully)
          console.log("file didn't exist, continuing");
          if (!fileNameExists) {
            rename(randPart,fileName,res);
          }
        }
      }
    });

    form.on('end', () => {
      if (filesSetToDelete.length > 0) {
        deleteFiles(filesSetToDelete, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log('all files removed');
          }
        }); 
      }
      res.json();
    });
    form.on('aborted', function() {
      res.status(400).json({
        name: "Client error",
        message: "Upload aborted"
      });
    });
    form.on('error', function(err) {
      errRes(err,res);
    });
    form.parse(req);
  } catch (err) {
    errRes(err,res);
  }
};