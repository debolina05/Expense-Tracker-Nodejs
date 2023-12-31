const ForgotUser = require("../model/ForgotPasswordRequestsModel");
const User = require("../model/userModel");
const bcrypt = require("bcrypt");

module.exports.updatePasswordControllers = async (req, res) => {
    //console.log(req.body);
    console.log('7')
    const { password, uuid } = req.body;
    const arr = uuid.split("/");
    console.log(arr[arr.length - 1]);
    console.log('11')
    const result = await ForgotUser.findOne({
        where: {
            uuid: arr[arr.length - 1],
            isActive: true,
        },
    });
    //console.log(result);
    console.log('19')
    if (result !== null) {
        const hash = await bcrypt.hash(req.body.password, 10);
        const resetresult = await User.update(
            { password: hash },
            {
                where: {
                    id: result.UserId,
                },
            }
        );
        const updateforget = await ForgotUser.update(
            { isActive: false },
            {
                where: {
                    uuid: arr[arr.length - 1],
                },
            }
        );
        //console.log(resetresult);
        console.log('39')
        //console.log(updateforget);
        res.json({ message: "password reset" });
    }
};
