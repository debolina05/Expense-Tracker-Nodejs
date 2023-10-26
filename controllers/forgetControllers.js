const Sib = require('sib-api-v3-sdk');
const path = require('path');
const { createTransport } = require('nodemailer');
const User = require('../model/userModel');
const ForgotUser = require('../model/ForgotPasswordRequestsModel');
const { v4: uuidv4 } = require('uuid');


module.exports.postForgetController = async (req, res) => {
    try {

        const result = await User.findOne({
            where: {
                email: req.body.email
            }
        })
        console.log(result);
        const uuid = uuidv4();//creates random
        console.log(uuid);
        if (result !== null) {
            const obj = {
                UserId: result.id,
                isActive: true,
                uuid: uuid,
            }
            console.log(obj);
            const forgotResult = await ForgotUser.create(obj);
            console.log(forgotResult);
            const defaultClient = Sib.ApiClient.instance;

            const apiKey = defaultClient.authentications['api-key'];//creating wrapper
            apiKey.apiKey = process.env.SMTP_KEY_ID;
            console.log(process.env.SMTP_KEY_ID);

            const transporter = createTransport({
                host: "smtp-relay.brevo.com",
                port: 587,
                auth: {
                    user: "debolinasaha0520@gmail.com",
                    pass: process.env.SMTP_KEY_ID,
                },
            });
            console.log(req.body.email);
            const mailOptions = {
                from: 'debolinasaha0520@gmail.com',
                to: req.body.email,
                subject: `Your subject`,
                text: `Your reset link is - http://localhost:3000/password/resetpassword/${uuid}

        This is valid for 1 time only.`
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            res.json({ message: "forget password" })
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports.postresetpasswordController = async(req, res) => {
    const uuid=req.params.uuid;
    console.log(uuid);   
    const result=await ForgotUser.findOne({
        where:{
            uuid:uuid,
        }
    })
    console.log(result);
    if(result!==null){
        res.sendFile(path.join(__dirname,'..','forget','forget.html'));
    }
}