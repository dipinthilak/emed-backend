import { injectable } from "inversify";
import { Adminentity } from "../entities/Admin";
import { IAdminRepository } from "../interfaces/IAdminRepository";
import { Admindb } from "../models/adminSchema";
import { Userdb } from "../models/userSchema";
import { Doctordb } from "../models/doctorShcema";
import { Departmentdb } from "../models/departmentSchema";
import { Doctorentity } from "../entities/Doctor";
import { Departmententity } from "../entities/Department";

@injectable()
export class AdminRepository implements IAdminRepository {
    private db: typeof Admindb;
    private userDb: typeof Userdb;
    Doctordb: typeof Doctordb;
    departmentDb: typeof Departmentdb;

    constructor() {
        this.userDb = Userdb;
        this.db = Admindb;
        this.Doctordb = Doctordb;
        this.departmentDb = Departmentdb;
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


    async usersData() {
        try {
            const data = await this.userDb.find({}, { _id: 1, fullName: 1, email: 1, address: 1, phoneNo: 1, gender: 1, isActive: 1 });
            return data;
        } catch (error) {
            console.log(error);

        }
    }



    async userData(input: string) {
        try {
            const data = await this.userDb.findOne({ _id: input });
            return data;
        } catch (error) {
            console.log(error);
        }
    }


    async updateUser(userId: string, status: boolean) {
        const data = await this.userDb.findByIdAndUpdate(userId, { isActive: status });
        return data;
    }



    async doctorsData(input: boolean) {
        try {
            let filterQuery: any = { isVerified: false };
            if (input) {
                filterQuery = { isVerified: true };
            }
            console.log("fril", filterQuery);

            const data = await this.Doctordb.find(filterQuery, { _id: 1, fullName: 1, email: 1, registerNo: 1, department: 1, address: 1, phoneNo: 1, gender: 1, isActive: 1 });
            // console.log(data);
            return data;
        } catch (error) {
            console.log(error);

        }
    }


    async doctorData(input: string) {
        try {
            const data = await this.Doctordb.findOne({ _id: input, verified: true});
            return data;
        } catch (error) {
            console.log(error);
        }
    }


    async updateDoctor(doctorId: string, status: boolean) {
        const data = await this.Doctordb.findByIdAndUpdate(doctorId, { isActive: status });
        return data;
    }



    async verifyDoctor(doctorId: string): Promise<Doctorentity | null> {
        const data = await this.Doctordb.findByIdAndUpdate(doctorId, { isVerified: true });
        return data;
    }





    async departmentsData() {
        try {
            const data = await this.departmentDb.find();
            console.log("department datas as follows---->>>", data);
            return data;
        } catch (error) {
            console.error(error);

        }
    }
    departmentData(input: string): Promise<Departmententity> {
        throw new Error("Method not implemented.");
    }




    async newDepartment(input: any) {
        try {
            const department = await this.departmentDb.create(input);
            return department;
        } catch (error) {
            console.log(error);
        }

    }

    updateDepartment(departmentId: string, status: boolean): Promise<Departmententity | null> {
        throw new Error("Method not implemented.");
    }

}
