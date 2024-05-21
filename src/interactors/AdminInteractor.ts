import { inject, injectable } from "inversify";
import { IAdminInteractor } from "../interfaces/IAdminInteractor";
import { IAdminRepository } from "../interfaces/IAdminRepository";
import { INTERFACE_TYPE } from "../utils/appConst";
import { comparePassword } from "../helper/hashPassword";
import { createAccessToken, createRefreshToken } from "../helper/jwt";

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


   async  usersData(input: any) {
        try {
            const users =await this.repository.usersData(input);
            
        } catch (error) {
            
        }
    }
}
