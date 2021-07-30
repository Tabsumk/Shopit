class APIFeatures { 
    constructor(query,queryStr) {     // Product.find() query hunxa. 
        this.query=query; 
        this.queryStr=queryStr
        
    }

    search() { 
        const keyword = this.queryStr.keyword ? {  // This.queryString.keyword bhaneko chei req.query ho product controller.js ma 
            name : {  // So in short : bhaneko ternary operator ho ra queryStr.Keyword exist garxa ? bhaneko ho ra garxa bhane yo product lai databse ma search gar haina bhane empty obj banaide or do nothing bhaneko 
               $regex:this.queryStr.keyword,  //regex le chei keyword search garxa name ma 
               $options: 'i'           // i = case sensetive
             } 
        } : { }; 
        
        this.query= this.query.find({...keyword}); // yaha chei yo keyword bhanne complete object find { } bhitra paryo ra $regex le hamile haleko nam auxa ra teslai nai yesle search garxa.
        return this;

    }
    

    filter() { 
        
        const queryCopy = {...this.queryStr}; 

        

        // Removing fields from query 
        const removeFields = ['keyword', 'limit', 'page']
        removeFields.forEach(el=> delete queryCopy[el]); // keyword hataidinxa ani category matra hunxa.
        //console.log(queryCopy) gte , lte auxa ra we know node js ma $ lagxa

        // Filter for price
        let queryStr = JSON.stringify(queryCopy) //since queryCopy chei object ho converting it to string so that i can use string functions.
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match=>`$${match}`) // k garxa bhanda mathi ko le query copy lai string banayera queryStr ma value halyo,
        //aba yo replace le chei gt => greaterthan gte => greaterthan equal to and so on. lai chai khojera tesko agadi $ haldinxa. 

        //console.log(queryStr) //=> aba chei $gte  $lte auxa 
        this.query=this.query.find(JSON.parse (queryStr));
        return this;

    }

    //Adding Pagination
    
    pagination(resPerPage) { 
        const currentPage = Number(this.queryStr.page) || 1; // postman ma ?page=2 halda yesma store hunxa
        const skip = resPerPage *(currentPage-1); // yo chei skip gareko. for eg, euta pge ma 4 ota matra product rakhey bhane 3 page ma 12 ota product aatxa
        // so like i said , euta page ma 4 ota result or resPErPage=4 rakhey bhaney ra malai page 2 ma jana man lagyo bhane yo code le chei (Current page =2   - 1 ) = 1 gardinxa ra 4 *1 = 4 bhaneko 4 ota product page 1 ko skip hunxa. Yesto garda page alik fst hunxa.


        this.query= this.query.limit(resPerPage).skip(skip) // limit bhaneko i want to limit number of products returned in a page limit(resPerPage) bhaneko 4 ota product euta page ma limit garxa ra .skip(skip) bhaneko chei (skip) chei variable ho jun mathi banako xu yesma chei mathi explain garya xu. so skip ma 4 ayo bhane 4 ot aproduct skip garxa.
        return this;
    }

}


module.exports = APIFeatures;