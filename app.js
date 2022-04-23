require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');

const routes=require('./routes/main');
const conn=require('./db/db');

const PORT=process.env.PORT||8080;
const MONGO_URI=process.env.MONGO_URI;

const app=express();

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    next();
})

app.set('view engine','ejs');
app.set('views','views');
app.use(express.static('public'));

app.use(express.urlencoded({extended:true}));

app.use(routes);

app.use((req,res,next)=>{
    res.status(404).send("Page not found");
})

app.use((err,req,res,next)=>{
    console.log(err);
    res.status(500).send("there was an error\n",err);
})


// conn
// .then(done=>{
    app.listen(PORT,()=>{console.log(`http://localhost:${PORT}`);})
// })
// .catch(err=>{
//     console.log('ERROR CONNECTING TO DB\n',err);
// })

