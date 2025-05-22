// import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
// import bcrypt from 'bcryptjs';
// import { createUser, findUserByEmail } from '../model/userModel.js';
import userService from '../model/userModel.js';

import { encodeToken, verifyToken } from '../../jwt.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const privateKey = fs.readFileSync(path.join(__dirname, '../../jwt_keys/jwtRS256.key'));
const publicKey = fs.readFileSync(path.join(__dirname, '../../jwt_keys/jwtRS256.key.pub'), 'utf8');


export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // console.log(req.body)

    if (!name || !email || !password) {
      throw new ApiError(400, "All fields are required");
    }

    const existingUser = await userService.findUserByEmail(email);      // Check if user already exists

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


// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     console.log(req.body)
//     if (!email || !password) {
//       throw new ApiError(400, "Email and password are required ")

//     }
//     const existingUse = await userService.findUserByEmail(email)
//     if (!existingUser) {
//       throw new ApiError(401, "Invaild email or password");
//     }

//     const isPasswordValid = await bcrypt.compare(password, existingUser.password)
//     if (!isPasswordValid) {
//       throw new ApiError(401, "Invalid email or password")
//     }

//     const payload = {
//       id: existingUser.id,
//       email: existingUser.email

//     }

//     const acceessToken = encodeToken(payload)
//     const refreshToken = jwt.sign({payload},process.env.REFRESH_TOKEN_SECRET,{expiresIn:"1d"})
//     const sessionToken = generateSessionToken(user);


//     return res.status(201).json(
//       new ApiResponse(201, { acceessToken }, "logined successfully")
//     );
//   } catch (error) {
//     res.status(500).json({ message: "Database error", error: error.message });
//   }
// }


export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // console.log(req.body); 

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }
  const existingUser = await userService.findUserByEmail(email);

  if (!existingUser) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await userService.comparePassword(
    password,
    existingUser.password
  )

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const { password: _, refreshToken: __, ...userWithoutPassword } = existingUser;

  const payload = {
    id: existingUser.id,
    email: existingUser.email
  };

  const accessToken = encodeToken(payload);

  const refreshToken = jwt.sign(
    { id: existingUser.id, email: existingUser.email },
    { key: privateKey, passphrase: process.env.SECRET_KEY },
    {
      algorithm: "RS256",
      issuer: "My App",
      expiresIn: "7d",
    }
  );


  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true, // only send over 
    sameSite: "Strict", // protect against CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days   
  });
  return res.status(200).json(
    new ApiResponse(200, {user: userWithoutPassword, accessToken, refreshToken }, "Logged in successfully")

  );
});


export const tokentest = asyncHandler(async (req, res) => {
  const { token } = req.body;
  //  console.log(req.body)
  if (!token) {
    throw new ApiError(400, "Token is required in request body as 'token'");
  }

  try {
    const verify = verifyToken(token);
    return res.status(200).json(new ApiResponse(200, { verify }));
  } catch (error) {
    throw new ApiError(401, "Invalid or expired token");
  }
});


export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });

  return res.status(200).json(
    new ApiResponse(200, null, "Logged out successfully")
  );
});


export const dashboard = (req, res) => {
  // Ensure req.user is available
  if (!req.user) {
    console.log("User data: ", req.user);
    return res.status(401).json({
      error: "Unauthorized access. Please log in.",
    });
  }

  // Send a structured response using ApiResponse
  return res.status(200).json(
    new ApiResponse(
      200,
      {},
      `Welcome back, user ${req.user.email}` // Use req.user here
    )
  );
};


export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    throw new ApiError(401, "Refresh token missing");
  }

  const decoded = jwt.verify(token, publicKey, {
    algorithms: ["RS256"],
    issuer: "My App",
    // passphrase: process.env.SECRET_KEY
  });

  const payload = {
    id: decoded.id,
    email: decoded.email,
  }

  const newAccessToken = encodeToken(payload);

  return res.status(200).json(
    new ApiResponse(
      200,
      { accessToken: newAccessToken },
      "Access token refreshed"
    )
  );
})

