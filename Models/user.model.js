import { Schema , model } from "mongoose";

const userSchema = newSchema({
        fullName:{
            type:String,
            required: [true, 'Name is required'],
            minLength: [5 , 'Name must be at least 5 character'],
            maxLength: [50 , 'Name must be less than 50 character'],
            lowercase: true,
            trim: true,
        },
        email: {
            type: 'String',
            required: [true, 'Email is required'],
            lowercase: true,
            trim: true,
            unique: true,
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Please fill in a valid email address',
              ], // Matches email against regex
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minLength: [8, 'Password must be at least 8 characters'],
            select: false
        },
        avatar: {
            public_id: {
                type: 'String'
            },
            secure_url: {
                type: 'String'
            }
        },
        forgotPasswordToken: String,
        forgotPasswordExpiry: Date
},
{ timestamps: true }
);

userSchema.pre('save', function(next){
    if(!this.isModified('password')) {
        return next();
    }
    this.password = bcrypt.hash(this.password, 10);
})

const User = model('User', userSchema);

export default User;