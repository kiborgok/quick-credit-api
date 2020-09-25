const express = require('express');
const Joi = require('joi');

const User = require('../models/user');
const Loan = require('../models/loan');
const Repayment = require('../models/repayment');
const {
    createLoan,
    repayLoan
} = require('../validations/validate');
const {
    parseError,
    authenticateJWT
} = require('../utilities/helpers');

const loanRoutes = express.Router();

//Get all loans
loanRoutes.get('', authenticateJWT, async (req, res) => {
    try {
        const {
            admin
        } = req.user;
        if (admin !== 'Admin') return res.json({
            'status': 403,
            'error': 'Forbidden'
        });
        const loans = await Loan.find().populate('user', 'firstName secondName email')
        res.json({
            'status': 200,
            'data': loans
        });
    } catch (err) {
        res.json({
            'status': 404,
            'error': 'Loans not found'
        });
    }
});

//Get loans for one user
loanRoutes.get('/:userId', authenticateJWT, async (req, res) => {
    try {
        const {
            admin
        } = req.user;
        if (!admin) return res.json({
            'status': 403,
            'error': 'Forbidden'
        });
        const userId = req.params.userId;
        const loan = await Loan.find({
            user: userId
        }).populate('user', 'firstName secondName email')
        res.json({
            'status': 200,
            'data': loan
        });
    } catch (err) {
        res.json({
            'status': 404,
            'error': 'No loan'
        });
    }
});

//Get repayment history of one loan
loanRoutes.get('/:loanId/repaymentHistory', authenticateJWT, async (req, res) => {
    try {
        const {
            admin
        } = req.user;
        if (admin !== 'User') return res.json({
            'status': 403,
            'error': 'Forbidden'
        });
        const loanId = req.params.loanId;
        const loanHistory = await Repayment.find({
            loanId
        })
        res.json({
            'status': 200,
            'data': loanHistory
        });
    } catch (err) {
        res.json({
            'status': 404,
            'error': 'Loan not found'
        });
    }
});

//Verify loan application
loanRoutes.post('/:loanId', authenticateJWT, async function (req, res) {
    try {
        const {
            admin
        } = req.user;
        if (admin !== 'Admin') return res.json({
            'status': 403,
            'error': 'Forbidden'
        });
        await Loan.findOneAndUpdate({
            _id: req.params.loanId
        }, {
            status: req.body.status
        }, {
            new: true
        }, (err, loan) => {
            console.log(req.body.status);
            if (err) {
                return res.json({
                    'status': 404,
                    'error': 'Loan not found'
                })
            }

            req.loan = loan
            res.json({
                'status': 200,
                'data': {
                    loanId: req.loan._id,
                    loanAmount: req.loan.amount,
                    tenor: req.loan.tenor,
                    status: req.loan.status,
                    monthlyInstallment: req.loan.paymentInstallment,
                    interest: req.loan.interest,
                    repaid: req.loan.repaid
                }
            });
        });

    } catch (err) {
        res.status(401).send(parseError(err));
    }
});

//Get loan for a specific user
loanRoutes.get('/:user', authenticateJWT, async (req, res) => {
    try {
        const {
            admin
        } = req.user;
        if (admin !== 'Admin') return res.json({
            'status': 403,
            'error': 'Forbidden'
        });
        const {
            user
        } = req.params;
        let foundUser = await Loan.find({
            user
        });
        res.json({
            'status': 200,
            'data': foundUser
        });
    } catch (err) {
        res.json({
            'status': 404,
            'error': 'Users not found'
        });
    }
});

