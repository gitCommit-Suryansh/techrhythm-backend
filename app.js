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
const verifyRoutes=require('./routes/Verify')


connectToDB()

const corsOptions = {
    origin: ["http://localhost:3000","https://tech-rhythm.vercel.app","https://techrhythm.xyz"],
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
    res.header("Access-Control-Allow-Credentials", "true");
    
    const allowedOrigins = [
        "https://tech-rhythm.vercel.app",  // Production frontend
        "http://localhost:3000",
        "https://techrhythm.xyz"
    ];

    if (allowedOrigins.includes(req.headers.origin)) {
        res.header("Access-Control-Allow-Origin", req.headers.origin);
    }

    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    
    next();
});


app.use('/auth',authRoutes) 
app.use('/api',phonepayRoutes)
app.use('/register',registerRoutes)
app.use('/user',userRoutes)
app.use('/verify',verifyRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });