<template>
    <div class="customers-page">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-4 left-side">
                    <h3>{{ userInfo.data.name }}</h3>
                    <p>Last Login: {{ userInfo.data.lastLogin }}</p>
                    <div class="upload-section">
                        <h4>Customer CSV Upload</h4>
                        <div>
                            <button class="btn btn-primary upload-button" @click="handleUpload('customers')">Upload
                                Customer</button>
                        </div>
                        <div>
                            <button class="btn btn-primary upload-button" @click="handleUpload('contactPersons')">Upload
                                Contact Person</button>
                        </div>
                        <div>
                            <button class="btn btn-primary upload-button" @click="handleUpload('addresses')">Upload
                                Address</button>
                        </div>
                    </div>
                </div>

                <div class="col-md-8 right-side">
                    <div class="header">
                        <!-- Header content goes here -->
                    </div>
                    <b-modal v-if="showModal" :visible="showModal" title="Edit Customer" @ok="saveChanges"
                        @cancel="cancelEdit">
                        <!-- Your form or input fields for editing customer data -->
                        <div class="form-group">
                            <label for="customerName">Customer First name:</label>
                            <input v-model="editedCustomer.contact_persons[0].first_name" type="text" class="form-control"
                                id="customerName" required>
                        </div>
                        <div class="form-group">
                            <label for="customerName">Customer Last name:</label>
                            <input v-model="editedCustomer.contact_persons[0].last_name" type="text" class="form-control"
                                id="customerName" required>
                        </div>
                    </b-modal>
                    <!-- Display Customers Table using Bootstrap-styled table -->
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th v-for="field in tableFields" :key="field.key" @click="sort(field.key)">
                                    {{ field.label }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="customer in customers" :key="customer.intnr">
                                <td>{{ customer.intnr }}</td>
                                <td>{{ customer.contact_persons[0].first_name }}</td>
                                <td>{{ customer.contact_persons[0].last_name }}</td>
                                <td>{{ customer.addresses[0].company_name }}</td>
                                <td>{{ customer.addresses[0].country }}</td>
                                <td>{{ customer.addresses[0].zip }}</td>
                                <td>{{ customer.addresses[0].street }}</td>
                                <td>
                                    <button class="btn btn-danger" @click="deleteCustomer(customer.intnr)">Delete</button>
                                    <button class="btn btn-warning" @click="editCustomer(customer.intnr)">Edit</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="footer">
                        <!-- Footer content goes here -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
  
<script>
import moment from 'moment';

export default {
    data() {
        return {
            showModal: false,
            editedCustomer: {},  // Object to hold edited customer data
            customers: [], // Array to store customers
            userInfo: {},
            tableFields: [
                { key: 'intnr', label: 'Internal number', sortable: true },
                { key: 'contact_persons[0].first_name', label: 'First name', sortable: true },
                { key: 'contact_persons[0].last_name', label: 'Last name', sortable: true },
                { key: 'addresses[0].company_name', label: 'Company name', sortable: true },
                { key: 'addresses[0].country', label: 'Country', sortable: true },
                { key: 'addresses[0].zip', label: 'Zip/City', sortable: true },
                { key: 'addresses[0].street', label: 'Address', sortable: true },
                { key: 'actions', label: 'Actions' },
            ],
            sortBy: 'intnr', // Default sorting column
            sortDesc: false, // Default sorting order
        };
    },
    mounted() {
        this.getUserInfo();
        // Fetch customers from the backend upon component mount
        this.fetchCustomers();
    },
    methods: {

        async handleUpload(uploadType) {
            try {
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = '.csv';
                fileInput.onchange = async () => {
                    const file = fileInput.files[0];
                    const formData = new FormData();
                    formData.append('file', file);

                    // Adjust the API endpoint as per your backend
                    await this.$axios.post(`/api/upload/${uploadType}`, formData);

                    // Fetch customers after successful upload
                    await this.fetchCustomers();
                };

                fileInput.click();
            } catch (error) {
                console.error('Error handling file upload:', error);
                // Handle error and show user-friendly message
            }
        },

        async sort(column) {
            // Implement sorting logic
            // Adjust the API endpoint as per your backend
            const response = await this.$axios.get(`/api/customers?sort=${column}`);
            this.customers = response.data;
        },
        async deleteCustomer(customerId) {
            try {
                // Adjust the API endpoint as per your backend
                await this.$axios.delete(`/api/customers/${customerId}`);

                // Fetch customers after successful deletion
                await this.fetchCustomers();
            } catch (error) {
                console.error('Error deleting customer:', error);
                // Handle error and show user-friendly message
            }
        },
        async editCustomer(customerId) {

            // Find the customer in the array by ID
            const response = await this.$axios.get(`/api/customers/${customerId}`);
            const customerToEdit = response.data;

            // Make a copy of the customer data to avoid directly modifying the original
            this.editedCustomer = { ...customerToEdit[0] };
            // Show the edit modal
            this.showModal = true;
        },
        async saveChanges() {
            try {
                // Assuming your customer has an '_id' property
                const customerId = this.editedCustomer._id;

                // Update the customer in the backend
                const response = await this.$axios.put(`/api/customers/${customerId}`, this.editedCustomer);
                await this.fetchCustomers();

                // Close the modal
                this.showModal = false;
            } catch (error) {
                console.error('Error updating customer:', error);
                // Handle error and show user-friendly message
            }
        },
        cancelEdit() {
            // Close the modal without saving changes
            this.showModal = false;
        },
        async fetchCustomers() {
            try {
                // Adjust the API endpoint as per your backend
                const response = await this.$axios.get('/api/customers');
                this.customers = response.data.filter(customer => {
                    return (
                        customer.contact_persons.length > 0 &&
                        customer.contact_persons[0] !== {} &&
                        customer.addresses.length > 0 &&
                        customer.addresses[0] !== {}
                    );
                }).map(customer => ({
                    ...customer
                }));

                //console.log('Transformed customers:', this.customers);
            } catch (error) {
                console.error('Error fetching customers:', error);
                // Handle error and show user-friendly message
            }
        },
        rowClicked(item) {
            // Handle row click event if needed
            console.log('Row clicked:', item);
        },
        async getUserInfo() {
            // get User Information
            const email = localStorage.getItem('email');
            this.userInfo = await this.$axios.get(`/api/user/${email}`);
            this.userInfo.data.lastLogin = this.formatLastLogin(this.userInfo.data.lastLogin)
        },
        formatLastLogin(lastLogin) {
            return moment.utc(lastLogin).format('DD.MM.YYYY');
        },
    },
};
</script>
  
<style scoped>
.customers-page {
    display: flex;
    justify-content: space-between;
    height: 100vh;
    background-color: rgba(106, 122, 181, 255);
    /* Full viewport height */
}

.left-side {
    width: 25%;
    /* Blue color, adjust as needed */
    padding: 2rem;
    display: flex;
    flex-direction: column;
}

.upload-button {
    background-color: #d5d9d7;
    color: black;
    /* Green color, adjust as needed */
    width: 100%;
    height: 100%;
    padding: 1rem;
    margin-bottom: 2rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.right-side {
    width: 75%;
    display: flex;
    flex-direction: column;
}

.header,
.footer {
    /* Blue color, adjust as needed */
    padding: 2rem;
    color: #fff;
}


.table-container {
    flex-grow: 1;
    overflow-y: auto;
    background-color: #ddd;
    /* Enable vertical scrolling if the content overflows */
}

.customers-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 2rem;
}

.customers-table th,
.customers-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

.customers-table th {
    background-color: #3498db;
    color: #fff;
}

.delete-button,
.edit-button {
    background-color: #e74c3c;
    /* Red color, adjust as needed */
    color: #fff;
    padding: 8px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 5px;
}

.edit-button {
    background-color: #f39c12;
    /* Orange color, adjust as needed */
}
</style>
  
