import { Userentity } from "../entities/User";

export interface IAdminInteractor {
    signinAdmin(username: string, password: string):any;
    signoutAdmin(input:any ): Promise<void>;

    usersData(pageNo:number):any;
    userStatusChange(input:string):any;
    doctorsData(input:boolean,pageNo:number):any;
    doctorStatusChange(input:string):any;
    doctorVerify(input:string):any;
    
    departmentsData():any;

    

    departmentData():any;
    
    addDepartment(input:any):any;
    departmentStatusChange(input:string):any;
    
}
