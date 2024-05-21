import { Userdb } from "../models/userSchema";
import { Request, Response } from "express";


export const usersData = async (req: Request, res: Response) => {
    try {
        console.log("request came here at controller....");

        const users = await Userdb.find({}).sort({fullName:1});
        console.log("user data", users);

        return res.status(200).json({ status: true, users, message: "users data fetched" });
    } catch (error) {
        return res.status(400).json({ status: false, message: "error occured while userdata fetching" })
    }
}
