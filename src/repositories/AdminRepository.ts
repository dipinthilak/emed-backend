import { injectable } from "inversify";
import { Adminentity } from "../entities/Admin";
import { IAdminRepository } from "../interfaces/IAdminRepository";
import { Admindb } from "../models/adminSchema";
import { Userdb } from "../models/userSchema";

@injectable()
export class AdminRepository implements IAdminRepository {
    private db: typeof Admindb;
    private udb: typeof Userdb;

    constructor() {
        this.udb=Userdb;
        this.db = Admindb;
    }
    
    async signin(username: string, password: string) {
        try {
            const data = await this.db.findOne({ email: username }).lean();
            return data;
        } catch (error) {
            console.error('Error in AdminRepository.signin:', error);
            throw error;
        }
    }
    
    signout(data: Adminentity): Promise<void> {
        throw new Error("Method not implemented.");
    }


    async usersData(input: any) {
        const data = await this.udb.find()
        throw new Error("Method not implemented.");
    }
}
