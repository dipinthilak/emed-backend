import { Request, Response } from "express";
// import {Admin} from "../models/adminSchema";
import { comparePassword } from "../helper/hashPassword"
import { clearAccessTokenFromCookie, createAccessToken, createRefreshToken } from "../helper/jwt";


export const adminLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (email && password) {
            const user = await Admin.findOne({ email: email });
            if (user) {
                const passwordValidation = await comparePassword(password, user.password);
                if (passwordValidation) {
                    const adminAccessToken = createAccessToken(
                        user,
                        process.env.ACCESS_SECRET_KEY || "accesssecret",
                        process.env.ACCESS_TOKEN_EXPIRY || "1h"
                    );

                    const adminData={name:user.name,
                        _id:user._id
                    }

                    // req.session.adminRefreshToken=adminRefreshToken;
                    const expirationDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                    res.cookie("adminAccessToken", adminAccessToken, {
                        expires: expirationDate,
                        httpOnly: true,
                        secure: true,
                    });
                    res.status(201).json({ status: true,adminData, user: user });
                }
                else {
                    res.status(400).json({ status: false, message: "wrong password" });
                }
            }
            else {
                res.status(400).json({ status: false, message: "wrong credentials" });
            }
        }

    } catch (err) {
        res.status(500).json({ status: false, message: "some error occured" })
    }

};

export const adminLogout = async (req: Request, res: Response) => {
    try {
        clearAccessTokenFromCookie("adminAccessToken", res);
        res.clearCookie("adminAccessToken");
        // req.session.adminRefreshToken=undefined;
        res.status(200).json({ status: true, message: "Logout success" });
    } catch (error) {
        res.status(500).json(error)
    }

};