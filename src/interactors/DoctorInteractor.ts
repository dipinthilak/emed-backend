import { injectable, inject } from "inversify";
import { Doctorentity } from "../entities/Doctor";
import { IDoctorInteractor } from "../interfaces/IDoctorInteractor";
import { IDoctorRepository } from "../interfaces/IDoctorRepository";
import { INTERFACE_TYPE } from "../utils";
import { comparePassword, hashPassword } from "../helper/hashPassword";
import { sendMail } from "../helper/nodeMailer";
import { createAccessToken, createRefreshToken } from "../helper/jwt";
import { response } from "express";

@injectable()
export class DoctorInteractor implements IDoctorInteractor {
    private repository: IDoctorRepository;
    constructor(
        @inject(INTERFACE_TYPE.DoctorRepository) repository: IDoctorRepository
    ) {
        this.repository = repository;
    }




    async signUpDoctor(input: Doctorentity) {
        try {
            const { fullName, email, registerNo, department, address, pincode, phoneNo, gender, dob, password, confirmPassword } = input;

            if (!fullName || !email || !registerNo || !department || !address || !pincode || !phoneNo || !gender || !dob || !password || !confirmPassword || password !== confirmPassword) {
                return { status: false, message: "incomplete or incorrect form data" };
            }
            const hashedPassword = await hashPassword(password);
            input.password = hashedPassword;
            delete input.confirmPassword;
            const doctor = await this.repository.signup(input);
            if (doctor) {
                // const otp = 100000;
                const otp = await sendMail(email, fullName);
                console.log("doctor signup otp---->",otp);
                
                if (otp) {
                    return { data: { status: true, message: "complete signup with emailed otp" }, otp, doctor }
                }
            }

            return { data: { status: false, message: "doctor account not created " } };

        }
        catch (error) {
            console.error(error);
        }
    };


    async verifyDoctor(input: any) {
        try {
            const { otpValue, sessionOtp, doctorid } = input;
            if (otpValue === sessionOtp) {
                const data = await this.repository.verify(doctorid);
                return { status: true, message: "doctor account verified", verification: true };
            }
            return { status: true, message: "user account not verified verified", verification: false };
        } catch (error) {
            console.error(error);
        }
    }



    async forgotPassword(input: any) {
        try {
            const { email, password } = input;
            console.log("data at interactor---->", email, password);
            const doctor = await this.repository.findDoctor(email);
            if (doctor && doctor.email) {
                const otp = await sendMail(email, doctor.email);
                console.log("otp--->", otp);
                if (otp) {
                    const hashedPassword= await hashPassword(password);
                    
                    doctor.password=hashedPassword;
                    console.log("hashed pass and doc-->",hashedPassword,"-----",doctor);
                    return { data: { status: true,doctor:doctor._id, message: "otp send to email for account password reset! " }, otp, doctor }
                }
            }
            else {
                return { data: { status: false, message: "no account exist with this email id" }, otp:null, doctor:null }
            }
        } catch (error) {
            console.error(error);

        }
    }


    async verifyForgotDoctor(input: any) {
        try {

            const { otp, sessionOtp, doctorId,doctorPassword } = input;
            console.log("dataaaaaaaaa---->>>>",otp, "----------",sessionOtp,"----------", doctorId,"----------",doctorPassword);
            
            if (otp == sessionOtp) {
                const data = await this.repository.updatePassword(doctorId,doctorPassword);
                return { status: true, message: "doctor account password updated", updation: true };
            }
            return { status: false, message: "doctor account password not updated", updation: false };
        } catch (error) {
            console.error(error);
        }
    }


    async signInDoctor(username: string, password: string) {
        try {
            const doctor = await this.repository.signin(username, password);
            if (!doctor || !doctor.password) {
                return { status: false, message: "user not found" }
            }
            const validPass = await comparePassword(password, doctor.password);
            if (!doctor.isActive) {
                return { status: false, message: 'doctor is blocked by administrator! Please contact administrator.' }
            }
            if (!validPass) {
                return { status: false, message: 'Password is incorrect!' };
            }
            delete doctor.password;
            const accessToken = createAccessToken(doctor, process.env.ACCESS_SECRET_KEY || '', process.env.ACCESS_EXPIRY || '');
            const refreshToken = createRefreshToken(doctor, process.env.REFRESH_SECRET_KEY || '', process.env.REFRESH_EXPIRY || '');
            return { status: true, doctor: doctor, accessToken, refreshToken, message: "doctor accunt valid" };
        } catch (error) {
            console.error(error);
        }
    }



    signoutDoctor(input: Doctorentity) {
        try {
            return { data: { status: true, message: "doctor signin succesful" } };
        } catch (error) {
            console.error(error);

        }
    }


    async signUpGoogle(input: Doctorentity) {
        try {
            const { email, fullName, phoneNo, isGoogle, googleId } = input;
            console.log("doctor google signup data---->..", email, fullName, phoneNo, isGoogle, googleId);
            const password = `${fullName}123`;
            input={...input,verified:true};
            console.log("final data for google signup----->",input);
            
            const hashedPassword = await hashPassword(password);
            input.password = hashedPassword;
            const doctor = await this.repository.signup(input);
            if (doctor) {

                return { status: true, message: "doctor account signup with google authentication" };
            }
            else {
                return { status: false, message: "doctor account not created with google authentication" };
            }
        } catch (error) {
            console.error(error);

        }
    }

    async signInGoogle(input: string) {
        try {
            console.log("input---->", input);
            const doctor = await this.repository.googleSignin(input);
            doctor.password = '';
            if (doctor) {
                const accessToken = createAccessToken(doctor, process.env.ACCESS_SECRET_KEY || '', process.env.ACCESS_EXPIRY || '');
                const refreshToken = createRefreshToken(doctor, process.env.REFRESH_SECRET_KEY || '', process.env.REFRESH_EXPIRY || '');

                return { status: true, doctor: doctor, accessToken, refreshToken, message: "doctor account login succesful" };
            }
            else {
                return { status: false, message: "doctor account login not succesful, check you have a account here with google authentication " };
            }
        } catch (error) {
            console.log(error);

        }
    }


}