import nodemailer from "nodemailer";
import { randomInt } from "crypto";


//generate otp
const generateOtp = () => {
    return randomInt(100000, 1000000);
};

//send mail
export const sendMail = async (email: string, name: string) => {
    try {
        const otp = generateOtp();

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });


        const mailOptions = {
            from: 'medibuddycc@gmail.com',
            to: email,
            subject: 'Signup OTP -Emed-Online consulting Application ',
            text: `Thank you ,${name} for choosing E-med. Use this otp to finish your signup: ${otp}`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email has been sent', info.response);
        return otp;

    } catch (error) {
        console.log(error);
    }
};
