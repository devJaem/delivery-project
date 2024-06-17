import express from 'express';
import authRouter from './auth.router.js';
import usersRouter from './user.router.js';
import menuRouter from './menu.router.js';
import restaurantRouter from './restaurant.router.js';

const route = express.Router();

route.use('/auth', authRouter);
route.use('/users', usersRouter);
route.use('/menu', menuRouter);
route.use('/restaurant', restaurantRouter);


export default route;
