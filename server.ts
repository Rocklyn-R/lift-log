import express from 'express';
import cors from 'cors';
import passport, { initialize } from 'passport';
import session from 'express-session';
import * as dotenv from 'dotenv';
import exercisesRouter from './routes/exercises';
import usersRouter from './routes/users';
import { initializePassport } from './config/passport';
import logsRouter from './routes/logs';
import timerRouter from "./routes/timers";

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 4000;

const corsOptions = {
    origin: [
        '*',
        'http://localhost:3000',
    ],
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept' ]
};


app.options('*', cors(corsOptions));

app.use(cors(corsOptions));

app.set('trust proxy', 1);
app.use(express.static(__dirname));


 // Development session setup
 app.use(session({
     secret: process.env.COOKIE_SECRET as string,
     resave: false,
     saveUninitialized: false,
     cookie: {
         httpOnly: true,
         maxAge: 1000 * 60 * 60 * 24, 
         secure: false, 
     },
 }));

 app.use(passport.initialize());
 app.use(passport.session());
 initializePassport(passport);

 app.use('/exercises', exercisesRouter);
 app.use('/user', usersRouter);
 app.use('/logs', logsRouter);
 app.use('/timer', timerRouter);

 app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
});