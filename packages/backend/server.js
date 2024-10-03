const path = require('path');
const express = require('express');
const mysql = require('mysql2/promise');

const app = express();

app.set('view engine','ejs');

app.use('/static',express.static(path.join(__dirname,'public')));
app.use(express.json());

let connection;

const mysqlOptions = {
    host: 'localhost',
    user: 'root',
    password: 'secret',
    port : 3306,
    database: 'study_db',
    namedPlaceholders: true
}

const logMiddleware = (req ,res ,next)=>{
    console.log(req.method,req.url);
    next();
};

app.use(logMiddleware);

async function startServer(){
    try{
        connection = await mysql.createConnection(mysqlOptions);

        console.log('connected to study_db');

        app.listen(8000,() =>{
            console.log('start listening');
        });
        
    }catch(err){
        console.log('error connecting: ' + err);
        process.exit(1);
    }
}

startServer();

app.post('/api',async(req,res) =>{
    try {
        const [rows,fields] = await connection.execute('SELECT * FROM subjects');
        res.status(200).json(rows);
    } catch (err) {
        console.log('error connecting: ' + err);
        process.exit(1);
    }
});

app.post('/api/timeChange',async(req,res)=>{
    try{
        await connection.query(
            'UPDATE subjects SET total_time=total_time + :addTotal, day_time=day_time + :addDay WHERE id = :id',
            {
                addTotal:req.body.elapsedTime, 
                addDay:req.body.elapsedTime,
                id:req.body.selectedSubjectId
            }
        );
        const [rows,fields] = await connection.execute(
            'SELECT * FROM subjects WHERE id = :id',
            {id:req.body.selectedSubjectId}
        );
        res.status(200).json(rows[0]);
    }catch(err){
        console.log('error connecting: ' + err);
        process.exit(1);
    }
});

app.post('/api/dayReset',async (req,res)=>{
    try{
        const [ids] = await connection.query(
            'SELECT id FROM subjects WHERE user_id = :user_id',
            {user_id:1}
        );
        const subject_ids = ids.map(obj => obj.id);
        await connection.query(
            'UPDATE subjects SET day_time=0 WHERE id IN (:ids)',
            { ids : subject_ids }
        );
        const [rows] = await connection.query(
            'SELECT id,day_time FROM subjects WHERE id IN (:ids)',
            { ids : subject_ids}
        );
        res.status(200).json(rows);
    }catch(err){
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
