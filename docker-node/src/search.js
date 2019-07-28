// const IncomingForm = require('formidable').IncomingForm;
const fs = require('fs');
const Joi = require('@hapi/joi');
const tempFolder = '/tmp';
const errRes = require('./err.js');

module.exports = (req, res) => {
  if (req.params.search) {
    const schema = Joi.object().keys({
      search: Joi.string()
    });
    
    Joi.validate({ search: req.params.search }, schema, function (err, value) {
      if (err) {
        errRes(err,res);
      } else {
        const arr = fs.readdirSync(tempFolder);
        const responseArr = [];
        arr.forEach(file => {
          // Check with indexof not to take down the server
          if (file.indexOf(req.params.search) !== -1) {
            const stats = fs.statSync(`/tmp/${file}`);
            //Convert the file size to megabytes and serve
            responseArr.push({name: file, size: stats["size"] / 1000.0});
          }
        });
        console.log(`Files returned: ${JSON.stringify(responseArr)}`);
        res.status(200).json({
          message: `There are ${arr.length} items matching.`,
          count: responseArr.length,
          body: responseArr
        });
      }
    });
  } else {
    res.status(400).json({
      name: "Error",
      message: "Please send search a parameter."
    });
  }
};