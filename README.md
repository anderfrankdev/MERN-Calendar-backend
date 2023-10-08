# MERN Calendar

This is a web application that allows users to create, edit, delete and view events on a calendar. It is built with the MERN stack, which consists of MongoDB, Express.js, React.js and Node.js, and uses TypeScript for static type checking.

## Features

- User authentication with JWT and bcrypt
- CRUD operations for events
- Responsive user interface with Bootstrap
- Unit test with vitest.

## Installation

To install this project, follow these steps:

1. Clone this repository
2. Make sure you have Node.js, and npm installed on your machine
3. Create a cluster on MongoDB Atlas and get the database URI
4. Create a `.env` file in the `server` folder and add the following variables:
   - `PORT`: the port number for the server (default is 5000)
   - `MONGO_URI`: the database URI from MongoDB Atlas
   - `JWT_SECRET`: a secret key for JWT
5. Run `npm install` to install dependencies
6. Run `npm start` to start.

## Usage

To use this application, you need to register an account or log in with an existing one. You can also use social login with Apple, Facebook or Google. Once you are logged in, you can see the calendar view with your events. You can create a new event by clicking on a date or time slot, edit an existing event by clicking on it, or delete an event by dragging it to the trash bin icon. You can also switch between different views (month, week, day) and navigate through the calendar.

## Testing

To run the tests for this project, follow these steps:

1. Run `npm test` in the root folder to run the client tests

## License

This project is licensed under the MIT License - see the LICENCE file for details
