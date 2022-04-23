require('dotenv').config();
const dbCon=require('../db/db');

const VIDEO_PER_PAGE=3;

module.exports.getMain=async(req,res,next)=>{
    try {
        const conn=await dbCon;
        const page=parseInt(req.query.page)||1;
        const totalPages=await conn.execute(
            `SELECT COUNT(*) 
            FROM cfc`
        );

        const videos=await conn.execute(
            `SELECT * 
            FROM cfc 
            ORDER BY id desc
            LIMIT ${VIDEO_PER_PAGE} 
            OFFSET ${(page-1)*VIDEO_PER_PAGE}`
        );

        res.render('main',{
            title:'Sermons',
            videos:videos[0],
            prev:page-1,
            curr:page,
            next:page+1,
            last:Math.ceil(totalPages[0][0]['COUNT(*)']/VIDEO_PER_PAGE)
        });   
    } catch (error) {
        next(error);
    }
}

module.exports.getSermon=async(req,res,next)=>{
    try {
        const conn=await dbCon;
        const vid=await conn.execute(`SELECT * FROM cfc WHERE id=${req.params.id}`)
        res.render('video',{
            video:vid[0][0],
            title:'Sermon'
        })   
    } catch (error) {
        next(error);
    }
}

module.exports.getUpload=(req,res,next)=>{
    res.render('upload',{
        title:'Upload Sermon',
        errors:[],
		video:{}
    })
}

module.exports.postUpload=async(req,res,next)=>{
    try {
        const vidTitle=req.body.title.trim();
        const vidLink=req.body.link.trim();
        const vidCat=req.body.category.trim();
        const vidSpeaker=req.body.speaker.trim();
        const vidDate=req.body.date.trim();
        const password=req.body.password.trim();
        if(
            vidTitle.length==0||
            vidLink.length==0||
            vidCat.length==0||
            vidSpeaker.length==0||
            vidDate.length==0||
            password.length==0
        ){
            return res.render('upload',{
                title:'Upload Sermon',
                errors:["Fields Must Not Be Empty"]
            })
        }else if(password!=process.env.PASSWORD){
            return res.render('upload',{
                title:'Upload Sermon',
                errors:["Password Incorrect"]
            })
        }else{
            conn=await dbCon;
            const [results,fields]=await conn.execute(
                `INSERT INTO cfc(title,category,speaker,link,date)
                values(
                    "${vidTitle}",
                    "${vidCat}",
                    "${vidSpeaker}",
                    "https://youtube.com/embed/${vidLink}",
                    "${vidDate}"
                )`
            )
            res.redirect('/upload');
        }   
    } catch (error) {
        next(error);
    }
}

module.exports.getUpdate=async(req,res,next)=>{
	try {
        const conn=await dbCon;
        const vid=await conn.execute(`SELECT * FROM cfc WHERE id=${req.params.id}`)
        if(vid[0].length==0){res.redirect('/404');}
        res.render('upload',{
            title:'Edit Sermon',
            errors:[],
            video:vid[0][0]
        })
    } catch (error) {
        next(error);
    }
}

module.exports.postUpdate=async(req,res,next)=>{
    try {
        const conn=await dbCon;
        const vid=await conn.execute(`SELECT * FROM cfc WHERE id=${req.params.id}`)
        if(vid[0].length==0){res.redirect('/404');}

        const vidTitle=req.body.title.trim();
        const vidLink=req.body.link.trim();
        const vidCat=req.body.category.trim();
        const vidSpeaker=req.body.speaker.trim();
        const vidDate=req.body.date.trim();
        const password=req.body.password.trim();
        if(
            vidTitle.length==0||
            vidLink.length==0||
            vidCat.length==0||
            vidSpeaker.length==0||
            vidDate.length==0||
            password.length==0
        ){
            return res.render('upload',{
                title:'Edit Sermon',
                errors:["Fields Must Not Be Empty"],
                video:vid[0][0]
            })
        }else if(req.body.password.trim()!=process.env.PASSWORD){
            return res.render('upload',{
                title:'Edit Sermon',
                errors:["Password Incorrect"],
                video:vid[0][0]
            })
        }else{
            const result=await conn.execute(
                `UPDATE cfc
                SET
                title='${vidTitle}',
                category='${vidCat}',
                speaker='${vidSpeaker}',
                link='https://youtube.com/embed/${vidLink}',
                date=${vidDate}
                WHERE id=${req.params.id}`
            )
            res.redirect(`/sermon/${req.params.id}`)
        }
    } catch (error) {
        next(error);
    }
}

module.exports.getDelete=async(req,res,next)=>{
    try {
        const conn=await dbCon;
        const vid=await conn.execute(`SELECT * FROM cfc WHERE id=${req.params.id}`)
        if(vid[0].length==0){res.redirect('/404');}
        res.render('upload',{
            title:'Delete Sermon',
            errors:[],
            video:vid[0][0]
        })
    } catch (error) {
        next(error);
    }
}

module.exports.postDelete=async(req,res,next)=>{
    try {
        const conn=await dbCon;
        if(req.body.password.trim()!=process.env.PASSWORD){
            return res.render('upload',{
                title:'Delete Sermon',
                errors:["Password Incorrect"],
                video:video
            })
        }
        
        const result=await conn.execute(`DELETE FROM cfc WHERE id=${req.params.id}`);

        res.redirect('/');
    } catch (error) {
        next(error);
    }
}

module.exports.getApiMain=async(req,res,next)=>{
    try {
        res.setHeader('Content-Type','application/json');

        const perPage=req.query.perpage||VIDEO_PER_PAGE;
        const conn=await dbCon;
        const page=parseInt(req.query.page)||1;
        const totalPages=await conn.execute(
            `SELECT COUNT(*) 
            FROM cfc`
        );

        const videos=await conn.execute(
            `SELECT * 
            FROM cfc 
            ORDER BY id desc
            LIMIT ${perPage} 
            OFFSET ${(page-1)*perPage}`
        );

        res.status(200)
        .json({
            videos:videos[0]
        })
    } catch (error) {
        res.status(500)
    }
}

module.exports.getApiSermon=async(req,res,next)=>{
    try {
        res.setHeader('Content-Type','application/json')
        const conn=await dbCon;
        const vid=await conn.execute(`SELECT * FROM cfc WHERE id=${req.params.id}`)
        if(vid[0].length==0){
            return res.status(404)
            .json({
                msg:'Video Not Found'
            })
        }
        res.status(200)
        .json({
            video:vid[0][0]
        })   
    } catch (error) {
        res.status(500)
        .json({
            msg:'An Error Occured'
        })
    }
}