import { injectable } from "inversify";
import { Doctorentity } from "../entities/Doctor";
import { IDoctorRepository } from "../interfaces/IDoctorRepository";
import { Doctordb } from "../models/doctorShcema";
import { Departmentdb } from "../models/departmentSchema";

@injectable()
export class DoctorRepository implements IDoctorRepository {
    private db: typeof Doctordb;
    departmentDb: typeof Departmentdb;
    constructor() {
        this.db = Doctordb;
    this.departmentDb = Departmentdb;

    }



    async googleSignin(googleId: string) {
        try {
            console.log("goooooooogle", googleId);

            const data = await this.db.findOne({ googleId: googleId });
            console.log("data at doctor repository--->>", data);

            return data;
        } catch (error) {
            console.error(error);

        }
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

    async update(data: Doctorentity) {
        try {
            console.log("doctor data @ repository----------", data);
            const {_id,}=data;
            delete data._id;
            const doctor = await this.db.findByIdAndUpdate(_id,{ ...data},{new:true});
            return doctor;
        } catch (error) {

        }

    }

    async departmentsData() {
        try {
            const data = await this.departmentDb.find();
            console.log("department datas as follows---->>>", data);
            return data;
        } catch (error) {
            console.error(error);

        }
    }


    async verify(data: any) {
        try {
            const doctorId = data;
            console.log("data at doctor repo -return---verify------>", doctorId, data);
            const doctor = await this.db.findByIdAndUpdate(doctorId, { verified: true }, { new: true });
            console.log("data at doctor repo -return---verify------>", doctor);
            return doctor;
        } catch (error) {
            console.log(error);
        }
    }


    async updatePassword(id: string, password: string) {
        try {
            const doctorId = id;
            console.log("data at doctor repo -return---verify--before---->", doctorId, "-------------", id, "----------", password);
            const doctor = await this.db.findByIdAndUpdate(doctorId, { password: password }, { new: true });
            console.log("data at doctor repo -return---verify--afterr---->", doctor);
            return doctor;
        } catch (error) {
            console.log(error);
        }
    }


    async signin(username: string) {
        try {
            const data = await this.db.findOne({ email: username }).lean();
            return data;
        } catch (error) {
            console.error(error);
        }
    }

    async findDoctor(email: string) {
        try {
            const doctor = this.db.findOne({ email: email });
            return doctor;
        } catch (error) {
            console.error(error);

        }
    }


    signout(data: Doctorentity): Promise<void> {
        throw new Error("Method not implemented.");
    }

}