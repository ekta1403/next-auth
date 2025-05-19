import express from "express";
import cors from "cors";
import morgan from "morgan";
import { setJWT_KEYS } from "./jwt.js";
import dotenv from "dotenv";
dotenv.config();
import connection  from "./app/config/db.js";

import routers from "./app/routes/index.js";
import userRouters from "./app/routes/user.js";

//setJWT_KEYS(); // only for jwt RS 256 key and public key || use once


const app = express();

const port = process.env.PORT || 21000;

var corsOptions = {
  origin: ["http://localhost:3000"],
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// app.use("/api", routers);
app.use("/api/user", userRouters);

app.use("/", (req, res) => {
  res.send("Softlabsgroup hrms backend.");
});

// app.use((req, res, next) => {
//   const error = new Error("Not Found!");
//   error.status = 404;
//   next(error);
// });

// app.use((error, req, res, next) => {
//   res.status(error.status || 500);
//   res.json({
//     status: error.status || 500,
//     message: error.message,
//   });
// });

app.listen(port, (req, res) => {
  console.log(`app is started on ${port}`);
});
