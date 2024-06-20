import express from 'express';
import path from 'path';

const orderFrontRouter = express.Router();
const __dirname = path.resolve();

orderFrontRouter.get('/owner', (req, res, next) => {
  try {
    res.sendFile(__dirname + '/assets/index-owner.html');
  } catch (err) {
    next(err);
  }
});
orderFrontRouter.get('/customer', (req, res, next) => {
  try {
    res.sendFile(__dirname + '/assets/index-customer.html');
  } catch (err) {
    next(err);
  }
});

export default orderFrontRouter;
