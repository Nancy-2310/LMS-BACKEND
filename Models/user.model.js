import { Schema , model } from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'

const userSchema = new Schema({
        fullName:{
            type:String,
            required: [true, 'Name is required'],
            minLength: [5 , 'Name must be at least 5 character'],
            maxLength: [50 , 'Name must be less than 50 character'],
            lowercase: true,
            trim: true,
        },
        email: {
            type: String,
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
                type: String
            },
            secure_url: {
                type: String
            }
        },
        forgotPasswordToken: String,
        forgotPasswordExpiry: Date
},
{ timestamps: true }
);

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods = {
    // method which will help us compare plain password with hashed password and returns true or false
    comparePassword: async function (plainPassword) {
      return await bcrypt.compare(plainPassword, this.password);
    },
  
    // Will generate a JWT token with user id as payload
    generateJWTToken: async function () {
      console.log(process.env.JWT_SECRET);
      console.log(process.env.JWT_EXPIRY);
      return await jwt.sign(
        { id: this._id, role: this.role, subscription: this.subscription },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRY,
        }
      );
    },

    
    
  };

const User = model('User', userSchema);

export default User;