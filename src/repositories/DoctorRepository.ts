import { injectable } from "inversify";
import { Doctorentity } from "../entities/Doctor";
import { IDoctorRepository } from "../interfaces/IDoctorRepository";
import { Doctordb } from "../models/doctorShcema";

@injectable()
export class DoctorRepository implements IDoctorRepository {
    private db: typeof Doctordb;
    constructor() {
        this.db = Doctordb;
    }
    async signup(data: Doctorentity) {
        try {
            console.log("user data @ repository-----------------", data);
            const doctor = await this.db.create({ ...data });
            return doctor;
        } catch (error) {
            console.error(error);
        }
    }


    verify(data: number): Promise<Doctorentity> {
        throw new Error("Method not implemented.");
    }


    signin(username: string, password: string): Promise<Doctorentity> {
        throw new Error("Method not implemented.");
    }
    signout(data: Doctorentity): Promise<void> {
        throw new Error("Method not implemented.");
    }

}