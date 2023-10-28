import AppError from "../utils/error.util";

const register = async (req, res) => {
        const { fullName, email, password } = req.body;

        if(!fullName || !email || !password) {
            return next(new AppError('All fields are required', 400));
        }

        const userExists = await User.findOne({ email });

        if(userExists) {
            return next(new AppError('Email already exists', 400));
        }
        

        const user = await User.create({
            fullName,
            email,
            password,
            avatar: {
                public_id: email,
                secure_url: 'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg',
            }
        });

        if(!user) {
            return next(new AppError('User registration failed, please try again'))
        }

        // TODO: File Upload

        await user.save();

        user.password = undefined;

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user,
        })

};

const login = (req, res) => {

};

const logout = (req, res) => {

};

const getProfile = (req, res) => {

};

export {
    register,
    login,
    logout,
    getProfile
}