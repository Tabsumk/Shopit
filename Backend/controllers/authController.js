const User= require('../models/user');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail')
const crypto= require('crypto')

//Register a user  => /api/v1/register 
exports.registerUser = catchAsyncErrors(async(req,res,next)=>{ 

    const { name,email,password} = req.body; //gettin name email pw

    const user = await User.create({ 
        name, 
        email,
        password,
        avatar :{ 
            public_id:'avatars/kccvibpsuiusmwfepb3m',
            url:'https://res.cloudinary.com/shopit/image/upload/v1606305757/avatars/kccvibpsuiusmwfepb3m.png'
        }
    })


  sendToken(user,200,res);

})



// Login User  =>  /a[i/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body; //Emial Password req.body dekhi linxa

    // Checks if email and password is entered by user
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 400))
    }

    // Finding user in database
    const user = await User.findOne({ email }).select('+password') 

    if (!user) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    // password thik xa ki nai check garxa
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    sendToken(user,200,res);

})

// Forgot Password => /api/v1/password/forgot 
exports.forgotPassword = catchAsyncErrors(async(req,res,next)=> { 
    const user = await User.findOne({ email: req.body.email}) // User le provide gareko email check gareko

    if (!user) { // If user doesn't exist
        return next(new ErrorHandler('User Not found with this email', 401));

    }
    // Get reset token

    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave:false}) 

    //reset password url banako 

    const resetUrl=`${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}` //http ho ki https check gareko

    const message = `Your password reset token is as follow:\n\n ${resetUrl} \n\n If you have not requested this email, then ignore it.`
   
    try { 
        await sendEmail ({
            email:user.email, 
            subject :'MyE-Shop/Shopit password recovery',
            message
        })
         res.status(200).json({
             success:true, 
             message:`Email sent to : ${user.email}`
         })

    } catch (error) {  // Error bhetyo bhane pwToken ra pwExpire undefined haldeko.
        user.resetPasswordToken = undefined; 
        user.resetPasswordExpire= undefined;

        await user.save({validateBeforeSave:false}) 

        return next(new ErrorHandler(error.message,500))
    }


})

// Reset Passwrd => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async(req,res,next)=> { 
    
    
    
    //Hash url token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')  // req.parms.token ho hash version ho yo


    const user = await User.findOne({  
        resetPasswordToken, // yo chei maile mathi hash gareko token sanga milne token bhako user find gareko
        resetPasswordExpire: {$gt:Date.now() } //Databse ma sved bhako time current time bhanda oviously thulo hunu parxa.

    })

    if (!user) { 
        return next(new ErrorHandler('Password reset token is invalid or has been expired',400))
    }

    if(req.body.password !== req.body.confirmPassword) {  // Haleko password ra confirm pw same bhayena bhne
        return next(new ErrorHandler('Password does not match', 400))
    }

    //Setup new password 
    user.password = req.body.password; 

    user.resetPasswordToken = undefined; 
    user.resetPasswordExpire= undefined;

    await user.save();

    sendToken(user,200,res)

    

 }) 


// Logout User => /api/v1/logout 
exports.logout = catchAsyncErrors(async(req,res,next)=> { 

    res.cookie('token',null,{
        
        expires: new Date(Date.now()), // logout ra expire date same
        httpOnly:true
    //So in short logout kasari hunxa bhana cookie ko token delte bhayesi logout hunxa.
    
    }) 
        //After setting cookie to null from up , yo chei tei response pathako

    res.status (200).json({ 
        success:true, 
        message:'Logged Out!'
    })

})
