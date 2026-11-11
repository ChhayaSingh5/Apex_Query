import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import path from "node:path";
import { fileURLToPath } from "node:url";
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import flash from "connect-flash";

import User from './models/user.js';
import chatRoutes from "./routes/chat.js";
import userRouter from "./routes/user.js";

const app = express();
const PORT = 8080;
const backendPath = path.dirname(fileURLToPath(import.meta.url));
const viewsPath = path.join(backendPath, "views");
const frontendDistPath = path.resolve(backendPath, "..", "Frontend", "dist");
const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set in the environment");
}

app.set("views", viewsPath);
app.set("view engine", "ejs");

app.use(
  "/vendor/bootstrap",
  express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), "node_modules/bootstrap/dist"))
);

const sessionOptions = {
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); 

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/api", chatRoutes);
app.use("/", userRouter);
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendDistPath, "index.html"));
});
app.use(express.static(frontendDistPath));

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
  connectDB();
})


const connectDB = async() => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connected with database");
  } catch(err) {
    console.log("Failed to connect with db", err);
  }
}
