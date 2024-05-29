import { inject, injectable } from "inversify";
import { IUserInteractor } from "../interfaces/iUserInteractor";
import { IUserRepository } from "../interfaces/iUserRepository";
import { INTERFACE_TYPE } from "../utils";
import { comparePassword, hashPassword } from "../helper/hashPassword";
import { createAccessToken } from "../helper/jwt";
import { createRefreshToken } from "../helper/jwt";
import { sendMail } from "../helper/nodeMailer";
import { Userentity } from "../entities/User";


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
                    return { data: { status: true, message: "user created verify otp" }, otp ,user};
                }
            }

        } catch (error) {
            console.error('ERR: UserInteractor --> signUp()', error);
            throw error;

        }

    }



    async verifyUser(input: any) {
        try {
            console.log("----------@verify -----interactor", input);
            const { otpValue } = input;
            if (otpValue === otpValue) {
                return { status: true, message: "user account verified", verification: true };
            }
            return { status: true, message: "user account not verified verified", verification: false };
    

        } catch (error) {
            console.error(error);
        }


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
        return this.repository.signout(input);
    }



    async signUpGoogle(input: Userentity) {
        try {
            const { email, fullName, phoneNo, isGoogle, googleId } = input;
            console.log("user google signup data---->..", email, fullName, phoneNo, isGoogle, googleId);
            const password = `${fullName}123`;
            console.log("final data for google signup----->",input);
            
            const hashedPassword = await hashPassword(password);
            input.password = hashedPassword;
            const user = await this.repository.signup(input);
            if (user) {

                return { status: true, message: "user account signup with google authentication" };
            }
            else {
                return { status: false, message: "user account not created with google authentication" };
            }
        } catch (error) {
            console.error(error);

        }
    }

    async signInGoogle(input: string) {
        try {
            console.log("input---->", input);
            const user = await this.repository.googleSignin(input);
            user.password = '';
            if (user) {
                const accessToken = createAccessToken(user, process.env.ACCESS_SECRET_KEY || '', process.env.ACCESS_EXPIRY || '');
                const refreshToken = createRefreshToken(user, process.env.REFRESH_SECRET_KEY || '', process.env.REFRESH_EXPIRY || '');

                return { status: true, user: user, accessToken, refreshToken, message: "user account login succesful" };
            }
            else {
                return { status: false, message: "user account login not succesful, check you have a account here with google authentication " };
            }
        } catch (error) {
            console.log(error);

        }
    }

}