import { Router } from 'express';
import { check } from 'express-validator';

import {
  getLogin,
  getSignUp,
  postLogin,
  postLogout,
  postSignUp,
  getResetPassword,
  postResetPassword,
  getNewPassword,
  postNewPassword,
} from '../controllers/auth';

const router = Router();

router.get('/login', getLogin);
router.get('/signup', getSignUp);
router.post('/login', postLogin);
router.post(
  '/signup',
  check('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom((value, { req }) => {
      if (value === 'test@test.com') {
        throw new Error('Email cannot be test@test.com');
      }
    }),
  postSignUp
);
router.post('/logout', postLogout);
router.get('/reset', getResetPassword);
router.post('/reset', postResetPassword);
router.get('/reset/:token', getNewPassword);
router.post('/new-password', postNewPassword);

export default router;
