const express=require('express')
const app=express()
const mongoose=require('mongoose')
const path=require('path')
const cors=require('cors')
const cookieparser=require('cookie-parser')
const expressSession=require('express-session')

const { connectToDB } = require('./database/connection')
const authRoutes=require('./routes/Auth')
const phonepayRoutes=require('./routes/Phonepay')
const registerRoutes=require('./routes/Register')
const userRoutes=require('./routes/User')


connectToDB()

const corsOptions = {
    origin: ["http://localhost:3000","https://tech-rhythm.vercel.app"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieparser())
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    // res.header('Access-Control-Allow-Origin', 'https://tech-rhythm.vercel.app');
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    next();
});

app.use('/auth',authRoutes) 
app.use('/api',phonepayRoutes)
app.use('/register',registerRoutes)
app.use('/user',userRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });