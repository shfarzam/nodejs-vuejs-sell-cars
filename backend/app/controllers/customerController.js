const { Customer, ContactPerson, Address } = require('../models/customerModel');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const mongoose = require('mongoose')

// Multer configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find({ intnr: { $ne: null } })
            .select('-_id -created_at -updated_at -__v') // Exclude fields from the Customer model
            .populate({
                path: 'contact_persons',
                select: '-_id -created_at -updated_at -__v', // Exclude fields from the ContactPerson model
            })
            .populate({
                path: 'addresses',
                select: '-_id -created_at -updated_at -__v', // Exclude fields from the Address model
            });
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createCustomer = async (req, res) => {
    const { intnr, type, contact_persons, addresses } = req.body;

    try {
        const newCustomer = new Customer({
            intnr,
            type,
            contact_persons,
            addresses,
        });

        const savedCustomer = await newCustomer.save();
        res.status(201).json(savedCustomer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.find({ intnr: req.params.id })
            .select('-_id -created_at -updated_at -__v') // Exclude fields from the Customer model
            .populate({
                path: 'contact_persons',
                select: '-_id -created_at -updated_at -__v', // Exclude fields from the ContactPerson model
            })
            .populate({
                path: 'addresses',
                select: '-_id -created_at -updated_at -__v', // Exclude fields from the Address model
            });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCustomer = async (req, res) => {
    const intnr = req.body.intnr;
    const { first_name, last_name } = req.body.contact_persons[0]; // Assuming fields
    // find Customer
    const customer = await Customer.findOne({ intnr: intnr });

    // Update the 'updated_at' field
    updated_at = new Date();
    try {

        // Update the first ContactPerson document in the array
        const updatedContactPerson = await ContactPerson.findByIdAndUpdate(
            customer.contact_persons,
            { $set: { first_name, last_name, updated_at: updated_at } },
            { new: true }
        );

        if (!updatedContactPerson) {
            return res.status(404).json({ message: 'ContactPerson not found' });
        }

        // Update the 'updated_at' field in the Customer document
        const updatedCustomer = await Customer.findOneAndUpdate(
            { intnr: intnr },
            { $set: { updated_at: updated_at } },
            { new: true }
        );


        if (!updatedCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.json(updatedCustomer);
    } catch (error) {
        console.error('Error updating customer:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findOneAndDelete({ intnr: req.params.id });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        //await customer.remove();
        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Function to parse CSV file data and create/update customers
const parseCSVAndCreateCustomers = async (fileName, res) => {
    const customers = [];
    try {
        // Parse CSV data from the buffer
        if (!fileName) {
            throw new Error('No file uploaded');
        }

        // Create a Map to store processed contact persons and addresses
        const contactPersonsMap = new Map();
        const addressesMap = new Map();

        const customers = [];

        const filePath = 'uploads/' + fileName;
        const fileStream = fs.createReadStream(filePath);
        const rows = await csvParser().on('data', async (data) => {

            const intnr = data['A'];

            if (!intnr) {
                console.warn('Skipping record with null intnr:', data);
                return;
            }

            // Handle contact persons
            const contactPersonKey = `${intnr}_${data['C']}_${data['D']}_${data['E']}`;
            if (!contactPersonsMap.has(contactPersonKey)) {
                const newContactPerson = new ContactPerson({
                    first_name: data['C'],
                    last_name: data['D'],
                    email: data['E'],
                    mobile_phone: data['F'],
                    birth_date: data['G'],
                });

                const savedContactPerson = await newContactPerson.save();
                contactPersonsMap.set(contactPersonKey, savedContactPerson._id);
            }

            // Handle addresses
            const addressKey = `${intnr}_${data['H']}_${data['I']}_${data['J']}`;
            if (!addressesMap.has(addressKey)) {
                const newAddress = new Address({
                    company_name: data['H'],
                    country: data['I'],
                    city: data['J'],
                    zip: data['K'],
                    fax: data['L'],
                    phone: data['M'],
                    street: data['N'],
                    email: data['O'],
                });

                const savedAddress = await newAddress.save();
                addressesMap.set(addressKey, savedAddress._id);
            }

            // Create or update the customer
            const existingCustomer = await Customer.findOne({ intnr });

            if (existingCustomer) {
                const updatedCustomer = await Customer.findOneAndUpdate(
                    { intnr },
                    {
                        $set: {
                            type: data['B'],
                            contact_persons: [contactPersonsMap.get(contactPersonKey)],
                            addresses: [addressesMap.get(addressKey)],
                        },
                    },
                    { new: true }
                );

                customers.push(updatedCustomer);
            } else {
                const newCustomer = new Customer({
                    intnr,
                    type: data['B'],
                    contact_persons: [contactPersonsMap.get(contactPersonKey)],
                    addresses: [addressesMap.get(addressKey)],
                });

                const savedCustomer = await newCustomer.save();
                customers.push(savedCustomer);
            }

        }).on('end', () => {
            // Delete the file after processing if needed
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                }
            });

            res.json({ message: 'Customers created/updated successfully', customers });
        });

        fileStream.pipe(rows);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Route to handle CSV file upload for customers
exports.uploadCustomers = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Call the function to parse CSV and create/update customers
        await parseCSVAndCreateCustomers(req.file.filename, res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Route to handle CSV file upload for uploadContactPersons
exports.uploadContactPersons = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Call the function to parse CSV and create/update customers
        await parseCSVAndCreateCustomers(req.file.buffer, res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Route to handle CSV file upload for uploadAddresses
exports.uploadAddresses = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Call the function to parse CSV and create/update customers
        await parseCSVAndCreateCustomers(req.file.buffer, res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
