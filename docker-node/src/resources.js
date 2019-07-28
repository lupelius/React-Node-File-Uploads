// const IncomingForm = require('formidable').IncomingForm;
const fs = require('fs');
const tempFolder = '/tmp';
const errRes = require('./err.js');

module.exports = (req, res) => {
  try {
    const arr = fs.readdirSync(tempFolder);
    const responseArr = [];
    arr.forEach(file => {
      console.log(JSON.stringify(file));
      const stats = fs.statSync(`/tmp/${file}`);
      //Convert the file size to megabytes and serve
      responseArr.push({name: file, size: stats["size"] / 1000.0});
    });

    res.status(200).json({
      message: `There are ${arr.length} items saved.`,
      count: responseArr.length,
      body: responseArr
    });
  } catch (err) {
    errRes(err,res);
  }
  
};