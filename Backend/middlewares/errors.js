const ErrorHandler = require('../utils/errorHandler');

module.exports=( err,req,res,next) => { 
    err.statusCode=err.statusCode ||500; // if statuscode dont exist than 500 will be default.
   
    if (process.env.NODE_ENV==='DEVELOPMENT') { // Jaba development mode ma hunxa
        res.status(err.statusCode).json({ 
            sucess:false, 
            error:err,
            errMessage:err.message,
            stack:err.stack             // So in short development ma huda i want to dispaly all the error stuff like stack, eror message , error itself ani success false bhako.
        })
    }
     
    if (process.env.NODE_ENV==='PRODUCTION') { 
        let error = {...err} // err ko copy banako .
        error.message = err.message;

        // Wrong Mongoose Object id error => Jaba product id jpaye tei lekhda or namileko case ma 
         if (err.name === `CastError`) { 
             const message = `Resource not found. Invalid ${err.path}` // path ma chei _id dinxa.
             error = new ErrorHandler(message,400)
         }


         // Handling mongoose validation error. 

         if(err.name ==='ValidationError') { 
             const message = Object.values(err.errors).map(value=>value.message);
             error = new ErrorHandler(message,400)
         }

        res.status(error.statusCode).json({ 
            success:false, 
            message:error.message || 'Internal Server Error'
        })
    }


   
}