const fs = require('fs');
const Joi = require('@hapi/joi');

module.exports = function upload(req, res) {
  const path = `/tmp/${req.query.file}`;
  const schema = Joi.object().keys({
    fileName: Joi.string()
  });

  Joi.validate({ fileName: req.query.file }, schema, function (err, value) {
    if (err) {
      console.log(`File name failed validation: ${req.query.file}`)
      res.status(400).json({
        message: "fileName has to be a string"
      });
    } else {
      try {
        fs.unlink(path, function(err) {
          if(err && err.code == 'ENOENT') {
            // file doens't exist
            console.info("File doesn't exist, won't remove it.");
            res.status(400).json({
              message: "fileName does not exist"
            });
          } else if (err) {
            // other errors, e.g. maybe we don't have enough permission
            console.error("Error occurred while trying to remove file");
            //file removed
            res.status(500).json({
              message: JSON.stringify(err)
            });
          } else {
            console.info(`removed`);
            //file removed
            res.status(200).json({
              name: 'Success',
              message: `File ${req.query.file} deleted.`
            });
          }
      });
        
      } catch(err) {
        console.error(JSON.stringify(err));
        res.status(500).json({
          message: JSON.stringify(err)
        });
      }
    }
  });
};