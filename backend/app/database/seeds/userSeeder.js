const mongoose = require('mongoose');
const crypto = require('crypto')
const User = require('../../models/userModel');
const passwordHash = require('../../service/passwordHash');
const dotenv = require('dotenv');
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const seedUser = [
    {
        first_name: 'Mike',
        last_name: 'Lee',
        email: 'mike@web.de',
        password_hash: '123456'
    },
    {
        first_name: 'John',
        last_name: 'Walk',
        email: 'john@web.de',
        password_hash: 'Aa654321@'
    },
    {
        first_name: 'Armin',
        last_name: 'Lieferando',
        email: 'armin@web.de',
        password_hash: 'ALi654321@'
    }
];

const seedDB = async () => {
    try {
        await User.deleteMany(); // Clear existing data
        await Promise.all(seedUser.map(async (user) => {
            // Hash the password before saving to the database
            user.password_hash = passwordHash.hashPassword(user.password_hash);
            return User.create(user);
        }));
        console.log('Database seeded successfully');
    } catch (error) {
        console.error(`Error seeding the database: ${error.message}`);
    } finally {
        mongoose.connection.close();
    }

};

seedDB().then(() => {
    mongoose.connection.close();
});