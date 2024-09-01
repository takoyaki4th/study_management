const express=require('express');
const app = express();

const logMiddleware = (req ,res ,next)=>{
    console.log(req.method,req.url);
    next();
};

app.use(logMiddleware);

app.get('/', (req,res) =>{
    res.status(200).send('hello world');
});

app.use((err,req,res,next) =>{
    if(err.status){
        return res.status(err.status).send(err.message);
    }
    console.log(err);
    res.status(500).send('Interial Server Error');
});

app.listen(3000,() =>{
    console.log('start listening');
});