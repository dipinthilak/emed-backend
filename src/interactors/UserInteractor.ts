import { inject, injectable } from "inversify";
import { IUserInteractor } from "../interfaces/iUserInteractor";
import { IUserRepository } from "../interfaces/iUserRepository";
import { INTERFACE_TYPE } from "../utils";
import { comparePassword, hashPassword } from "../helper/hashPassword";
import { createAccessToken } from "../helper/jwt";
import { createRefreshToken } from "../util/jwt";
import { login } from "../controller/doctor.authentication.controller";
import { sendMail } from "../helper/nodeMailer";


@injectable()
export class UserInteractor implements IUserInteractor {


    private repository: IUserRepository;


    constructor(
        @inject(INTERFACE_TYPE.UserRepository) repository: IUserRepository
    ) {
        this.repository = repository;

    }



    async signupUser(input: any) {
        try {
            console.log("----------@interactor", input);

            const { fullName, email, address, phoneNo, gender, password, dob, confirmPassword } = input;

            if (!fullName || !gender || !dob || !email || !address || !phoneNo || !password || !confirmPassword || password !== confirmPassword) {
                console.log("not valid data");
                return { status: false, message: "incomplete or incorrect form data" };
            }
            const hashedPassword = await hashPassword(password);
            input.password = hashedPassword;
            delete input.confirmPassword;
            console.log("input afeter all manipulation", input, typeof input);


            const user = await this.repository.signup(input);

            if (user) {
                const otp = await sendMail(email, fullName);
                if (otp) {
                    return { data: { status: true, message: "user created verify otp" }, otp };
                }
            }

        } catch (error) {
            console.error('ERR: UserInteractor --> signUp()', error);
            throw error;

        }

    }



    async verifyUser(input: any) {
        console.log("----------@verify -----interactor", input);
        const { otpValue } = input;
        if (otpValue === otpValue) {
            return { status: true, message: "user account verified", verification: true };
        }
        return { status: true, message: "user account not verified verified", verification: false };


    }



    async signinUser(username: string, password: string) {
        try {
            const user = await this.repository.signin(username, password);
            if (!user || !user.password) {
                return { status: false, message: "user not found" }
            }

            const validPass = await comparePassword(password, user.password);

            if (!user.isActive) {
                return { status: false, message: 'User is blocked by administrator! Please contact administrator.' }
            }

            if (!validPass) {
                return { status: false, message: 'Password is incorrect!' };
            }

            delete user.password;
            const accessToken = createAccessToken(user, process.env.ACCESS_SECRET_KEY || '', process.env.ACCESS_EXPIRY || '');
            const refreshToken = createRefreshToken(user, process.env.REFRESH_SECRET_KEY || '', process.env.REFRESH_EXPIRY || '');

            return { status: true, user: user, accessToken, refreshToken };
        } catch (error) {
            console.error('ERR: UserUseCase --> login()', error);
            throw error;
        }
    }



    signoutUser(input: any) {
        return this.repository.signout(input)

    }

}