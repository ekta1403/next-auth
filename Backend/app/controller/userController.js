
// import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
// import { createUser, findUserByEmail } from '../model/userModel.js';
import userService from '../model/userModel.js';
import bcrypt from 'bcryptjs';
import { encodeToken, verifyToken } from '../../jwt.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const privateKey = fs.readFileSync(path.join(__dirname, '../../jwt_keys/jwtRS256.key'));


export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body)

    if (!name || !email || !password) {
      throw new ApiError(400, "All fields are required");
    }
    // Check if user already exists
    const existingUser = await userService.findUserByEmail(email);

    if (existingUser) {
      throw new ApiError(409, "User already exists");
    }

    // const hashedPassword = await bcrypt.hash(password, 10);
    // const createdUser = await userService.createUser(name, email, hashedPassword);

    const hashedPassword = await userService.hashPassword(password);
    const createdUser = await userService.createUser({ name, email, password: hashedPassword });

    return res.status(201).json(
      new ApiResponse(201, { user: createdUser }, "User registered successfully")
    );

  } catch (error) {
    console.error(error);
    // return res.status(error.statusCode || 500).json({
    //   message: error.message || "Something went wrong while registering the user",
    // });
    throw new ApiError(500, "Something went wrong while registering the user");
  }
};



export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body)
    if (!email || !password) {
      throw new ApiError(400, "Email and password are required ")

    }
    const existingUser = await userService.findUserByEmail(email)
    if (!existingUser) {
      throw new ApiError(401, "Invaild email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password)
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password")
    }

    const payload = {
      id: existingUser.id,
      email: existingUser.email

    }

    const acceessToken = encodeToken(payload)

    return res.status(201).json(
      new ApiResponse(201, { acceessToken }, "logined successfully")
    );
  } catch (error) {
    res.status(500).json({ message: "Database error", error: error.message });
  }
}



export const tokentest = async (req, res) => {
  const { ekta } = req.body;

  try {
    const verify = verifyToken(ekta)
    return res.status(201).json(
      new ApiResponse(201, { verify })
    )
  } catch (error) {
    throw new ApiError(500, "wrong token");

  }
}
