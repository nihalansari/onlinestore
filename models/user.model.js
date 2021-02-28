const mongoose = require('mongoose');
const { isEmail, isAlphanumeric } = require('validator');
const cuid = require('cuid');
//const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: { type: String, default: cuid },
    username: {type: String, required: true, unique: true, trim: true, minlength: 6},
    password: { type: String, maxLength: 10, required: true },
    email: { type: String, maxLength: 20, required: true }
    //email: emailSchema({ required: true })
});

const User = mongoose.model('User', userSchema);

async function list (opts = {}) {
    const { offset = 0, limit = 25 } = opts
    const users = await User.find()
        .sort({ _id: 1 })
        .skip(offset)
        .limit(limit)
    return users
}

function emailSchema (opts = {}) {
    const { required } = opts
    return {
        type: String,
        required: !!required,
        validate: {
            validator: isEmail,
            message: props => `${props.value} is not a valid email address`
        }
    }
}


async function isUnique (doc, username) {
    const existing = await get(username)
    return !existing || doc._id === existing._id
}

async function get (username) {

    const user = await User.findOne({ username })
    return user
}

async function remove (username) {
    await User.deleteOne({ username })
}
async function create (fields) {
    const user = new User(fields)
    //await hashPassword(user)
    await user.save()
    return user
}
async function edit (username, change) {
    const user = await get(username)
    Object.keys(change).forEach(key => { user[key] = change[key] })
    if (change.password) await hashPassword(user)
    await user.save()
    return user
}
async function isUnique (doc, username) {
    const existing = await get(username)
    return !existing || doc._id === existing._id
}
/*
async function hashPassword (user) {
    if (!user.password) throw user.invalidate('password', 'password is required')
    if (user.password.length < 12) throw user.invalidate('password', 'password must be at least 12 characters')
    user.password = await bcrypt.hash(user.password, SALT_ROUNDS)
}
*/

//module.exports = User;
//module.exports = list;


module.exports = {
    get,
    create,
    edit,
    list,
    model: User
};


