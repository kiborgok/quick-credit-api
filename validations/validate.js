const Joi = require('joi');

const firstName = Joi.string().alphanum().min(2).max(15).label("Firstname").required().error(errors => {
    errors.forEach(err => {
        switch (err.type) {
            case "any.required":
                err.message = `${err.context.label} should not be empty!`;
                break;
            case "string.min":
                err.message = `${err.context.label} should have at least ${err.context.limit} characters!`;
                break;
            case "string.max":
                err.message = `${err.context.label} should have at most ${err.context.limit} characters!`;
                break;
            default:
                break;
        }
    });
    return errors;
})
const secondName = Joi.string().alphanum().min(2).max(15).label("Secondname").required().error(errors => {
    errors.forEach(err => {
        switch (err.type) {
            case "any.required":
                err.message = `${err.context.label} should not be empty!`;
                break;
            case "string.min":
                err.message = `${err.context.label} should have at least ${err.context.limit} characters!`;
                break;
            case "string.max":
                err.message = `${err.context.label} should have at most ${err.context.limit} characters!`;
                break;
            default:
                break;
        }
    });
    return errors;
})
const username = Joi.string().alphanum().min(2).max(15).label("Username").required().error(errors => {
    errors.forEach(err => {
        switch (err.type) {
            case "any.required":
                err.message = `${err.context.label} should not be empty!`;
                break;
            case "string.min":
                err.message = `${err.context.label} should have at least ${err.context.limit} characters!`;
                break;
            case "string.max":
                err.message = `${err.context.label} should have at most ${err.context.limit} characters!`;
                break;
            default:
                break;
        }
    });
    return errors;
});
const email = Joi.string().email().required().error(() => ({
    message: "Email is required"
}));
const admin = Joi.string();
const status = Joi.string();
const repaymentAmount = Joi.number();
const amount = Joi.number();
const tenor = Joi.number();
const password = Joi.string().required().error(() => ({
    message: "Password is required"
}));

const signUp = Joi.object().keys({
    firstName,
    secondName,
    username,
    email,
    password,
    admin,
    status
});

const signIn = Joi.object().keys({
    email,
    password
});

const createLoan = Joi.object().keys({
    amount,
    tenor
});

const repayLoan = Joi.object().keys({
    repaymentAmount
});

module.exports = {
    signIn,
    signUp,
    createLoan,
    repayLoan
}