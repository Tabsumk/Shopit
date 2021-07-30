
const Product = require('../models/product')


const ErrorHandler = require('../utils/errorHandler')
//Create new product => /api/v1/product/new (yesma janxa)

const catchAsyncErrors = require('../middlewares/catchAsyncErrors') //importing

const APIFeatures = require('../utils/apiFeatures')

exports.newProduct= catchAsyncErrors (async (req,res,next) =>  {  // async function because i have to use await in it. 
    req.body.user = req.user.id;  

const product = await Product.create(req.body) // body dekhi sab data liyera product banako.
res.status(201).json({ 
    succcess:true, 
    product
})
})

//Get all products => /api/v1/products?keyword =apple

exports.getProducts =catchAsyncErrors(async(req,res,next) => { 

    req.body.user = req.user.id; 
    
    const resPerPage =4; //  10 ota product xa bhane ni euta page ma 4 ota product matra dekhauna lai
       const productCount = await Product.countDocuments();


       
const apiFeatures = new APIFeatures(Product.find(),req.query) 
                        .search().filter().pagination(resPerPage)


    const products = await apiFeatures.query;

    res.status(200).json({
        succcess:true, 
        count:products.length,
        productCount,
        products
    })
})


// get single product details => /api/v1/admin/product/:id   => Id search garera product nikalna lai. Ani yo role /admin ko ho 

exports.getSingleProduct= catchAsyncErrors (async(req,res,next) => { 
    
    const product= await Product.findById(req.params.id) //FindByID method le chei id dekhi prouct khojxa. params.id=>  paramerter of id 
    if (!product) {  // product bhetena bhanye
        return next(new ErrorHandler ('Product not Found' , 404)); // Applying error handler.
    }

    res.status(200).json({  // Id dekhi product match bho bhane dekhhauxa
        success:true, 
        product
    })
})

// update product => /api/v1/admin/product/:id  Role => admin

exports.updateProduct =catchAsyncErrors ( async(req,res,next)=>  {
    let product = await Product.findById(req.params.id); // First finding the product by id 

    if (!product) {  
        return next(new ErrorHandler ('Product not Found' , 404)); 
    }

        product = await Product.findByIdAndUpdate(req.params.id,req.body,{
            new: true, 
            runValidators:true,
            useFindAndModify:false
        }); // This will find the product and update it 

        res.status(200).json({
            success:true,
            product
        })
 } ) 


 // Delete Product => admin ko role => /api/v1/admin/product/:id 

 exports.deleteProduct = catchAsyncErrors (async (req,res,next) =>  { 

    const product = await Product.findById(req.params.id);
    
     if (!product) {  
        return next(new ErrorHandler ('Product not Found' , 404)); 
    }
    
    await product.remove();

    res.status(200).json({
        sucess:true, 
        message: 'Product is deleted'
    })

} )