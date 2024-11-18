import User from '../models/user.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const signup = async (req,res,next)=>{
    try {
        const {fullname,email,password,role} = req.body;

        if (!fullname || !email || !password ) {
            return res.status(404).json({message:"All fields are required"})
        }

        const user = await User.findOne({email});
        
        if(user) return res.status(400).json({message:"Email already exists, Please login"})

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = new User({
            fullname,
            email,
            password:hashedPassword,
            role:'Staff'
        });

        await newUser.save()

        res.status(201).json({message:"Signup successful"})

    } catch (error) {
        console.log(`Sign up Error : ${error}`);
        next(error)
    }
}

const Login = async(req,res,next)=>{
    try {
        let {email,password} = req.body;
        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({emailMessage:"User not found"})
        }
        
        const checkpassword = await bcrypt.compare(password, user.password);
        if(!checkpassword) return res.status(400).json({passwordMessage:"Incorrect Password"})

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
        )
        console.log(process.env.SECRET_KEY)
        
        return res.status(200).json({ message: "Login successful", token })
    } catch (error) {
        console.log(`Error while signin: ${error}`)
        next(error)
    }
}

export {signup, Login}