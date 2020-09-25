const mongoose = require('mongoose');
const {
    compareSync,
    hashSync
} = require('bcryptjs');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    loan: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Loan'
    }],
    firstName: {
        type: String
    },
    secondName: {
        type: String
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        validate: {
            validator: email => User.doesNotExist({
                email
            }),
            message: "Email already exists"
        }
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: String,
        enum: ['Admin', 'User'],
        default: 'User'
    },
    status: {
        type: String,
        enum: ['Unverified', 'Verified'],
        default: 'Unverified'
    }
}, {
    timestamps: true
});

UserSchema.pre('save', function () {
    if (this.isModified('password')) {
        this.password = hashSync(this.password, 10);
    }
});

UserSchema.statics.doesNotExist = async function (field) {
    return await this.where(field).countDocuments() === 0;
};

UserSchema.methods.comparePasswords = function (password) {
    return compareSync(password, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;