const mongoose =  require("mongoose")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    age:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
    },
    role:{
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
        require: true
    },
    number:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true,
        },
    userName:{
        type:String,
        require:true,
    },
    profilePic:{
        type:String,
    },
    otp: {
        type: Number
      },
    isVerified: {
        type: Boolean,
        default: false
      },
});
userSchema.set("timestamps",true);
module.exports =mongoose.model("user",userSchema);

