import { inject, injectable } from "inversify";
import { IAdminInteractor } from "../interfaces/IAdminInteractor";
import { IAdminRepository } from "../interfaces/IAdminRepository";
import { INTERFACE_TYPE } from "../utils/appConst";
import { comparePassword } from "../helper/hashPassword";
import { createAccessToken, createRefreshToken } from "../helper/jwt";
import { Userentity } from "../entities/User";

@injectable()
export class AdminInteractor implements IAdminInteractor {

    private repository: IAdminRepository;

    constructor(
        @inject(INTERFACE_TYPE.AdminRepository) repository: IAdminRepository
    ) {
        this.repository = repository;
    }


    async signinAdmin(username: string, password: string) {
        try {

            const admin = await this.repository.signin(username, password);
            if (!admin || !admin.password) {
                return { status: false, message: "User not found" };
            }
            const validPass = await comparePassword(password, admin.password);
            if (!validPass) {
                return { status: false, message: 'Password is incorrect!' };
            }
            delete admin.password;
            const accessToken = createAccessToken(admin, process.env.ACCESS_SECRET_KEY || '', process.env.ACCESS_EXPIRY || '');
            const refreshToken = createRefreshToken(admin, process.env.REFRESH_SECRET_KEY || '', process.env.REFRESH_EXPIRY || '');
            return { status: true, admin: admin, accessToken, refreshToken };
        } catch (error) {
            console.error('Error in AdminInteractor.signinAdmin:', error);
            throw error;
        }

    }

    signoutAdmin(): Promise<void> {
        throw new Error("Method not implemented.");
    }


    async usersData(pageNo: number): Promise<any> {
        try {
            const pageSize = 5;
            const userCount = await this.repository.usersCount();
            const totalPages = Math.ceil(userCount / pageSize);
            const skip = pageSize * (pageNo - 1);
            const limit = pageSize * pageNo;
            console.log("uses count is -->", userCount, "no of pages-->", totalPages, "skip-->", skip, "limit-->", limit);
            const users = await this.repository.usersData({}, skip, pageSize);
            return { status: true, users, totalPages };
        } catch (error) {
            console.error(error);
        }
    }


    async userStatusChange(input: string) {
        try {
            const user = await this.repository.userData(input);
            const status = !user?.isActive;
            const userId: any = user?._id;
            const resultq = await this.repository.updateUser(userId, status);
            const result = await this.repository.userData(input);
            if (result) {
                result.password = '';
                return { status: true, user: result }
            }
        } catch (error) {
            console.error(error);
        }
    }






    async doctorsData(input: boolean, pageNo: number): Promise<any> {
        try {

            const pageSize = 5;
            const userCount = await this.repository.doctorsCount(input);
            const totalPages = Math.ceil(userCount / pageSize);
            const skip = pageSize * (pageNo - 1);
            const limit = pageSize * pageNo;
            console.log("uses count is -->", userCount, "no of pages-->", totalPages, "skip-->", skip, "limit-->", limit);
            const doctors = await this.repository.doctorsData(input,skip,pageSize);
            return { status: true, doctors,totalPages};
        } catch (error) {

        }
    }


    async doctorStatusChange(input: string) {
        try {
            const doctor = await this.repository.doctorData(input);
            const status = !doctor?.isActive;
            const doctorId: any = doctor?._id;
            const resultq = await this.repository.updateDoctor(doctorId, status);
            const result = await this.repository.doctorData(input);
            if (result) {
                result.password = '';
                return { status: true, doctor: result }
            }
        } catch (error) {
            console.error(error);
        }
    };


    async doctorVerify(input: string) {
        try {
            console.log("input at doc verify interactor", input);
            const doctor = await this.repository.verifyDoctor(input)
            if (doctor) {
                return { status: true, doctor, message: "doctor verified" }
            }
            else {
                return { status: false, doctor, message: "doctor not verified succesfully " }
            }

        } catch (error) {
            console.error(error);
        }
    }








    departmentData() {
        try {

        } catch (error) {

        }
    }



    async departmentsData() {
        try {
            const departments = await this.repository.departmentsData();
            console.log("department datas-----", departments);

            if (departments) {
                return { status: true, departments: departments, message: "deparment data fetched succesfully" };
            } else {
                return { status: false, message: "deparment data not fetched " };
            }
        } catch (error) {
            console.error(error);
        }
    }


    async addDepartment(input: any) {
        try {
            console.log("input data-----", input);
            const { name } = input;
            console.log(name, "<----------  name of department");

            const data = await this.repository.departmentData(name);
            console.log("data at interactor", data);

            if (!data) {
                const department = await this.repository.newDepartment(input);
                if (department) {
                    return { status: true, department: department, message: "new department added" };
                } else {
                    return { status: false, message: "new department not created " };
                }
                return department;
            }
            else {
                return { status: false, message: "department already exist!" }
            }

        } catch (error) {
            console.log(error);
        }
    }


    async departmentStatusChange(input: string) {
        try {
            const department = await this.repository.departmentData(input);
            console.log("department data----",department);
            
            const status = !department.isActive;
            const departmentId: any = department._id;
            const resultq = await this.repository.updateDepartment(departmentId, status);
            const result = await this.repository.departmentData(input);
            if (result) {
                return { status: true, department: department, message: "department status changed succesfully" }
            }
        } catch (error) {
            console.error(error);
        }
    }


}
