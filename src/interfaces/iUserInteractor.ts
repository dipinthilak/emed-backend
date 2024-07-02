import { Userentity } from "../entities/User";

export interface IUserInteractor {
    signupUser(input: Userentity): any;
    verifyUser(otp: number): any;
    signinUser(username: string, password: string):any;
    signoutUser(input: Userentity): Promise<void>;
    signUpGoogle(input:Userentity):any;
    signInGoogle(input:String):any;
    onUserdata(input:String):any;

    onUserUpdate(id:String,data:any):any;

    forgotPassword(input:any):any;
    verifyForgotUser(input:any):any;
}
