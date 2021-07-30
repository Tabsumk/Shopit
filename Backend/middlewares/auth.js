//checks if user is authneticated or not

const User = require('../models/user')
const jwt = require("jsonwebtoken");
const user = require("../models/user");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");

exports.isAuthenticatedUser = catchAsyncErrors(async(req,res,next)=> {

    const {token} = req.cookies; 

    if(!token) { // Token xaina bhne 
        return next(new ErrorHandler('Login first to access this resource',401))
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET)  // Jwt verify le user verify garxa. tesko lagi cookie dekhi token leko jun chei milxa mildaina bhnera check garxa
    req.user = await user.findById(decoded.id);
    next()

})

//Handling users roles 
exports.authorizeRoles = (...roles) => { 
    return (req,res,next) => { 
        if(!roles.includes(req.user.role)) {
            return next (
         new ErrorHandler( `Roles (${req.user.role}) is not allowed to access this resource`,403))   
        }
        next()
    }
}