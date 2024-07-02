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




    async UpdateUser(id: String, data: any) {
        try {
            console.log("user data after updated at repo", data);            
            const user = await this.db.findByIdAndUpdate(id, data);
            console.log("user data after updated at repo", user);
            return user;
        } catch (error) {
            console.error(error);
        }

    }


    async signup(data: Userentity) {
        try {
            console.log("user data @ repository-----------------", data);

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


    async googleSignin(googleId: string) {
        try {
            console.log("goooooooogle", googleId);
            const data = await this.db.findOne({ googleId: googleId });
            console.log("data at user repository--->>", data);

            return data;
        } catch (error) {
            console.error(error);

        }
    }


    async findUser(email: string) {
        try {
            const user = this.db.findOne({ email: email });
            return user;
        } catch (error) {
            console.error(error);

        }
    }


    async updatePassword(id: string, password: string) {
        try {
            const userId = id;
            console.log("data at user repo -return---verify--before---->", userId, "-------------", id, "----------", password);
            const user = await this.db.findByIdAndUpdate(userId, { password: password }, { new: true });
            console.log("data at user repo -return---verify--afterr---->", user);
            return user;
        } catch (error) {
            console.log(error);
        }
    }

    async userData(id: String) {
        try {
            const user = await this.db.findById(id, { password: 0, googleId: 0 });
            console.log("user", user);
            return user;
        } catch (error) {
            console.error(error);

        }
    }


}