const mongoose =  require("mongoose")

const bookSchema = new mongoose.Schema({
    bookName:{
        type:String,
        require:true,
    },
    authorName:{
        type:String,
        require:true,
    },
    price:{
        type:String,
        require:true,
    },
    description:{
        type:String,
        require:true,
    },
    bookImage:{
        type:String,
    },
    bookQuantity: {
        type: Number
      },
    isActive:{
        type:String,
        default:true
    }
});
bookSchema.set("timestamps",true);
module.exports =mongoose.model("book",bookSchema);