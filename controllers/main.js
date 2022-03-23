require('dotenv').config();
const Video=require('../models/video');

module.exports.getMain=async(req,res,next)=>{
    res.render('main',{
        title:'Sermons'
    });
}

module.exports.getSermon=(req,res,next)=>{
    res.render('video',{
        title:'Sermon'
    })
}

module.exports.getUpload=(req,res,next)=>{
    res.render('upload',{
        title:'Upload Sermon',
        errors:[]
    })
}

module.exports.postUpload=async(req,res,next)=>{
    if(
        req.body.title.trim().length==0||
        req.body.link.trim().length==0||
        req.body.category.trim().length==0||
        req.body.speaker.trim().length==0||
        req.body.date.trim().length==0||
        req.body.password.trim().length==0
    ){
        res.render('upload',{
            title:'Upload Sermon',
            errors:["Fields Must Not Be Empty"]
        })
    }else if(req.body.password.trim()!=process.env.PASSWORD){
        res.render('upload',{
            title:'Upload Sermon',
            errors:["Password Incorrect"]
        })
    }else{
        await Video.create({
            title:req.body.title.trim(),
            category:req.body.category.trim(),
            speaker:req.body.speaker.trim(),
            link:req.body.link.trim(),
            date:req.body.date.trim()
        })
    res.redirect('/upload');
    }
}