import "reflect-metadata"
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import logger from "morgan";
import cookieParser from "cookie-parser";
import session, { MemoryStore, SessionOptions } from "express-session";

import userRouter from "./router/userRoutes"
import doctorRouter from "./router/doctorRoutes"
import adminrRouter from "./router/adminRoutes"

dotenv.config({ path: "src/.env" });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


const store = new MemoryStore();

declare module "express-session" {
  interface Session {
    doctorData?: {
      _id:string,
      fullName: string,
      googleId: string,
      email: string,
      password: string,
      verified: Boolean,
      isVerified: Boolean,
      isActive: Boolean,
      isGoogle: Boolean,

      address: string,
      pincode: string,
      phoneNo: string,
      profilePic:string,
      identityProof:string,
      identityProofId:string, 
      identityProofDoc:string,
      gender: string,
      dob: Date,
      department: string,

      highSchool:string,
      hsNumber:string,
      hsYear:number,
      hsDoc:string,
      hsSchool:string,
      hssNo:string,
      hssYear:number,
      hssDoc:string,
      mbbsCollege:string,
      mbbsNo:string,
      mbbsYear:number,
      mbbsDoc:string,
      registrationNo:string,
      education:[{
        institution:string,
        degree:string,
        field:string,
        gradYear:Number,
      }],
      eduDocs:[string],
      about:string,
      experiences:[{
        from:number,
        to:number,
        experience:string,
      }],
      expDocs:[string],
    };
    user?: {
      _id: string;
      fullName: string;
      email: string;
      address: string;
      phoneNo: string;
      gender: string;
      password: string;
      dob: Date;
    };
    otp?: number;
    refreshToken?: string;
    adminRefreshToken?: string;
  }
}


app.use(
  session({
    secret: process.env.SECRET || "default-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 60 * 60 * 1000,
      httpOnly: true,
    },
    store: store,
  } as SessionOptions)
);


app.use(cors({
  origin: 'http://localhost:5173',
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true
}));

app.use(logger('tiny'));

app.use('/api/user', userRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/admin', adminrRouter);

export { app };