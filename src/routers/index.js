import express from 'express';
import authRouter from './auth.router.js';
import usersRouter from './user.router.js';
import menuRouter from './menu.router.js';

const route = express.Router();

route.use('/auth', authRouter);
route.use('/users', usersRouter);
route.use('/menu', menuRouter);

export default route;
