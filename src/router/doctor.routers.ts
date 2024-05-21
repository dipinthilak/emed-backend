import express from 'express';
import {doctorSignup,verifyOtp,login,logout} from "../controller/doctor.authentication.controller"


const router=express.Router();

router.post('/signup',doctorSignup);
router.post('/verify-otp',verifyOtp);
router.post('/login',login);
router.get('/logout',logout);

export default router;