//Apply for a loan
loanRoutes.post('/:userId/apply', authenticateJWT, async (req, res) => {
    try {
        const {
            admin,
            status
        } = req.user;
        if (admin !== 'User') return res.json({
            'status': 401,
            'error': 'You are not a user'
        });
        if (status !== 'Verified') return res.json({
            'status': 401,
            'error': 'Your details Verification still pending'
        });
        const {
            userId
        } = req.params;
        const withLoan = await Loan.find({
            user: userId
        });
        const checkNotPaid = withLoan.filter(loan => loan.repaid === false)
        if (checkNotPaid[0]) {
            if (checkNotPaid[0].status === 'Rejected') return res.json({
                status: 401,
                error: "Sorry! Continue visiting our site for a chance to get a loan",
            });
            if (checkNotPaid[0].status === "Pending")
                return res.json({
                    status: 401,
                    error: "You already have a loan with us, pending approval",
                });
            if (checkNotPaid[0].status === "Approved") return res.json({
                status: 401,
                error: "You have an active loan with us",
            });
        }

        const checkrepaid = withLoan.filter(loan => loan.repaid === true)
        if (checkrepaid[0]) {
            return res.json({
                'status': 401,
                'error': 'You can apply your second loan soon'
            });
        }


        const {
            amount,
            tenor
        } = req.body;
        await Joi.validate({
            amount,
            tenor
        }, createLoan);
        const newLoan = await new Loan({
            amount,
            tenor,
            user: userId
        });
        const interest = await newLoan.calculateInterest(amount)
        if (newLoan && interest &&
            newLoan.calculateInstallment(amount, interest, tenor) &&
            newLoan.calculateBalance(amount, interest)) {
            await newLoan.save();
            req.loan = newLoan;
            User.findOneAndUpdate({
                email: req.user.email
            }, {
                $addToSet: {
                    loan: [req.loan._id]
                }
            }, {
                new: true
            }, (err, result) => {
                if (err) return err
                return result
            });
            res.json({
                'status': 200,
                'data': {
                    loanId: req.loan._id,
                    email: req.user.email,
                    firstName: req.user.firstName,
                    secondName: req.user.secondName,
                    user: req.loan.user,
                    amount: req.loan.amount,
                    tenor: req.loan.tenor,
                    createdAt: req.loan.createdAt,
                    status: req.loan.status,
                    repaid: req.loan.repaid,
                    paymentInstallment: req.loan.paymentInstallment,
                    balance: req.loan.balance,
                    interest: req.loan.interest
                }
            })
        } else {
            res.json({
                'status': 401,
                'error': 'Try again'
            });
        }
    } catch (err) {
        res.json({
            "status": 406,
            "error": parseError(err)
        });
    }
});

//Repay loan
loanRoutes.post('/:loanId/repayment', authenticateJWT, async (req, res) => {
    try {
        const {
            admin
        } = req.user;
        if (admin !== 'User') return res.json({
            'status': 401,
            'error': 'You are not a user'
        });
        const {
            loanId
        } = req.params;
        const findLoan = await Loan.findOne({
            _id: loanId
        });
        if (findLoan.balance === 0) {
            await Loan.findOneAndUpdate({
                _id: loanId
            }, {
                repaid: true
            }, {
                new: true
            });
            return res.json({
                'status': 401,
                'error': 'Your loan is FULLY repaid'
            })
        }
        const {
            repaymentAmount
        } = req.body;
        await Joi.validate({
            repaymentAmount
        }, repayLoan);
        const newRepayment = await new Repayment({
            repaymentAmount,
            loanId,
            loanBalance: findLoan.balance
        });
        if (repaymentAmount > findLoan.balance) {
            return res.json({
                'status': 401,
                'error': `Only pay ${findLoan.balance}`
            })
        }
        const newBalance = await findLoan.balance - repaymentAmount;
        const updatedLoan = await Loan.findOneAndUpdate({
            _id: loanId
        }, {
            balance: newBalance
        }, {
            new: true
        });
        if (newRepayment && updatedLoan) {
            await newRepayment.save();
            req.repayment = newRepayment;
            Loan.findOneAndUpdate({
                _id: loanId
            }, {
                $addToSet: {
                    repayments: [req.repayment._id]
                }
            }, {
                new: true
            }, (err, result) => {
                if (err) return console.log(err)
                return result
            })
            await Repayment.findOneAndUpdate({
                _id: req.repayment._id
            }, {
                loanBalance: newBalance
            }, {
                new: true
            })
            return res.json({
                'status': 200,
                'data': {
                    repaymentId: req.repayment._id,
                    loanId: req.repayment.loanId,
                    repaymentAmount: req.repayment.repaymentAmount
                }
            })
        } else {
            return res.json({
                'status': 401,
                'error': 'Try again'
            });
        }
    } catch (err) {
        res.json({
            "status": 406,
            "error": parseError(err)
        });
    }
});

module.exports = loanRoutes;