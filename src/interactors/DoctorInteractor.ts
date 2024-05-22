import { injectable, inject } from "inversify";
import { Doctorentity } from "../entities/Doctor";
import { IDoctorInteractor } from "../interfaces/IDoctorInteractor";
import { IDoctorRepository } from "../interfaces/IDoctorRepository";
import { INTERFACE_TYPE } from "../utils";
import { comparePassword, hashPassword } from "../helper/hashPassword";
import { sendMail } from "../helper/nodeMailer";
import { createAccessToken, createRefreshToken } from "../helper/jwt";

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
            console.log("data at doctor interactor---->>>", input);
            const { fullName, email, registerNo, department, address, pincode, phoneNo, gender, dob, password, confirmPassword } = input;

            if (!fullName || !email || !registerNo || !department || !address || !pincode || !phoneNo || !gender || !dob || !password || !confirmPassword || password !== confirmPassword) {
                console.log("not valid data");
                return { status: false, message: "incomplete or incorrect form data" };
            }
            const hashedPassword = await hashPassword(password);
            input.password = hashedPassword;
            delete input.confirmPassword;
            console.log("input afeter all manipulation", input, typeof input);

            const doctor = await this.repository.signup(input);
            if (doctor) {
                const otp = await sendMail(email, fullName);
                if (otp) {
                    return { data: { status: true, message: "complete signup with emailed otp" }, otp ,doctor}
                }
            }

            return { data: { status: false, message: "doctor account not created " } };

        } 
        catch (error) {
            console.error(error);
        }
    };


    async verifyDoctor(input:any) {
        try {
            const { otpValue,sessionOtp,doctorid } = input;
            console.log("verify doc call @ interactor---->",input,"otp---",otpValue,"session ---",sessionOtp);
            if (otpValue === sessionOtp) {
                console.log("otp valid------------------------>");
                
                const data=await this.repository.verify(doctorid);
                console.log("return data from doc verify repo----->",data);
                
                return { status: true, message: "doctor account verified", verification: true };
            }
            return { status: true, message: "user account not verified verified", verification: false };
        } catch (error) {
            console.error(error);


        }
    }


  async  signInDoctor(username: string, password: string) {
        try {
            const doctor = await this.repository.signin(username, password);
            if (!doctor || !doctor.password) {
                return { status: false, message: "user not found" }
            }
            const validPass = await comparePassword(password, doctor.password);


            if (!doctor) {
                return { status: false, message: 'doctor is blocked by administrator! Please contact administrator.' }
            }

            if (!validPass) {
                return { status: false, message: 'Password is incorrect!' };
            }
            delete doctor.password;
            const accessToken = createAccessToken(doctor, process.env.ACCESS_SECRET_KEY || '', process.env.ACCESS_EXPIRY || '');
            const refreshToken = createRefreshToken(doctor, process.env.REFRESH_SECRET_KEY || '', process.env.REFRESH_EXPIRY || '');
            return { status: true, doctor: doctor, accessToken, refreshToken };


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

}