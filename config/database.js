const mongoose = require('mongoose') // moongoose chei surumai install gare the . So aile importing mongoose


const connectDatabase = () => { 
mongoose.connect(process.env.DB_LOCAL_URI,{
   useNewUrlParser : true, 
   useUnifiedTopology:true,
   useCreateIndex:true 
 }).then (con =>  { 
     console.log(`MongoDB Database connected with HOST : ${con.connection.host}`)
 })   //using connect method to connect to my mongoose database and passing url of that database
}

module.exports = connectDatabase