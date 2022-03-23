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
        title:'Upload Sermon'
    })
}

module.exports.postUpload=(req,res,next)=>{
    console.log(req.body);
    res.redirect('/upload');
}