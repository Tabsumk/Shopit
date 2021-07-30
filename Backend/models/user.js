const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt =require('jsonwebtoken')
const crypto = require('crypto')



const userSchema = new mongoose.Schema( { 
name: { 
    type: String, 
    required:[true,'Please Enter Your Name'],
    maxLength:[30,'Your name cannot exceed 30 characters']
}, 
email :{ 
    type: String, 
    required:[true,'Please enter you email'], 
    unique:true, // cannot havve 2 user with same email
    validate: [validator.isEmail,'Please enter valid email address.'] // Email ho ki nai validate garxa validator le 

}, 

password : { 
    type:String, 
    required: [true,' Please enter your password.'],
    minlength:[6,'Your password must be longer than 6 characters.'],
    select:false // yo bhaneko java malai user display garna man lagxa, yesle password chei dekhaudaina 

}, 

avatar: { 
    public_id: {     //cloudnary dekhi gareko so  id ra url matra chianxa.
        type:String, 
        required:true
    }, 
    url : { 
        type:String, 
        required:true
    }
} , 

role : { 
    type : String,
    default: 'user'  // suru ma login garda user hunxa role
} , 
createdAt: { 
    type:Date,
    default: Date.now
}, 
resetPasswordToken: String, //Password birsida email ma token pathaune
resetPasswordExpire:Date // tei pathako token ko expiry date.

})


//Encrypting password before saving user 
userSchema.pre('save',async function (next) {   // used function keyword instead of arrow function because 'this' keyword arrow ma launa mildaina.
    //userSchema.pre bhaneko chei before saving userSchema i have to do something.

    if(!this.isModified('password')) { 
        next()   
    }
    this.password = await bcrypt.hash(this.password,10) // 10 chei salt value bhanxa . Salt value bhaneko chei hash ko length ho . Jati bigger value halxa teti strong hunxa password
})

//Compare user password
userSchema.methods.comparePassword = async function(enteredPassword) { 
    return await bcrypt.compare(enteredPassword, this.password) // bcrypt.compare le chai mero 2 ta password compare garauxa.
}



//Return JWT token. => JWT bhaneko json web token.
userSchema.methods.getJwtToken= function () { 
    return jwt.sign({id:this._id }, process.env.JWT_SECRET,{  //this._id will be id of user
        expiresIn:process.env.JWT_EXPIRES_TIME
    });
}

//Generate password reset token 

userSchema.methods.getResetPasswordToken= function (){ 
    //Generate Token 

    const resetToken= crypto.randomBytes(20).toString('hex') // Random 20 bytes generate greko ra teslai string ma haleko

    // Hash and set to resetPasswordToken  

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest ('hex')  // hash create gareko ra resetToken ma hash haaleko

    //Set token expire time 

    this.resetPasswordExpire = Date.now() + 30 * 60* 1000 //30 mins paxi expire hunxa token

    return resetToken;
}



module.exports = mongoose.model('User',userSchema);