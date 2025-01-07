import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            match: [
                /^([a-zA-Z0-9_\-.+]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/, 
                'Please enter a valid email address'
            ],
        },
        phone: {
            type: String,
            match: [/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'],
            sparse: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        avatar: {
            type: String,
            default: '',
        },
        isActivate: {
            type: Boolean,
            default: false,
        },
        accessToken: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Method to match user password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
