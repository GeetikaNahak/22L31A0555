import express from "express";
import mongoose from "mongoose";
import shortid from "shortid";
import cors from "cors";
import axios from "axios";
import Url from "./models/Url.js";

const app=express();
app.use(cors());
app.use(express.json());
await mongoose.connect()