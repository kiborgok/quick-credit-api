const express = require('express');
const Joi = require('joi');
const nodemailer = require('nodemailer');
const config = require("config");
const User = require('../models/user');
const {
    signUp,
    signIn
} = require('../validations/validate');
const {
    parseError,
    generateAccessToken,
    authenticateJWT
} = require('../utilities/helpers');


const authRoutes = express.Router();

//Get all users
authRoutes.get('/users', authenticateJWT, async (req, res) => {
    try {
        const {
            admin
        } = req.user;
        if (admin !== 'Admin') return res.json({
            'status': 403,
            'error': 'Forbidden'
        });
        const users = await User.find();
        const userData = users.filter(user => user.admin !== 'Admin')
        res.json({
            'status': 200,
            'data': userData
        });
    } catch (err) {
        res.json({
            'status': 404,
            'error': 'Users not found'
        });
    }
});

//Get one user by id
authRoutes.get('/users/:userId', authenticateJWT, async (req, res) => {
    try {
        const {
            admin
        } = req.user;
        if (!admin) return res.json({
            'status': 403,
            'error': 'Forbidden'
        });
        const {
            userId
        } = req.params;
        const user = await User.findOne({
            _id: userId
        })
        res.json({
            'status': 200,
            'data': user
        });
    } catch (err) {
        res.json({
            'status': 404,
            'error': 'User not found'
        });
    }
});

//Verify one user via their email
authRoutes.post('/users/:email/verify', authenticateJWT, async function (req, res) {
    try {
        const {
            admin,
            status
        } = req.user;
        if (admin !== 'User') return res.json({
            'status': 403,
            'error': 'Forbidden'
        });
        if (status === 'Verified') return res.json({
            'status': 403,
            'error': 'Account already verified, signin'
        });
        const {
            email
        } = req.params;

        await User.findOneAndUpdate({
            email
        }, {
            status: 'Verified'
        }, {
            new: true
        }, (err, updatedUser) => {
            if (err || updatedUser === null) {
                return res.json({
                    'status': 404,
                    'error': 'User not found'
                })
            }
            req.updatedUser = updatedUser
            res.json({
                'status': 200,
                'data': {
                    'id': req.updatedUser._id,
                    'email': req.updatedUser.email,
                    'firstName': req.updatedUser.firstName,
                    'secondName': req.updatedUser.secondName,
                    'status': req.updatedUser.status
                }
            });
        });

    } catch (err) {
        res.status(401).send(parseError(err));
    }
});

//Register a new user
authRoutes.post('/signup', async (req, res) => {
    try {
        const {
            firstName,
            secondName,
            username,
            email,
            password
        } = req.body;
        await Joi.validate({
            firstName,
            secondName,
            username,
            email,
            password
        }, signUp);
        const newUser = new User({
            firstName,
            secondName,
            username,
            email,
            password
        });
        const accessToken = generateAccessToken(newUser);
        await newUser.save();

        let transport = nodemailer.createTransport({
            host: config.get("EMAIL_HOST"),
            port: config.get("EMAIL_PORT"),
            secure: true,
            auth: {
                user: config.get("EMAIL_SENDER"),
                pass: config.get("EMAIL_SENDER_PASS"),
            },
        });

        const message = {
            from: config.get("EMAIL_SENDER"),
            to: email,
            subject: "Quick Credit",
            html: ` <div>
                        <h3>Hi ${firstName},</h3>
                        <p>Thank you for registering with us.</p>
                        <p>Click here <a href='http://localhost:3000/verify'>http://localhost:3000/verify</a> to verify your account.</p>
                        <p><b>Please NOTE: This link expires in 24hrs</b></p></br></br>
                        <p>Regards,</p>
                        <p><em>Admin</em></p>
                    </div>`
        };

        transport.sendMail(message, function (err, info) {
            if (err) {
                res.json({
                    'error': 'There was a problem'
                });
            } else {
                res.json({
                    'data': 'Mail sent'
                });
            }
        });

        return res.json({
            'status': 200,
            'data': {
                verificationToken: accessToken,
                email
            }
        });
    } catch (err) {
        res.json({
            'status': 400,
            'error': parseError(err)
        });
    }
});

//Login into the application with email and password
authRoutes.post('/signin', async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;
        await Joi.validate({
            email,
            password
        }, signIn);

        const user = await User.findOne({
            email
        }).populate('loan', 'status');
        if (user && user.comparePasswords(password)) {
            if (user.status !== 'Verified') {
                return res.json({
                    'status': 403,
                    'error': 'Account not verified, check your mail'
                });
            }
            const accessToken = generateAccessToken(user);
            req.user = user;
            const {
                _id,
                loan,
                username,
                firstName,
                secondName,
                status,
                email,
                admin
            } = req.user;
            res.json({
                'status': 200,
                'data': {
                    'token': accessToken,
                    'userId': _id,
                    'loan': loan,
                    'status': status,
                    'username': username,
                    'firstName': firstName,
                    'secondName': secondName,
                    'email': email,
                    'admin': admin
                }
            });
        } else {
            res.json({
                'status': 401,
                'error': 'Invalid credentials'
            });
        }
    } catch (err) {
        res.json({
            'status': 406,
            'error': parseError(err)
        });
    }
});

module.exports = authRoutes;