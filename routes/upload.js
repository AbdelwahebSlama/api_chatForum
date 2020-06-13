
var asyncLib = require('async');
var express = require("express");
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, '../uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + file.originalname);
        //file.fieldname + '-' + Date.now() +
    }
});
const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

var upload = multer({
    storage: storage
    // limits: {
    //     fileSize: 1024 * 1024 * 5
    // },
    // fileFilter: fileFilter
}).single("file");

module.exports = {
    upload: function (req , res) {
        upload(req,res,function(err) {
            console.log(req.file);
            if(err) {
                console.log('errrrrrrrrrrrrrrrrrrrrrrrrre');
                // return res.end(" ");
              return   res.status(404).json({'error': 'Error uploading file.'});
            }
            // res.end("File is uploaded");
           return  res.status(200).json({'reuc': 'File is uploaded'});
            console.log(req.file);
        });
        // res.end("File is uploaded");
    }
}