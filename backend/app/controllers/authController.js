const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const validator = require('email-validator');
const User = require('../models/userSchema');
const passwordHash = require('../service/passwordHash');


exports.login = async (req, res) => {
    // Implement loging

    const { email, password } = await req.body;
    const userEmail = "\"" + email + "\"";
    const userPassword = password;

    // Validate email
    if (!validator.validate(email)) {
        return res.status(400).json({ message: 'Invalid email address' });
    }

    // Validate password length
    if (userPassword.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    let inputPassword = passwordHash.hashPassword(userPassword);


    try {
        mongoose.set('debug', true);
        mongoose.model('User', User);
        const db = mongoose.connection.useDb('sellcars');
        db.model('User', User);

        const query = { $text: { $search: userEmail } };
        const userData = await db.model('User', User).findOne(query);

        if (!userData) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await hashEqual(inputPassword, userData.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' + inputPassword + '+++++' + userData.password_hash });
        }

        const token = jwt.sign({ userId: userData._id }, 'sell_car_secret_key', { expiresIn: '2days' });

        //update user after login
        userData.save();

        res.json({ token });
    } catch (error) {
        //console.error(error);
        res.status(500).json({ message: error.message });
    }

};

const hashEqual = async (inputHash, passwordHash) => {
    return inputHash === passwordHash;
};

exports.userInfo = async (req, res) => {
    const email = req.params.email;
    const userEmail = "\"" + email + "\"";

    // Validate email
    if (!validator.validate(email)) {
        return res.status(400).json({ message: 'Invalid email address' });
    }


    try {
        mongoose.set('debug', true);
        mongoose.model('User', User);
        const db = mongoose.connection.useDb('sellcars');
        db.model('User', User);

        const query = { $text: { $search: userEmail } };
        const userData = await db.model('User', User).findOne(query);

        if (!userData) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }


        const name = userData.first_name + ' ' + userData.last_name;
        const lastLogin = userData.updated_at;
        res.json({ name: name, lastLogin: lastLogin });
    } catch (error) {
        //console.error(error);
        res.status(500).json({ message: error.message });
    }

};
