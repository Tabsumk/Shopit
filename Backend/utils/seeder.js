const Product = require('../models/product'); // importing product 
const dotenv = require('dotenv'); //importing dot env to connect database
const connectDatabase= require('../../config/database');

const products = require ('../data/products'); // Yo chei product ho jun chei push hunxa db ma

//Setting dotenv file

dotenv.config({path: 'config/config.env'})

connectDatabase(); 
const seedProducts = async() => { 
    try {   
        await Product.deleteMany(); //This will chei delete all the products
        console.log(`Products are deleted`);

        await Product.insertMany(products) // Now this will again add all the products . Line 5 ma import gareko products ho. 
        console.log('All products are added'); 

        process.exit();
    } catch (error) { 
        console.log(error.message); //Shows error
        process.exit(); //Exits from this process
    }
}

seedProducts();