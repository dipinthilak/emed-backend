import { NextFunction, Request, Response } from "express";
import { INTERFACE_TYPE } from "../../utils";
import { inject, injectable } from "inversify";
import { IDoctorInteractor } from "../../interfaces/IDoctorInteractor";

@injectable()
export class DoctorController{
    private interactor : IDoctorInteractor;
    constructor(
        @inject (INTERFACE_TYPE.DoctorInteractor) interactor :IDoctorInteractor
    )
    {
        this.interactor =interactor;}


        async onSignupDoctor(req: Request, res: Response, next: NextFunction) {
            try {
    
                const body = req.body.formData;
                const { data, otp } = await this.interactor.signUpDoctor(body);
                req.session.otp = otp;
                req.session.user = data;
                return res.status(200).json(data);
    
            } catch (error) {
                next(error)
            }
        }
    
        
        
        
        async onVerifyDoctor(req: Request, res: Response, next: NextFunction) {
            try {
                
                return res.status(200).json({status:true});
            } catch (error) {
                next(error)
            }
            
        }
        
        
        async onSigninDoctor(req: Request, res: Response, next: NextFunction) {
            try {

                return res.status(200).json({status:true});
            } catch (error) {
                next(error)
            }
        }
    
        
        async onSignoutDoctor(req: Request, res: Response, next: NextFunction) {
            try {
                res.clearCookie("userAccessToken");
                res.clearCookie("userRefreshToken");
                return res.status(200).json({status:true,message:"user signed-out succesfully"});
    
            } catch (error) {
                next(error)
            }
    
        }

    
}