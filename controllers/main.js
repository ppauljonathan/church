require('dotenv').config();
const Video=require('../models/video');

const VIDEO_PER_PAGE=3;

module.exports.getMain=async(req,res,next)=>{
    const page=parseInt(req.query.page)||1;
    const videos=await Video
    .find()
    .sort({_id:-1})
    .skip((page-1)*VIDEO_PER_PAGE)
    .limit(VIDEO_PER_PAGE);

    const totalPages=Math.ceil((await Video.countDocuments()/VIDEO_PER_PAGE))

    res.render('main',{
        title:'Sermons',
        videos:videos,
        prev:page-1,
        curr:page,
        next:page+1,
        last:totalPages
    });
}

module.exports.getSermon=async(req,res,next)=>{
    const video=await Video.findById(req.params.id)
    if(!video){
        res.redirect('/404');
    }
    res
    .render('video',{
        title:'Sermon',
        video:video
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
        return res.render('upload',{
            title:'Upload Sermon',
            errors:["Fields Must Not Be Empty"]
        })
    }else if(req.body.password.trim()!=process.env.PASSWORD){
        return res.render('upload',{
            title:'Upload Sermon',
            errors:["Password Incorrect"]
        })
    }else{
        const alreadyVideo=await Video.find({link:req.body.link.trim().replace('watch?v=','embed/')})
        if(alreadyVideo!=null){
            return res.render('upload',{
                title:'Upload Sermon',
                errors:["Video Already Exists"]
            })
        }
        await Video.create({
            title:req.body.title.trim(),
            category:req.body.category.trim(),
            speaker:req.body.speaker.trim(),
            link:req.body.link.trim().replace('watch?v=','embed/'),
            date:req.body.date.trim()
        })
        res.redirect('/upload');
    }
}