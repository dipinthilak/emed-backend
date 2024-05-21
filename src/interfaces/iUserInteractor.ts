import { Userentity } from "../entities/User";

export interface IUserInteractor {
    signupUser(input: Userentity): any;
    verifyUser(otp: number): any;
    signinUser(username: string, password: string):any;
    signoutUser(input: Userentity): Promise<void>;
}
