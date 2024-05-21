import { Adminentity } from "../entities/Admin";

export interface IAdminRepository {
    signin(username: string, password: string): Promise<Adminentity>;
    signout(data: Adminentity): Promise<void>;
    usersData(input:any ): any;
}
