import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { VerifyFunction } from 'passport-local';

const localOptions = {
    usernameField: 'email', // Assuming email is used as the username
    passwordField: 'password', // Field name for the password
    passReqToCallback: false // Don't pass request object to verify callback
};

const localAuthenticateUser: VerifyFunction = async (username, password, done) => {

}