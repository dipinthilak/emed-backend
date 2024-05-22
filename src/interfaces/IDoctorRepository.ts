import { Doctorentity } from "../entities/Doctor";

export interface IDoctorRepository{
    signup(data: Doctorentity): Promise<Doctorentity>;
    verify(data: any):any;
    signin(username: string, password: string): Promise<Doctorentity>;
    signout(data: Doctorentity): Promise<void>;
}
