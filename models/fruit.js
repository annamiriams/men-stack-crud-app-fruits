// singular because here we're defining what a FRUIT is, not what all fruits are

// import mongoose
const mongoose = require('mongoose');

// create fruit schema
const fruitSchema = new mongoose.Schema({
    name: String,
    isReadyToEat: Boolean,
});

// create/register the model 
const Fruit = mongoose.model('Fruit', fruitSchema);

// export the model
module.exports = Fruit;