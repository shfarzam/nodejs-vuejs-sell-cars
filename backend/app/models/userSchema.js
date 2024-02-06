const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name: { type: String, required: true, maxLength: 50 },//50 max    
    last_name: { type: String, required: true, maxLength: 50 },//50 max    
    password_hash: { type: String, required: true, maxLength: 32, index: true },//32 Char
    email: { type: String, required: true, index: true },
    created_at: { type: Date, default: Date.now }, // ISO Date
    updated_at: { type: Date },//ISO Date
}, { collection: "users" });

// Middleware to update `updated_at` before saving
userSchema.pre('save', function (next) {
    this.updated_at = new Date();
    next();
});

userSchema.index({ email: "text" }, { unique: true });
userSchema.index({ password_hash: "text" });

module.exports = userSchema;