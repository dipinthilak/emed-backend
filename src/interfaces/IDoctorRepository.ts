import { Departmententity } from "../entities/Department";
import { Doctorentity } from "../entities/Doctor";

export interface IDoctorRepository{
    signup(data: Doctorentity): Promise<Doctorentity>;
    verify(data: any):any;
    update(data:Doctorentity):any ;
    signin(username: string): Promise<Doctorentity>;
    signout(data: Doctorentity): Promise<void>;
    googleSignin(googleId: string): Promise<Doctorentity>;
    findDoctor(email:string):Promise<Doctorentity>;
    updatePassword(id: string,password:string):any;
    departmentsData():Promise<Departmententity[]>;
}
