import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config();

(async () => {
    try{
        await mongoose.connect("mongodb+srv://che3zcake:V3gSIvVKZcNBdBjF@skillswap.luww1ct.mongodb.net/")
        console.log("Database connected successfully")
    }catch(e){
        console.error("Database connection error:", e)
    }
})()

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        trim: true,
        minlength: 6
    },
    name: {
        type: String,
        trim: true,
        minlength: 4,
        required:false,
    },
    location: {
        type: String,
        enum: ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata'],
        required:false,
    },
    skills_offered: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
        required:false,
    }],
    skill_wanted: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
        required:false,
    }],
    availability: {
        type: String,
        enum: ['weekends', 'weekdays'],
        required:false,
    },
    status: {
        type: String,
        enum: ['Public', 'Private'],
        default: 'Private'
    }
})

const skillSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true
    }
})

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        trim: true,
        minlength: 6
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: 4
    },
})

const swapSchema = new mongoose.Schema({
    initiator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    targetUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    skills_offered: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill'
    }],
    skill_wanted: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill'
    }],
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


const User = mongoose.model('User', userSchema);
const Skill = mongoose.model('Skill', skillSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Swap = mongoose.model('Swap', swapSchema)

export { User, Skill, Admin, Swap};
