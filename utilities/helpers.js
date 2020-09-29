const jwt = require('jsonwebtoken');
const config = require("config");

const parseError = (err) => {
    if (err.isJoi) return err.details[0].message;
    const obj = Object.keys(err.errors)[0]
    return err.errors[obj].message
};

//Verify JWT token
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(
            token,
            process.env.TOKEN_SECRET || config.get("TOKEN_SECRET"),
            (err, user) => {
                if (err) {
                    return res.json({
                        status: 403,
                        error: "Your Token is Expired",
                    });
                }
                req.user = user;
                next();
            }
        );
    } else {
        res.json({
            "status": 401,
            "error": "Unauthorized"
        });
    }
};

//Create JWT token
const generateAccessToken = (user) => {
    return jwt.sign({
            userId: user._id,
            firstName: user.firstName,
            secondName: user.secondName,
            username: user.username,
            email: user.email,
            admin: user.admin,
            status: user.status,
        },
        process.env.TOKEN_SECRET || config.get("TOKEN_SECRET"), {
            expiresIn: "24h"
        }
    );
};

module.exports = {
    generateAccessToken,
    authenticateJWT,
    parseError
}