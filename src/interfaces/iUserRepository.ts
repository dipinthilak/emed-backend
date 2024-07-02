import { Userentity } from "../entities/User";

export interface IUserRepository {
    signup(data: Userentity): Promise<Userentity>;
    verify(data: number): Promise<Userentity>;
    signin(username: string, password: string): Promise<Userentity>;
    signout(data: Userentity): Promise<void>;
    googleSignin(googleId: string): Promise<Userentity>;
    findUser(email:string):Promise<Userentity>;
    updatePassword(id: String,password:string):any;
    userData(data:String):Promise<Userentity>

    UpdateUser(id:String,data:any):any;

}
