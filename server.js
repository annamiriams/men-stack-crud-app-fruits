// ------------------------DEPENDENCIES------------------------

// begin by loading express dependency
const express = require('express');

// create a variable app that runs express function
const app = express();

// require mongoose
const mongoose = require('mongoose');

// require dotenv file
const dotenv = require('dotenv');

// loads environment variables from the .env file
dotenv.config();

// paul's preference to create a variable for port
const port = process.env.PORT;



// --------------------------MIDDLEWARE--------------------------


// connect to mongodb using the connection string in the .env file
mongoose.connect(process.env.MONGODB_URI);
// log connection status to terminal on start
// a Mongoose event listener that runs the supplied callback function once we have connected to a database
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// import fruit model
const Fruit = require('./models/fruit.js');

// just accept that this line is the syntax and it's needed?
// 
app.use(express.urlencoded({ extended: false }));

// ----------------------------ROUTES----------------------------

// I.N.D.U.C.E.S. STRUCTURE/ORDER OF OPERATIONS
// index, new, delete, update, create, edit, show


// GET/TEST ROUTE (test in the browser)
// app.get('/', async (req, res) => {
//     res.send('Hello');
// });

// GET ROUTE/ROOT ROUTE
// INDEX route
app.get('/', async (req, res) => {
    // we need to use .render instead of .send so that we can render our EJS template as HTML
    res.render('index.ejs');
});

// NEW route (GET)
app.get('/fruits/new', (req, res) => {
    // res.send('This is my new route.');
    // eventually replace line above with line below
    res.render('fruits/new.ejs');
});

// DELETE route
// UPDATE route

// CREATE route
app.post('/fruits', async (req, res) => {
    // console.log(req.body);
    if (req.body.isReadyToEat === 'on') {
        req.body.isReadyToEat = true;
    } else {
        req.body.isReadyToEat = false;
    }
    await Fruit.create(req.body);
    res.redirect('/fruits/new');
});

// EDIT route
// SHOW route



// ----------------------------PORTS----------------------------

// make sure app is listening on a port (using variable port instead of just entering the port number so port logs in a different color, which paul likes)
app.listen(port, () => {
    console.log('Listening on port', port);
});
