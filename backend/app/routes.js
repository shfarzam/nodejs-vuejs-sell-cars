const express = require('express');
const router = express.Router();
const authController = require('./controllers/authController');
const customerController = require('./controllers/customerController');
const authenticateToken = require('./service/authentication');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Authentication Routes
router.post('/login', authController.login);

//User Info
router.get('/user/:email', authenticateToken, authController.userInfo);

// Customer Routes
router.get('/customers', authenticateToken, customerController.getAllCustomers);
router.get('/customers/:id', authenticateToken, customerController.getCustomerById);
router.post('/customers', authenticateToken, customerController.createCustomer);
router.put('/customers/:id', authenticateToken, customerController.updateCustomer);
router.delete('/customers/:id', authenticateToken, customerController.deleteCustomer);

// Customer Upload Routes
router.post('/upload/customers', authenticateToken, upload.single('file'), customerController.uploadCustomers);
router.post('/upload/contactPersons', authenticateToken, upload.single('file'), customerController.uploadContactPersons);
router.post('/upload/addresses', authenticateToken, upload.single('file'), customerController.uploadAddresses);

// 404
router.get('*', function (req, res) {
    res.send("<h1>Page not found on the server</h1>", 404);
});

module.exports = router;