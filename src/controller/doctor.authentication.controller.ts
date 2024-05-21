import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { sendMail } from "../helper/nodeMailer";
import { createAccessToken } from "../util/jwt";
import { Doctor } from "../models/doctorScema";
import { comparePassword, hashPassword } from "../helper/hashPassword";

export const doctorSignup = async (req: Request, res: Response) => {
    try {
        const {
            fullName,
            email,
            registerNo,
            department,
            address,
            pincode,
            phoneNo,
            gender,
            dob,
            password,
            confirmPassword,
        } = req.body.formData;
        console.log("row data", req.body);
        if (
            !fullName ||
            !email ||
            !registerNo ||
            !department ||
            !address ||
            !pincode ||
            !phoneNo ||
            !gender ||
            !dob ||
            !password ||
            !confirmPassword ||
            password !== confirmPassword
        ) {
            console.log(req.body);

            return res
                .status(400)
                .json({ status: false, message: "incomplete or incorrect form data" });
        } else {
            const userExist = await Doctor.findOne({ email: email });

            if (userExist) {
                return res
                    .status(400)
                    .json({ status: false, message: "User already exists" });
            } else {
                console.log("Hashing password", password);
                const hashedPassword = await hashPassword(password);

                console.log("Hashed Password:", hashedPassword);

                const doctorData = {
                    fullName: fullName,
                    email: email,
                    registerNo: registerNo,
                    department: department,
                    address: address,
                    pincode: pincode,
                    phoneNo: phoneNo,
                    gender: gender,
                    dob: dob,
                    verified: false,
                    password: hashedPassword,
                };

                console.log("Compiled data:", doctorData);
                const otp = 101010;
                // const otp = await sendMail(email, firstName);
                console.log(otp);

                req.session.doctorData = doctorData;
                req.session.otp = otp;

                return res
                    .status(200)
                    .json({ status: true, message: "OTP send- completed" });
            }
        }
    } catch (error) {
        console.error("Error:", error);
        return res
            .status(500)
            .json({ status: false, message: "Internal server error" });
    }
};

export const verifyOtp = async (req: Request, res: Response) => {
    try {
        if (req.session.otp === req.body?.otpValue) {
            const doctor = new Doctor(req.session.doctorData);
            await doctor.save();
            req.session.destroy((err) => {
                console.log("destroy-->",err);
            });
            return res
                .status(201)
                .json({ status: true, message: "otp verified doctor signup successful" });
        } else {
            return res
                .status(200)
                .json({
                    status: false,
                    otp: false,
                    message: "otp verification failed , incorrect otp",
                });
        }
    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .json({ message: "error occured while otp verification" });
    }
};



export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body.formData; // Destructure directly from req.body
        console.log(email, password);
        const doctor = await Doctor.findOne({ email: email });
        if (!doctor) {
            console.log("Doctor not found");
            return res
                .status(401)
                .json({ status: false, message: "Invalid login credentials" });
        }

        console.log("user data db", doctor);

        const passwordCheck = await comparePassword(password, doctor.password);
        if (passwordCheck) {
            console.log(passwordCheck);
            const doctorAccessToken = createAccessToken(
                doctor,
                process.env.ACCESS_SECRET_KEY || "accesssecret",
                process.env.ACCESS_TOKEN_EXPIRY || "8h"
            );
            const expirationDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            res.cookie("doctorAccessToken", doctorAccessToken, {
                expires: expirationDate,
                httpOnly: true,
                secure: true,
            });

            const doctorData = {
                doctorId: doctor._id,
                name: doctor.fullName,
                stasus:doctor.verified,
            };
            return res
                .status(200)
                .json({
                    status: true,
                    doctorData,
                    message: "Login credential validation completed",
                });
        } else {
            console.log(passwordCheck);
            return res
                .status(401)
                .json({ status: false, message: "Invalid login credentials" });
        }
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: false, message: "An error occurred while logging in" });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        const doctorAccessToken = req.cookies.doctorAccessToken;
        if (!doctorAccessToken) {
            return res
                .status(401)
                .json({ status: false, message: "Unauthorized request" });
        }
        const token_data: JwtPayload = jwt.verify(
            doctorAccessToken,
            process.env.ACCESS_SECRET_KEY || "secretsuntold"
        ) as JwtPayload;
        console.log("token data:", token_data.doctor?._id);

        res.cookie("doctorAccessToken", doctorAccessToken, {
            httpOnly: false,
            secure: false,
            signed: false,
            maxAge: 0,
        });
        return res.status(200).json({ status: true, message: "Logout completed" });
    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .json({ status: false, message: "Error occurred while logging out" });
    }
};
