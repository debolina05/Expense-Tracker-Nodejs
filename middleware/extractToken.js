const jwt = require('jsonwebtoken');

module.exports.extractToken = (req, res, next) => {
    console.log(`in extract token middleware`);
    const token = req.headers['authorization']; //when we create token it gets stored in the headers as authorization
    console.log(token);
    console.log('token extracted');
    if (typeof token !== "undefined") {
        //giving token globally to access, so that we can find the userid
        req.token = token;
        //decryption
        jwt.verify(req.token,process.env.SECRET_TOKEN_KEY , (err, data) => {
            if (err) {
                console.log(err);
                return res.status(401).json({
                    message: 'invalid token'
                })
            }
            else {
                req.data=data;
                next();
            }
        })
    }
    else {
        res.status(401).send({ message: 'invalid authentication' })
    }
}