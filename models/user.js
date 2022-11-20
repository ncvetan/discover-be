const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true, maxLength: 20 },
        password: { type: String, required: true },
    },
    { timestamps: true }
);

// Saves given password as a hash instead of plaintext
UserSchema.pre('save', async function (next) {
    if (this.password) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Checks if given password is correct by comparing it to its stored hash
UserSchema.methods.comparePassword = async function (password) {
    const compare = await bcrypt.compare(password, this.password);
    return compare;
};

module.exports = mongoose.model('User', UserSchema);
