# SellCars Customer Module

## Project Introduction
SellCars is a car dealer company that specializes in selling vehicles to other car dealers, companies, and private individuals. The company's existing system works well, but there is a need for additional features and improvements. Employees have reported difficulties with the existing "Customer Module," which has led to inefficiencies in their work. To address this issue, SellCars has decided to revamp the Customer Module to make it more user-friendly and efficient.

## Assignment
The assignment is to develop a new Customer Module for SellCars, incorporating all the requested features. Additionally, a functional Login page will be implemented for testing purposes.

## Preparations
### Webserver
Docker will be used to set up the web server environment, including all related dependencies.

### Database
MongoDB will be used as the database solution for storing customer and related data.

### Backend Development
Node.js will be utilized for backend development, providing a robust and scalable server-side environment.

### Frontend Development
Vue.js 2 (Options API) and Bootstrap will be the primary technologies for frontend development, enabling the creation of responsive and intuitive user interfaces.

## Getting Started
Follow the steps below to set up and run the project:

1. **Clone Repository**: Clone the SellCars repository to your local machine.

2. **Backend Configuration**:
   - Navigate to the backend directory.
   - Install dependencies using `npm install`.
   - Set up environment variables if necessary.
   - Start the backend server using `npm start`.

3. **Frontend Configuration**:
   - Navigate to the frontend directory.
   - Install dependencies using `npm install`.
   - Configure API endpoint URLs if required.
   - Start the frontend development server using `npm run dev`.

4. **Accessing the Application**:
   - Once both backend and frontend servers are running, access the application by visiting the specified URL in your web browser.

## Configuration
- Backend: Modify the .env file to configure environment variables if necessary.
- Frontend: Modify the .env file to configure environment variables if necessary.

## Backend Setup
1. Navigate to the backend directory. [ cd backend ]
2. Run `npm start` to start the backend server. 
   This will start the backend server and it will be accessible at the configured port.

## Frontend Setup
1. Navigate to the frontend directory.
2. Run `npm dev` to start the frontend server.
   This will start the development server and you can access the project at http://localhost:8080.

## Usage


## Endpoints
// Backend Endpoints

## Authentication Routes
- **POST /login**: Endpoint for user login.

## User Info
- **GET /user/:email**: Endpoint to retrieve user information based on email.

## Customer Routes
- **GET /customers**: Retrieve all customers.
- **GET /customers/:id**: Retrieve a specific customer by ID.
- **POST /customers**: Create a new customer.
- **PUT /customers/:id**: Update an existing customer.
- **DELETE /customers/:id**: Delete a customer.

## Customer Upload Routes
- **POST /upload/customers**: Upload a CSV file containing customer data.
- **POST /upload/contactPersons**: Upload a CSV file containing contact person data.
- **POST /upload/addresses**: Upload a CSV file containing address data.

## Error Handling
- **404 Not Found**: Handle requests for non-existent routes.

---
Note: Ensure proper authentication (JWT token) for accessing authenticated endpoints.

## Contributing


## Credits
- 

## License
