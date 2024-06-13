import { Adminentity } from "../entities/Admin";
import { Departmententity } from "../entities/Department";
import { Doctorentity } from "../entities/Doctor";
import { Userentity } from "../entities/User";

export interface IAdminRepository {
    signin(username: string, password: string): Promise<Adminentity>;
    signout(data: Adminentity): Promise<void>;


    usersCount():any;
    usersData(filter:{},skip:number,limit:number):Promise<Userentity[]>;
    userData(input: string): Promise<Userentity>;
    updateUser(userId:string,status:boolean): Promise<Userentity | null>;

    doctorsCount(input:boolean):any;
    doctorData(input: string): Promise<Doctorentity>;
    doctorsData(input:boolean,skip:number,limit:number):Promise<Doctorentity[]>;
    updateDoctor(doctorId:string,status:boolean): Promise<Doctorentity | null>;
    verifyDoctor(doctorId:string): Promise<Doctorentity | null>;

    departmentsData():Promise<Departmententity[]>;
    
    departmentData(name:string):Promise<Departmententity>;
    updateDepartment(departmentId:string,status:boolean):Promise<Departmententity | null>
    newDepartment(input:any):Promise<Departmententity>;

}
