import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateKeyPair } from "crypto";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the path to the jwt_keys directory
const folderPath = path.resolve(`${__dirname}/jwt_keys`);

// Paths to the key files
const privateKeyPath = path.join(folderPath, "jwtRS256.key");
const publicKeyPath = path.join(folderPath, "jwtRS256.key.pub");

// Define variables for the keys
let JWT_PRIVATE_KEY = null;
let JWT_PUBLIC_KEY = null;

// Check if the private key file exists
if (fs.existsSync(privateKeyPath)) {
    // console.log("Private key loaded successfully");
  JWT_PRIVATE_KEY = fs.readFileSync(privateKeyPath, "utf8");
} else {
  console.error("Private key file not found");
}

// Check if the public key file exists
if (fs.existsSync(publicKeyPath)) {
    // console.log("Public key loaded successfully");
  JWT_PUBLIC_KEY = fs.readFileSync(publicKeyPath, "utf8");
} else {
  console.error("Public key file not found");
}
const JWT_SECRET = process.env.SECRET_KEY;
const TOKEN_TIME = process.env.TOKEN_TIME;

dotenv.config();

export const setJWT_KEYS = (secret = process.env.SECRET_KEY) => {
  const folderPath = path.resolve(`${__dirname}/jwt_keys`);
  generateKeyPair(
    "rsa",
    {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
        cipher: "aes-256-cbc",
        passphrase: secret,
      },
    },
    (err, publicKey, privateKey) => {
      fs.writeFileSync(`${folderPath}/jwtRS256.key`, privateKey, (error) => {
        if (error) throw error;
      });
      fs.writeFileSync(`${folderPath}/jwtRS256.key.pub`, publicKey, (error) => {
        if (error) throw error;
      });
    }
  );
};
export const encodeToken = (object = {}) => {
  const options = {
    issuer: "My App",
    algorithm: "RS256",
    expiresIn: TOKEN_TIME,
  };
  const token = jwt.sign(
    object,
    { key: JWT_PRIVATE_KEY.replace(/\\n/gm, "\n"), passphrase: JWT_SECRET },
    options
  );
  return token;
};
export const verifyToken = (sentToken) => {
  const options = {
    issuer: "My App",
    algorithms: ["RS256"],
    maxAge: TOKEN_TIME,
  };
  const userToken = jwt.verify(
    sentToken,
    JWT_PUBLIC_KEY.replace(/\\n/gm, "\n"),
    options,
    (err, decode) => {
      if (err) {
        return { tokenExp: true, error: err };
      }
      return { tokenExp: false, decode };
    }
  );
  return userToken;
};


// module.exports = {
//   setJWT_KEYS,
//   encodeToken,
//   verifyToken,
// };


