import { Doctorentity } from "../entities/Doctor";

export interface IDoctorInteractor{
    signUpDoctor(input:Doctorentity):any;
    verifyDoctor(otp:number):any;
    updateDoctor(input:Doctorentity):any;
    departmentsData():any;    

    signInDoctor(username:string,password:string):any;
    signoutDoctor(input:Doctorentity):any;

    forgotPassword(input:any):any;
    verifyForgotDoctor(input:any):any;

    signUpGoogle(input:Doctorentity):any;
    signInGoogle(input:String):any;
}