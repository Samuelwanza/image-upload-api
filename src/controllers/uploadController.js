const db = require("../database/models/");
const dotenv = require("dotenv");
const aws = require("aws-sdk");
const fs = require("fs");

dotenv.config();

const { File } = db;

const s3 = new aws.S3({
  region: "us-east-1",
  accessKeyId: process.env.AWS_ACCESS_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

class uploadController {
  //method to upload file and insert in the DB
  static async uploadMyFile(req, res) {
    if (!req.body) return res.send("Please upload a file");
    try {
      const fileStream = fs.createReadStream(req.file.path);
      //console.log(fileStream);
      console.log(req.file);
      var params = {
        Body: fileStream,
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: req.file.originalname,
        ACL: "bucket-owner-full-control",
      };

      s3.putObject(params, function (err, data) {
        if (err) {
          console.log(err, err.stack);
          res.end();
          //return res.json(err);
        } // an error occurred
        else {
          console.log(data);

          let object_code = data.ETag.replace('"', "");
          object_code = object_code.replace('"', "");
          console.log(object_code);
          const image_url = `https://${params.Bucket}.s3.amazonaws.com/${object_code}.png`;
          const info = {
            fileName: req.file?.originalname,
            fileLink: image_url,
          };
          File.create(info).then((response) => {
            return res.json(response);
          });
        } // successful response
        /*
         data = {
          ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"", 
          VersionId: "psM2sYY4.o1501dSx8wMvnkOzSBB.V4a"
         }
         */
      });
      //Upload file to S3
      //Insert file name and link in DB
      // Return error of success msg
    } catch (error) {
      console.log("ERROR", error);
      return res
        .status("500")
        .json({ errors: { error: "Files not found", err: error.message } });
    }
  }

  //method to return files in the DB
  static async getFiles(req, res) {
    const response = await File.findAll({});
    return res.json(response);
    //Code to get all files from DB and return them
  }
}

module.exports = uploadController;
