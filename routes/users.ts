import express, { Request, Response } from 'express';
import { createUser } from '../controllers/users';
import passport from 'passport';
import { checkAuthenticated } from '../controllers/users';

const usersRouter = express.Router();

usersRouter.post('/signup', createUser);

usersRouter.post(
    '/login',
    passport.authenticate('local', { failureRedirect: '/login-failure' }),
    (req: express.Request, res: express.Response): void => {
        res.status(200).send({ user: req.user });
    }
);

usersRouter.get('/auth', checkAuthenticated, (req: Request, res: Response) => {
    res.status(200).json({ user: req.user });
});


usersRouter.get('/logout', checkAuthenticated, (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to logout' });
        }
        return res.status(200).json({ message: 'Logout successful' });
    });
});




export default usersRouter;