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
            console.log("doctor data @ repository-----------------", data);
            const doctor = await this.db.create({ ...data });
            return doctor;
        } catch (error) {
            console.error(error);
        }
    }


    async verify(data: any) {
        try {
            const doctorId = data; 
            console.log("data at doctor repo -return---verify------>",doctorId,data);

            const doctor = await this.db.findByIdAndUpdate(doctorId, { verified: true }, { new: true });
            console.log("data at doctor repo -return---verify------>",doctor);
            return doctor;
        } catch (error) {
            console.log(error);


        }
    }


   async signin(username: string, password: string) {
        try {
            const data = await this.db.findOne({ email: username }).lean();
            return data;
        } catch (error) {
            console.error(error);
            

        }
    }
    signout(data: Doctorentity): Promise<void> {
        throw new Error("Method not implemented.");
    }

}