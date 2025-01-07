import express from 'express';
import {
    userSignup,
    userLogin,
    loggedInUser,
    accountActivation,
    resendAccountActivation,
    forgotPassword,
    resetPassword,
    userProfileUpdate,
    userLogout
} from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddlewares.js';

const router = express.Router();

// Public Routes
router.post('/signup', userSignup);
router.post('/login', userLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/activate/:token', accountActivation);
router.post('/resend-activation', resendAccountActivation);

// Protected Routes
router.get('/profile', authMiddleware, loggedInUser);
router.put('/profile/:id', authMiddleware, userProfileUpdate);
router.get('/logout', authMiddleware, userLogout);

export default router;
