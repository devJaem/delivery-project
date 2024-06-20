import express from 'express';
import authRouter from './auth.router.js';
import usersRouter from './user.router.js';
import cartRouter from './cart.router.js';
import menuRouter from './menu.router.js';
import restaurantRouter from './restaurant.router.js';
import orderRouter from './order.router.js';
import searchRouter from './search.router.js';
import reviewRouter from './review.router.js';
import rankRouter from './rank.router.js';
import signInFrontRouter from './sign-in.front.router.js';
import orderFrontRouter from './order.front.router.js';
const route = express.Router();

route.use('/api/v1/auth', authRouter);
route.use('/api/v1/users', usersRouter);
route.use('/api/v1/cart', cartRouter);
route.use('/api/v1/order', orderRouter);
route.use('/api/v1/search', searchRouter);
route.use('/api/v1/rank', rankRouter);
route.use('/api/v1/restaurants', [restaurantRouter, menuRouter, reviewRouter]);
route.use('/auth', signInFrontRouter);
route.use('/order', orderFrontRouter);

export default route;
