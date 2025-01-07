import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import createError from '../utils/createError.js';

/**
 * Authentication Middleware
 * Verifies the presence of a Bearer token in the Authorization header.
 * Decodes the token, retrieves user data, and attaches it to the request object.
 */
export const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user to request, excluding password
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return next(createError(401, 'Not authorized, user not found'));
            }

            next();
        } catch (error) {
            return next(createError(401, 'Not authorized, token failed'));
        }
    } else {
        return next(createError(401, 'Not authorized, no token provided'));
    }
});
