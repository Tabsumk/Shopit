const app = require('./app')
const connectDatabase = require('../config/database')

const dotenv = require('dotenv');

//Handle Uncaught Exception

process.on('uncaughtException',err=>{    // SO in short, Jatikhera program le uncaughtException bhetxa , tesle err bhanne call back function call garxa jasle chei kun error ho ra server kun error le banda huna lagya xa bhanera dekhauxa. ani close gardinxa 
  console.log(`ERROR : ${err.message}`)  ;
  console.log(`Shutting server due to Uncaught Exception`)
  process.exit(1);
})

//Config file set gareko
dotenv.config({ path: 'config/config.env'}); // =>  Yesko path



//connecting to database 
connectDatabase();

const server = app.listen(process.env.PORT, ()=>{ 
    console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
})

//handle Unhandled Promise Rejections 

process.on('unhandledRejection',err=> {  // SO, whenever unhandledpromis rejection bhetxa , yo block le k error thiyo dekhauxa, ani server kina banda hudai xa bhanera ni dekauxa. Tespaxi server close gardinxa.
    console.log(`ERROR : ${err.message} `);
    console.log('Shutting down the server due to Unhandled Promise Rejection'); 
    server.close(() => { 
        process.exit(1)
    })

})



