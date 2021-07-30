const mongoose = require ('mongoose') 

const productSchema = new mongoose.Schema({   // to pass schema of the product
name: {   // name of product 
    type:String , 
    required:[true,'Please enter product name'], // Array because malai message ni pass garnu xa 
    trim:true, // whitespaces start-end dekhi hataidinxa
    maxLength:[100,'Product name cannot exceed 100 character'] // 100 ota bhanda besi character halna mildaina. ani tyo bhayo bhane tyo lekheko error hanxa.
} , price : { 
    type:Number , 
    required:[true,'Please enter product price'],
    maxLength:[5,'Product name cannot exceed 100 character'],
    default : 0.0  // 0.0 dollars 
} ,

description: { 
    type:String , 
    required:[true,'Please enter product description'],
    
} ,

ratings : {  // Yo chei average rating which means => If one user gives 5 star and the other gives 4 then the average would be 4.5 stars
    type : Number, 
    default: 0 
}, 
images: [{     // array because thre are going to multiple images of the products
public_id   : { 
    type :String, 
    required :true     //cloudnary chei third party app ho ja chei ma images haru store garxu.yes ma chei we only need to store 2 things imageId and ImageUrl. Yaha image id public_id ho bhane url lekheko object chei yesko url ho
}  ,    

url : { 
    type: String, 
    required: true
},

}], 

category : { 
    type: String, 
    required: [true, 'Please select category for this product'],
    enum:{ 
        values:['Electronics',           // Creating categories.
                'Cameras', 
                'Laptops', 
                'Accessories',
                'Headphones',
                'Food', 
                'Books',
                'Clothes/Shoes',
                'Beauty/Health', 
                'Sports',
                'Outdoor', 
                'Home'
], 
message : 'Please select the correct category for product'   // if you dont slect the coorect category than this will be shown.
}
    }, seller : { 
        type:String, 
        required : [true,'Please enter product seller']
    }, 
    stock : { 
        type:Number, 
        required : [true,'Please enter product stock'],
        maxLength:[5,'Product cannot exceed 5 characters'],
        default: 0

    }, 
    numOfReviews: { 
        type:Number, 
        default:0 
    } , 

    reviews : [ {  // Reviews array ma nam, rating ra comment obj banako
        name: {  
            type:String, 
            required:true
        } , 
        rating: { 
            type:Number,
            required:true
        }, 
        comment: { 
            type:Number,
            required:true
        }
    }] ,
    
    user: { 
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required:true

    },
    

    createdAt :  { 
        type:Date, 
        default: Date.now // current date dekahuxa
    }




})   
// Inshort 

module.exports = mongoose.model('Product',productSchema); // name of model product ho ani schema chei product schema jun maile mthi banako