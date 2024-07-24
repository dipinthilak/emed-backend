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



    async signin(username: string) {
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


    async usersCount() {
        try {
            const data = await this.userDb.find({}).count();
            return data;
        } catch (error) {
            console.log(error);

        }
    }
    

    async usersData(filter:{},skip:number,limit:number) {
        try {
            const data = await this.userDb.find(filter, { _id: 1, fullName: 1, email: 1, address: 1, phoneNo: 1, gender: 1, isActive: 1 }).sort({}).skip(skip).limit(limit);
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

    async doctorsCount(input: boolean) {
        try {
            let filterQuery: any = { isVerified: false };
            if (input) {
                filterQuery = { isVerified: true };
            }
            console.log("fril", filterQuery);
            const data = await this.Doctordb.find(filterQuery).count();
            return data;
        } catch (error) {
            console.log(error);

        }
    }



    async doctorsData(input: boolean,skip:number,limit:number) {
        try {
            let filterQuery: any = { isVerified: false };
            if (input) {
                filterQuery = { isVerified: true };
            }
            console.log("fril", filterQuery);

            const data = await this.Doctordb.find(filterQuery, {}).sort({}).skip(skip).limit(limit);;
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
        console.log("doctor verified",doctorId);
        
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
   async departmentData(input: string) {
        try {
            console.log("name--123123--",input);
            
            const data = await this.departmentDb.findOne({name:input});
            console.log("data------>",data);
            
            return data;            
        } catch (error) {
            console.log(error);
        }
    }
    async newDepartment(input: any) {
        try {
            const department = await this.departmentDb.create(input);
            return department;
        } catch (error) {
            console.log(error);
        }

    }

    async updateDepartment(departmentId: string, status: boolean) {
        const data = await this.departmentDb.findByIdAndUpdate(departmentId, { isActive: status });
        return data;
    }

}
