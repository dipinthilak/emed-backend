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


    async usersData(): Promise<any> {
        try {
            const users = await this.repository.usersData();
            return { status: true, users };
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

    async doctorsData(input: boolean): Promise<any> {
        try {

            const doctors = await this.repository.doctorsData(input);
            return { status: true, doctors };
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
    }



    async departmentData() {
        try {
            const departments = await this.repository.departmentsData();
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
            const department = await this.repository.newDepartment(input);
            if (department) {
                return { status: true, department: department, message: "new department added" };
            } else {
                return { status: false, message: "new department not created " };
            }
            return department;
        } catch (error) {
            console.log(error);
        }
    }

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






}
