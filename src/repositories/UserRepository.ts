import { injectable } from "inversify";
import { Userentity } from "../entities/User";
import { IUserRepository } from "../interfaces/iUserRepository";
import { Userdb } from "../models/userSchema";


@injectable()
export class UserRepository implements IUserRepository {
    private db: typeof Userdb;
    constructor() {
        this.db = Userdb;
    }

    async signup(data: Userentity) {
        try {
            console.log("user data @ repository-----------------",data);
            
            const user = await this.db.create({ ...data });
            return user;
        } catch (error) {
            console.error(error);
        }
    }


    
    verify(data: number): Promise<Userentity> {
        throw new Error("Method not implemented.");
    }



    async signin(username: string, password: string) {
        try {
            const data = await this.db.findOne({ email: username }).lean();
            return data;
        } catch (error) {
            console.error(error);
            

        }
    }




    signout(data: Userentity): Promise<void> {
        throw new Error("Method not implemented.");
    }

}