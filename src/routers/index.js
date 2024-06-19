import express from 'express';
import authRouter from './auth.router.js';
import usersRouter from './user.router.js';
import cartRouter from './cart.router.js';
import menuRouter from './menu.router.js';
import restaurantRouter from './restaurant.router.js';
import orderRouter from './order.router.js';
import searchRouter from './search.router.js';
import reviewRouter from './review.router.js';
const route = express.Router();

route.use('/auth', authRouter);
route.use('/users', usersRouter);
route.use('/cart', cartRouter);
route.use('/order', orderRouter);
route.use('/search', searchRouter);
route.use('/restaurants', [restaurantRouter, menuRouter, reviewRouter]);

export default route;
