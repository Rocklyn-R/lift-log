import passport from 'passport';
import { Strategy as LocalStrategy, IStrategyOptions } from 'passport-local';
import bcrypt from 'bcrypt';
import { VerifyFunction } from 'passport-local';
import { userFindByEmail, userFindById } from '../models/users';


const localOptions: IStrategyOptions = {
    usernameField: 'email', // Assuming email is used as the username
    passwordField: 'password', // Field name for the password
    passReqToCallback: false, // Explicitly set to `false`
  };

const localAuthenticateUser: VerifyFunction = async (username, password, done) => {
    try {
        const user = await userFindByEmail(username);
        if (!user || !user.password) {
            return done(null, false, { message: 'Incorrect email or password' });
        }
        const matchedPassword = await bcrypt.compare(password, user.password);
        if (!matchedPassword) {
            return done(null, false, { message: 'Incorrect email or password' });
        }
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
}

passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id: number, done) => {
    try {
        const user = await userFindById(id);
        if (user) {
            done(null, user); // Pass the retrieved user object to the callback 
        } else {
            done(null, false)
        }

    } catch (error) {
        done(error); // Pass any errors to the callback
    }
});

export const initializePassport = (passport: passport.PassportStatic) => {
    passport.use(new LocalStrategy(localOptions, localAuthenticateUser));
}

