const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
let connection;

const logMiddleware = (req ,res ,next)=>{
    console.log(req.method,req.url);
    next();
};

app.use(logMiddleware);

async function startServer(){
    try{
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'secret',
            port : 3306,
            database: 'study_db'
        });

        console.log('connected to study_db');

        app.listen(3000,() =>{
            console.log('start listening');
        });
        
    }catch(err){
        console.log('error connecting: ' + err);
        process.exit(1);
    }
}

startServer();

app.get('/', async (req,res) =>{
    try {
        const [rows,fields] = await connection.execute('SELECT * FROM users');
        console.log(rows);
    } catch (error) {
        console.log('error connecting: ' + err);
        process.exit(1);
    }
    
});

app.use((err,req,res,next) =>{
    if(err.status){
        return res.status(err.status).send(err.message);
    }
    console.log(err);
    res.status(500).send('Interial Server Error');
});