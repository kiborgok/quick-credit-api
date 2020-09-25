const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LoanSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    repayments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Repayment'
    }],
    tenor: {
        type: Number,
        enum: [1, 3, 6, 9, 12],
        default: 1
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    paymentInstallment: {
        type: Number,
        required: true
    },
    balance: {
        type: Number,
        required: true
    },
    interest: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date().toDateString()
    },
    repaid: {
        type: Boolean,
        default: false
    }
});

LoanSchema.methods.calculateInterest = function (amount) {
    this.interest = Number(amount) * 0.05
    return this.interest;
}

LoanSchema.methods.calculateInstallment = function (amount, interest, tenor) {
    this.paymentInstallment = (Number(amount) + interest) / Number(tenor)
    return this.paymentInstallment;
}

LoanSchema.methods.calculateBalance = function (amount, interest) {
    this.balance = (Number(amount) + interest);
    return this.balance;
}


const Loan = mongoose.model('Loan', LoanSchema);

module.exports = Loan;