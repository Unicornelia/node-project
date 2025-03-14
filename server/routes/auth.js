const express = require('express');
const {
  getLogin,
  getSignUp,
  postLogin,
  postLogout,
  postSignUp,
  getResetPassword,
  postResetPassword,
  getNewPassword,
  postNewPassword,
} = require('../controllers/auth');
const { check } = require('express-validator');
const router = express.Router();

router.get('/login', getLogin);
router.get('/signup', getSignUp);
router.post('/login', postLogin);
router.post('/signup', check('email').isEmail(), postSignUp);
router.post('/logout', postLogout);
router.get('/reset', getResetPassword);
router.post('/reset', postResetPassword);
router.get('/reset/:token', getNewPassword);
router.post('/new-password', postNewPassword);

module.exports = router;