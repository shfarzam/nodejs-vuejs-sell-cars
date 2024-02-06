const mongoose = require('mongoose');

const contactPersonSchema = new mongoose.Schema({
    first_name: { type: String, maxlength: 50 },
    last_name: { type: String, maxlength: 50 },
    email: { type: String, maxlength: 50 },
    mobile_phone: { type: String, maxlength: 20 },
    birth_date: { type: Date },
}, { collection: "persons" });

const addressSchema = new mongoose.Schema({
    company_name: { type: String },
    country: { type: String, maxlength: 50 },
    city: { type: String, maxlength: 50 },
    zip: { type: String, maxlength: 5 },
    fax: { type: String, maxlength: 20 },
    phone: { type: String, maxlength: 20 },
    street: { type: String, maxlength: 100 },
    email: { type: String, maxlength: 50 },
}, { collection: "addresses" });

const customerSchema = new mongoose.Schema({
    intnr: { type: String, maxlength: 10, unique: true },
    type: { type: String, enum: ['PRIVATE', 'COMPANY', 'DEALER'] },
    contact_persons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ContactPerson' }],
    addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
}, { collection: "customers" });

const ContactPerson = mongoose.model('ContactPerson', contactPersonSchema);
const Address = mongoose.model('Address', addressSchema);
const Customer = mongoose.model('Customer', customerSchema);

module.exports = { Customer, ContactPerson, Address };
