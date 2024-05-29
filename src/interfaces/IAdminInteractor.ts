import { Userentity } from "../entities/User";

export interface IAdminInteractor {
    signinAdmin(username: string, password: string):any;
    signoutAdmin(input:any ): Promise<void>;
    usersData():any;
    userStatusChange(input:string):any;
    doctorsData(input:boolean):any;
    doctorStatusChange(input:string):any;
    departmentData():any;
    addDepartment(input:any):any;
    doctorVerify(input:string):any;
    
}
