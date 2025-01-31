// ------------------------DEPENDENCIES------------------------

// begin by loading express dependency
const express = require('express');

// create a variable app that runs express function
const app = express();

// require mongoose
const mongoose = require('mongoose');

// require method-override
const methodOverride = require('method-override');

// require morgan
const morgan = require('morgan');

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

// mount methodOverride and morgan along with our other middleware, and we're just accepting that this is required without actually understanding what it does...
app.use(methodOverride('_method'));
// if the terminal ever gets crowded, you can comment out this morgan line
app.use(morgan('dev'));
// ----------------------------ROUTES----------------------------

// I.N.D.U.C.E.S. STRUCTURE/ORDER OF OPERATIONS
// index, new, delete, update, create, edit, show


// GET/TEST ROUTE (test in the browser)
// app.get('/', async (req, res) => {
//     res.send('Hello');
// });

// HOME / LANDING PAGE
app.get('/', async (req, res) => {
    // we need to use .render instead of .send so that we can render our EJS template as HTML
    res.render('index.ejs');
});

// INDEX
app.get('/fruits', async (req, res) => {
    // we need to use .render instead of .send so that we can render our EJS template as HTML
    // res.render('index.ejs');
    // find() will find all fruits in our Fruit database
    const allFruits = await Fruit.find();
    // console.log(allFruits);
    res.render('fruits/index.ejs', { fruits: allFruits } );
});

// NEW route (GET)
app.get('/fruits/new', (req, res) => {
    // res.send('This is my new route.');
    // eventually replace line above with line below
    res.render('fruits/new.ejs');
});

// DELETE route
// to make this route work, we need to install method-override and morgan
app.delete("/fruits/:fruitId", async (req, res) => {
    await Fruit.findByIdAndDelete(req.params.fruitId);
    // res.send("This is the delete route");
    res.redirect('/fruits');
});

// UPDATE route (connected with Edit: presents details of a single fruit)
// we rushed through this one
app.put("/fruits/:fruitId", async (req, res) => {
    // Handle the 'isReadyToEat' checkbox data
    if (req.body.isReadyToEat === "on") {
        req.body.isReadyToEat = true;
    } else {
        req.body.isReadyToEat = false;
    }

    // Update the fruit in the database
    await Fruit.findByIdAndUpdate(req.params.fruitId, req.body);

    // Redirect to the fruit's show page to see the updates
    res.redirect(`/fruits/${req.params.fruitId}`);
});

// CREATE route
app.post('/fruits', async (req, res) => {
    // console.log(req.body);
    if (req.body.isReadyToEat === 'on') {
        req.body.isReadyToEat = true;
    } else {
        req.body.isReadyToEat = false;
    }
    await Fruit.create(req.body);
    res.redirect('/fruits');
});

// EDIT route (connected with Update: processes the edit)
app.get('/fruits/:fruitId/edit', async (req, res) => {
    const foundFruit = await Fruit.findById(req.params.fruitId);
    // console.log(foundFruit);
    // just for testing
    // res.send(`This is the edit route for ${foundFruit.name}`);
    res.render('fruits/edit.ejs', { fruit: foundFruit } );
});

// SHOW route
app.get('/fruits/:fruitId', async (req, res) => {
    // res.send here is equivalent to testing in a console.log
    // res.send(`This route renders the show page for fruit id: $
    //     {req.params.fruitId}`);
    // findById and passing it the URL parameter
    const foundFruit = await Fruit.findById(req.params.fruitId);
    res.render('fruits/show.ejs', { fruit: foundFruit } )
});

// ----------------------------PORTS----------------------------

// make sure app is listening on a port (using variable port instead of just entering the port number so port logs in a different color, which paul likes)
app.listen(port, () => {
    console.log('Listening on port', port);
});
