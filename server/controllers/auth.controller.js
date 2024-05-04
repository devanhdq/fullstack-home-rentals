import User from "../models/User.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
import multer from "multer";

/* Configuration Multer for File Upload */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads/"); // Store uploaded files in the 'uploads' folder
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Create a unique name for the uploaded file
    },
});

export const upload = multer({storage});

/* USER REGISTER */
export const register = async (req, res) => {
    try {
        /* Take all information from the form */
        const {firstName, lastName, email, password} = req.body;

        /* The uploaded file is available as req.file */
        const profileImage = req.file;

        if (!profileImage) {
            return res.status(400).send("No file uploaded");
        }

        /* path to the uploaded profile photo */
        const profileImagePath = profileImage.path;

        /* Check if user exists */
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(409).json({message: "User already exists!"});
        }

        /* Hash the password */
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        /* Create a new User */
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            profilePicture: profileImagePath,
        });

        /* Save the new User */
        await newUser.save();

        /* Send a successful message */
        res
            .status(200)
            .json({message: "User registered successfully!", user: newUser});
    } catch (err) {
        console.log(err);
        res
            .status(500)
            .json({message: "Registration failed!", error: err.message});
    }
}

/* USER LOGIN */
export const login = async (req, res) => {
    try {
        /* Take email and password from the form */
        const {email, password} = req.body;

        /* Check if user exists */
        const existingUser = await User.findOne({email});

        if (!existingUser) {
            return res.status(404).json({message: "User does not exist!"});
        }

        /* Check if the password is correct */
        const isPasswordCorrect = await bcrypt.compare(
            password,
            existingUser["password"]
        );
        if (!isPasswordCorrect) {
            return res.status(400).json({message: "Invalid credentials!"});
        }
        /*Generate jwt */
        const token = jwt.sign({id: existingUser["_id"]}, process.env.JWT_SECRET_KEY)

        const {password: userPassword, ...user} = existingUser["_doc"];
        /* Send a successful message */
        res
            .status(200)
            .json({message: "User logged in successfully!", data: {token, ...user}});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Login failed!", error: err.message});
    }
}