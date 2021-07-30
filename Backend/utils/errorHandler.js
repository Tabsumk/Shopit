// Error Handler class 
class ErrorHandler extends Error {   // Error => Parent class and we are using inheritance
    constructor (message,statusCode) {  // constructor ma error-message ra error code halnalai banaye
        super(message); // super bhaneko constructor of parent class wich means yha chei error class ko constructor ho
        this.statusCode = statusCode; 

        Error.captureStackTrace(this,this.constructor) // this bhaneko itself ani this.constructor bhaneko yesko constructor function of this obj. Also this is the function of error class
    }
}

module.exports = ErrorHandler; 