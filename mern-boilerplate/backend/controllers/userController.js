import User from "../models/User.js";
import createError from "../utils/createError.js";
import { isEmail, isPhone } from "../utils/validate.js";
import { genHashPassword, verifyPassword } from "../utils/hash.js";
import { createToken, verifyToken } from "../utils/token.js";
import { resetPasswordLink, sendActivationLink } from "../utils/sendMail.js";
import { getRandomCode, getRandomUsernameCode } from "../utils/generateCode.js";

// Utility to send response
const sendResponse = (res, statusCode, message, data = {}) => {
    res.status(statusCode).json({ message, ...data });
};

// Utility to handle validation errors
const validateFields = (fields, next) => {
    for (const field in fields) {
        if (!fields[field]) {
            next(createError(400, `${field} is required!`));
            return false;
        }
    }
    return true;
};

/**
 * User Signup
 * @route POST /api/v1/user/register
 */
export const userSignup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!validateFields({ name, email, password }, next)) return;

        const existingUser = await User.findOne({ email });
        if (existingUser) return next(createError(400, 'This email already exists!'));

        let activationCode = getRandomCode(100000, 999999);
        while (await User.findOne({ accessToken: activationCode })) {
            activationCode = getRandomCode(100000, 999999);
        }

        const username = getRandomUsernameCode(name.toLowerCase().split(" ").join("-"), 999, 999999);
        const hashedPassword = genHashPassword(password);

        const newUser = await User.create({
            ...req.body,
            username,
            password: hashedPassword,
            accessToken: activationCode,
        });

        const activationToken = createToken({ id: newUser._id }, '30d');

        sendActivationLink(newUser.email, {
            name: name,
            link: `${process.env.APP_URI}:${process.env.SERVER_PORT}/api/v1/user/activate/${activationToken}`,
            code: activationCode,
        });

        sendResponse(res, 201, "Thank you for joining us!", { user: newUser });
    } catch (error) {
        next(error);
    }
};

/**
 * User Login
 * @route POST /api/v1/user/login
 */
export const userLogin = async (req, res, next) => {
    try {
        const { phoneOrEmail, password } = req.body;
        if (!validateFields({ phoneOrEmail, password }, next)) return;

        const isValidEmail = isEmail(phoneOrEmail);
        const isValidPhone = isPhone(phoneOrEmail);

        const query = isValidEmail ? { email: phoneOrEmail } : isValidPhone ? { phone: phoneOrEmail } : null;
        if (!query) return next(createError(400, "Invalid phone or email address!"));

        const user = await User.findOne(query);
        if (!user) return next(createError(400, "User not found!"));

        if (!verifyPassword(password, user.password)) {
            return next(createError(400, "Incorrect password!"));
        }

        const token = createToken({ id: user._id }, process.env.ACCESS_TOKEN_EXPIRE);

        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.APP_ENV === "PRODUCTION",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        sendResponse(res, 200, "Welcome back!", { user, token });
    } catch (error) {
        next(error);
    }
};

/**
 * Get Logged-in User
 * @route GET /api/v1/user/me
 */
export const loggedInUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) return next(createError(400, "User not found!"));

        sendResponse(res, 200, "User data retrieved successfully!", { user });
    } catch (error) {
        next(error);
    }
};

/**
 * Account Activation
 * @route GET /api/v1/user/activate/:token
 */
export const accountActivation = async (req, res, next) => {
    try {
        const { token } = req.params;
        const tokenData = verifyToken(token);
        if (!tokenData) return next(createError(400, "Invalid or expired activation token!"));

        const user = await User.findById(tokenData.id);
        if (!user) return next(createError(400, "User not found!"));

        if (user.isActivate) return next(createError(400, "Account already activated!"));

        user.isActivate = true;
        user.accessToken = "";
        await user.save();

        sendResponse(res, 200, "Account successfully activated!");
    } catch (error) {
        next(error);
    }
};

/**
 * Resend Activation Code
 * @route POST /api/v1/user/resend-activation
 */
export const resendAccountActivation = async (req, res, next) => {
    try {
        const { emailOrPhone } = req.body;
        const query = isEmail(emailOrPhone) ? { email: emailOrPhone } : isPhone(emailOrPhone) ? { phone: emailOrPhone } : null;
        if (!query) return next(createError(400, "Invalid phone or email address!"));

        const user = await User.findOne(query);
        if (!user) return next(createError(400, "User not found!"));

        if (user.isActivate) return next(createError(400, "Account already activated!"));

        let activationCode = getRandomCode(100000, 999999);
        while (await User.findOne({ accessToken: activationCode })) {
            activationCode = getRandomCode(100000, 999999);
        }

        user.accessToken = activationCode;
        await user.save();

        sendActivationLink(user.email, {
            name: `${user.firstName} ${user.surName}`,
            link: `${process.env.APP_URI}:${process.env.SERVER_PORT}/api/v1/user/activate/${activationCode}`,
            code: activationCode,
        });

        sendResponse(res, 200, "Activation link has been sent!");
    } catch (error) {
        next(error);
    }
};

/**
 * Forgot Password
 * @route POST /api/v1/user/forgot-password
 */
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!validateFields({ email }, next)) return;

        const user = await User.findOne({ email });
        if (!user) return next(createError(400, "User not found!"));

        const resetToken = createToken({ id: user._id }, '30m');
        const resetCode = getRandomCode(100000, 999999);

        user.accessToken = resetCode;
        await user.save();

        resetPasswordLink(user.email, {
            name: `${user.firstName} ${user.surName}`,
            link: `${process.env.APP_URI}:${process.env.SERVER_PORT}/api/v1/user/reset-password/${resetToken}`,
            code: resetCode,
        });

        sendResponse(res, 200, "Password reset link has been sent to your email.");
    } catch (error) {
        next(error);
    }
};

/**
 * Reset Password
 * @route POST /api/v1/user/reset-password/:token
 */
export const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        if (!validateFields({ password }, next)) return;

        const tokenData = verifyToken(token);
        if (!tokenData) return next(createError(400, "Invalid or expired reset token!"));

        const user = await User.findById(tokenData.id);
        if (!user) return next(createError(400, "User not found!"));

        user.password = genHashPassword(password);
        user.accessToken = "";
        await user.save();

        sendResponse(res, 200, "Password reset successful.");
    } catch (error) {
        next(error);
    }
};

/**
 * Update User Profile
 * @route PUT /api/v1/user/profile/:id
 */
export const userProfileUpdate = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true }).select("-password");
        if (!updatedUser) return next(createError(400, "Profile update failed!"));

        sendResponse(res, 200, "Profile updated successfully.", { user: updatedUser });
    } catch (error) {
        next(error);
    }
};

/**
 * User Logout
 * @route GET /api/v1/user/logout
 */
export const userLogout = async (req, res, next) => {
    try {
        res.clearCookie("authToken");
        sendResponse(res, 200, "Logout successful!");
    } catch (error) {
        next(error);
    }
};
