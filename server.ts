import express from 'express';
import cors from 'cors';
import passport, { initialize } from 'passport';
import session from 'express-session';
import dotenv from 'dotenv';
import exercisesRouter from './routes/exercises';
import usersRouter from './routes/users';
import { initializePassport } from './config/passport';
import logsRouter from './routes/logs';
import timerRouter from "./routes/timers";
import settingsRouter from "./routes/settings";
import { RedisStore } from 'connect-redis';
import { createClient } from 'redis';
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
        'https://lift-log.onrender.com',
        'https://lift-log-backend-1s77.onrender.com'
    ],
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept' ]
};


app.options('*', cors(corsOptions));

app.use(cors(corsOptions));

app.set('trust proxy', 1);
app.use(express.static(__dirname));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const redisUrl = process.env.NODE_ENV === 'development' ? 'rediss://red-csb5ltogph6c73aaak60:0SR0RXoGw6haTyYewERfjKB0p1LfTPPJ@virginia-redis.render.com:6379' : 'redis://red-csb5ltogph6c73aaak60:6379'; // Use external Redis URL in developmentn
// Create a Redis client

const redisClient = createClient({
    url: redisUrl
});

// Connect to Redis
redisClient.connect().catch(err => {
    console.error('Could not connect to Redis:', err);
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

(async () => {
  
await redisClient.set('123Antica', 'Vatamo te');
const value = await redisClient.get('123Antica');
console.log("found value: ", value);  
})();

const cookieSecret = process.env.COOKIE_SECRET;

if (!cookieSecret) {
  throw new Error('Missing COOKIE_SECRET environment variable');
}

// Set up session middleware
app.use(session({
    store: new RedisStore({
        client: redisClient,
        prefix: 'lift-log:sess:', // Add prefix here
      }),  
    secret: cookieSecret,
    proxy: true, // Required when behind a proxy like Render
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: process.env.NODE_ENV === 'production', // Only send cookies over HTTPS in production
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' // Allows cookies to be sent in cross-site contexts (e.g., if front end is on a different domain)
    }
  }));

/*\
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
 }));*/

 app.use(passport.initialize());
 app.use(passport.session());
 initializePassport(passport);

 app.use('/exercises', exercisesRouter);
 app.use('/user', usersRouter);
 app.use('/logs', logsRouter);
 app.use('/timer', timerRouter);
 app.use('/settings', settingsRouter);

 app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
});