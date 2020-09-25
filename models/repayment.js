const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RepaymentSchema = new Schema({
    loanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Loan'
    },
    repaymentAmount: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date
    },
    loanBalance: {
        type: Number,
        required: true,
    }

}, {
    timestamps: false
});

const Repayment = mongoose.model('Repayment', RepaymentSchema);

module.exports = Repayment;