require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');

const routes=require('./routes/main');

const PORT=process.env.PORT||8080;
const MONGO_URI=process.env.MONGO_URI;

const app=express();

app.set('view engine','ejs');
app.set('views','views');
app.use(routes);

app.use((req,res,next)=>{
    res.status(404).send("Page not found");
})

app.use((err,req,res,next)=>{
    res.status(500).send("there was an error");
})

mongoose.connect(MONGO_URI)
.then(done=>{
    app.listen(PORT,()=>{console.log(`http://localhost:${PORT}`);})
})
.catch(err=>{
    console.log('ERROR CONNECTING TO DB\n',err);
})

