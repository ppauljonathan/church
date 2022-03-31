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
        errors:[],
		video:{}
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
        if(alreadyVideo.length!=0){
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

module.exports.getUpdate=async(req,res,next)=>{
	const video=await Video.findById(req.params.id);
	if(!video){res.redirect('/404');}
	res.render('upload',{
		title:'Edit Sermon',
		errors:[],
		video:video
	})
}

module.exports.postUpdate=async(req,res,next)=>{
	const video=await Video.findById(req.params.id);
	if(!video){res.redirect('/404');}
	if(
        req.body.title.trim().length==0||
        req.body.link.trim().length==0||
        req.body.category.trim().length==0||
        req.body.speaker.trim().length==0||
        req.body.date.trim().length==0||
        req.body.password.trim().length==0
    ){
        return res.render('upload',{
            title:'Edit Sermon',
            errors:["Fields Must Not Be Empty"],
			video:video
        })
    }else if(req.body.password.trim()!=process.env.PASSWORD){
        return res.render('upload',{
            title:'Edit Sermon',
            errors:["Password Incorrect"],
			video:video
        })
    }else{
		const alreadyVideo=await Video.find({link:req.body.link.trim().replace('watch?v=','embed/')})
        if(alreadyVideo.length!=0 && alreadyVideo[0]._id!=req.params.id){
            return res.render('upload',{
                title:'Upload Sermon',
                errors:["Video Already Exists"]
            })
        }
		await alreadyVideo[0].updateOne({
            title:req.body.title.trim(),
            category:req.body.category.trim(),
            speaker:req.body.speaker.trim(),
            link:req.body.link.trim().replace('watch?v=','embed/'),
            date:req.body.date.trim()
		})
		res.redirect(`/sermon/${alreadyVideo[0]._id}`)
	}
}

module.exports.getDelete=async(req,res,next)=>{
	const video=await Video.findById(req.params.id);
	if(!video){res.redirect('/404');}
	res.render('upload',{
		title:'Delete Sermon',
		errors:[],
		video:video
	})
}

module.exports.postDelete=async(req,res,next)=>{
	if(req.body.password.trim()!=process.env.PASSWORD){
        return res.render('upload',{
            title:'Delete Sermon',
            errors:["Password Incorrect"],
			video:video
        })
    }
	await Video.deleteOne({_id:req.params.id});
	res.redirect('/');
}

module.exports.getApiMain=async(req,res,next)=>{
    res.setHeader('Content-Type','application/json');

    const perPage=req.query.perpage||VIDEO_PER_PAGE;
    const pageNo=req.query.page||1;
    const videos=await Video
    .find()
    .sort({_id:-1})
    .skip((pageNo-1)*perPage)
    .limit(perPage)

    res.status(200)
    .json({
        videos:videos
    })
}

module.exports.getApiSermon=async(req,res,next)=>{
    try {
        res.setHeader('Content-Type','application/json')
        const video=await Video.findById(req.params.id);
        if(!video){
            res.status(404)
            .json({
                msg:'Video Not Found'
            })
        }
        res.status(200)
        .json({
            video:video
        })   
    } catch (error) {
        res.status(500)
        .json({
            msg:'An Error Occured'
        })
    }
}