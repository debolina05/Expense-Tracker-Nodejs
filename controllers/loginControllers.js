const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../model/userModel");

const secretKey = "secretKey";

module.exports.postLoginController = (req, res) => {
  console.log(`req.body.email=${req.body.email}`);
  console.log(`req.body.password=${req.body.password}`);
  console.log(`req.body.User=${req.body}`);
  User.findAll({
    where: {
      email: req.body.email,
    },
  })
    .then((result) => {
      if (result.length === 0) {
        res.status(404);
        res.json({ name: "user does not Exists" });
      } else {
        bcrypt
          .compare(req.body.password, result[0].dataValues.password)
          .then(function (resu) {
            if (resu === true) {
              console.log(result[0].dataValues);
              // generating token when user is login with post request
              const user = {
                userId: result[0].dataValues.id,
                is_premium: result[0].dataValues.is_premium,
              };
              jwt.sign({ user }, secretKey, (err, token) => {
                if (err) {
                  console.log(err);
                } else {
                  res.json({
                    name: result[0].dataValues.name,
                    token,
                    is_premium: result[0].dataValues.is_premium,
                  });
                }
              });
            } else {
              console.log(`password not matched`);
              res.status(401);
              res.json({ name: "user password is not correct" });
            }
          });
      }
      console.log(`result`);
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};
