const jwt = require("jsonwebtoken");
const Expense = require("../model/expensemodel");
const sequelize = require("../util/db");
const AWS = require("aws-sdk");

const secretKey = "secretKey";

function uploadToS3(data, filename) {
  const BUCKET_NAME = "expensetrackingap";
  const IAM_USER_KEY = "AKIA5NCBEQFXCR3HNL3D";
  const IAM_USER_SECRET = "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";

  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
    //Bucket: BUCKET_NAME
  });

  var params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };

  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log("Something went wrong", err);
        reject(err);
      } else {
        //console.log("success", s3response);
        resolve(s3response.Location);
      }
    });
  });
}

module.exports.getUserExpenseDownloadController = async (req, res) => {
  try {
    jwt.verify(req.token, secretKey, async (err, data) => {
      if (err) {
        console.log(err);
        res.json({
          message: "invalid token",
        });
      } else {
        const expenses = await Expense.findAll({
          where: {
            UserId: data.user.userId,
          },
        });
        console.log(expenses);
        const stringifiedExpenses = JSON.stringify(expenses);
        const UserId = data.user.userId;
        const filename = `Expense${UserId}/${new Date()}.txt`;
        const fileURL = await uploadToS3(stringifiedExpenses, filename);
        res.status(200).json({ fileURL, success: true });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ fileURL: "", success: false, err: err });
  }
};
