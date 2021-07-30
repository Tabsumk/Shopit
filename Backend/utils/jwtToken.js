// Create and send Token and save in the cookie 

const sendToken = (user,statusCode,res) => { 


//Create JWT Token 

const token = user.getJwtToken(); 

//options for cookie 

const options = { 
    expires : new Date(
        Date.now()+ process.env.COOKIE_EXPIRES_TIME * 24* 60 * 60 * 1000  //24 hr ,60 mins ,60s ,1000 ms . Expiring cookie and converting it to milisecond 
        ), 
        httpOnly:true,  // httpOnly nabhko cookie chei js code bata acess garna milxa hack garna. Also cookie hmile httpOnly ma haleko so it is more safer then puting it in local storages
}

 res.status(statusCode).cookie('token',token,options) // key 'token' ani value chei token jun mathi specify garya xa
 .json({ 
     success:true, 
     token,
     user
 })
}

module.exports =sendToken;