const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const videoSchema=new Schema({
    date:{
        type:Date,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    speaker:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model('video',videoSchema);