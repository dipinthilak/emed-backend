import { Doctorentity } from "../entities/Doctor";

export interface IDoctorRepository{
    signup(data: Doctorentity): Promise<Doctorentity>;
    verify(data: number): Promise<Doctorentity>;
    signin(username: string, password: string): Promise<Doctorentity>;
    signout(data: Doctorentity): Promise<void>;
}
