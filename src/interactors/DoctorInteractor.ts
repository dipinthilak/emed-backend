import { injectable,inject } from "inversify";
import { Doctorentity } from "../entities/Doctor";
import { IDoctorInteractor } from "../interfaces/IDoctorInteractor";
import { IDoctorRepository } from "../interfaces/IDoctorRepository";
import { INTERFACE_TYPE } from "../utils";

@injectable()
export class DoctorInteractor implements IDoctorInteractor{
    private repository:IDoctorRepository;
    constructor(
        @inject (INTERFACE_TYPE.DoctorRepository) repository:IDoctorRepository
    ){
        this.repository=repository;
    }



    async signUpDoctor(input: Doctorentity) {
        try {
            return { data: { status: true, message: "user created -- verify otp" }};
            
            
        } catch (error) {
            console.error(error);
            
        }
    }


    async verifyDoctor(otp: number) {
        try {
            return { data: { status: true, message: "otp verified" }};

            
        } catch (error) {
            console.error(error);
            
            
        }
    }


    signInDoctor(username: string, password: string) {
        try {
            return { data: { status: true, message: "doctor signin succesful" }};

                        
        } catch (error) {
            console.error(error);
            
            
        }
    }
    signoutDoctor(input: Doctorentity) {
        try {
            return { data: { status: true, message: "doctor signin succesful" }};
            
        } catch (error) {
            console.error(error);
            
        }
    }
    
}