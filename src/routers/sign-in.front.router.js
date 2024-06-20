import express from 'express';
import path from 'path';

const signInFrontRouter = express.Router();
const __dirname = path.resolve();

signInFrontRouter.use(
  '/static',
  express.static(path.join(__dirname, 'assets')),
);
signInFrontRouter.get('/sign-in/owner', (req, res, next) => {
  try {
    res.sendFile(__dirname + '/assets/sign-in-owner.html');
  } catch (err) {
    next(err);
  }
});
signInFrontRouter.get('/sign-in/customer', (req, res, next) => {
  try {
    res.sendFile(__dirname + '/assets/sign-in-customer.html');
  } catch (err) {
    next(err);
  }
});

export default signInFrontRouter;
