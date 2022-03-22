const Video=require('../models/video');

module.exports.getMain=async(req,res,next)=>{
    const videos=await Video.find({})
    console.log(videos);
    res.render('main');
}
module.exports.getSermon=(req,res,next)=>{
}