import { NextFunction, Request, Response } from "express";
import { IUserInteractor } from "../../interfaces/iUserInteractor";
import { INTERFACE_TYPE } from "../../utils";
import { inject, injectable } from "inversify";


@injectable()
export class UserController {


    private interactor: IUserInteractor;

    constructor(
        @inject(INTERFACE_TYPE.UserInteractor) interactor: IUserInteractor
    ) {
        this.interactor = interactor;
    }



    async onSignupUser(req: Request, res: Response, next: NextFunction) {
        try {

            const body = req.body.formData;
            const { data, otp,user } = await this.interactor.signupUser(body);
           console.log(user,"saved ----------user data-");
           
            req.session.otp = otp;
            req.session.user = user;
            return res.status(200).json(data);
        } catch (error) {
            next(error)
        }
    }

    async onVerifyUser(req: Request, res: Response, next: NextFunction) {
        try {
            const body = { ...req.body, sessionOtp: req.session.otp ,_id:req.session.user};
            const data = await this.interactor.verifyUser(body);
            console.log("data from interactor ", data);
            if (req.session) {
                req.session.destroy((err) => {
                    if (err) {
                        console.log('Unable destroy session values');
                    }
                    else {
                        console.log('  session values destroyed');
                    }
                });
            }
            return res.status(200).json(data);
        } catch (error) {
            next(error)
        }
    }



    async onSigninUser(req: Request, res: Response, next: NextFunction) {
        try {
            const username = req.body.formData.email;
            const password = req.body.formData.password;
            const response = await this.interactor.signinUser(username, password)
            if (response.status) {
                res.cookie("userAccessToken", response.accessToken, {
                    maxAge: 60000,
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict"
                });
                res.cookie("userRefreshToken", response.refreshToken, {
                    maxAge: 3600000,
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                });
            }
            return res.status(200).json(response);
        } catch (error) {
            next(error)
        }

    }



    async onSignoutUser(req: Request, res: Response, next: NextFunction) {
        try {
            res.clearCookie("userAccessToken");
            res.clearCookie("userRefreshToken");
            return res.status(200).json({status:true,message:"user signed-out succesfully"});

        } catch (error) {
            next(error)
        }

    }


    async onSignupGoogle(req: Request, res: Response, next: NextFunction) {
        try {
          const { body } = req;
          console.log("request body------------------>  ", body);
    
          const response = await this.interactor.signUpGoogle(body);
    
          console.log("request body------------------>  ", response);
          return res.status(200).json({ status: true, message: "datas received at backend" });
        } catch (error) {
          next(error);
        }
      }
    
    
    
      async onSigninGoogle(req: Request, res: Response, next: NextFunction) {
        try {
          const { body } = req;
          console.log("request body------------------>  ", body);
          const doctorId = body.googleId;
          const response = await this.interactor.signInGoogle(doctorId);
          if (response.status) {
            res.cookie("userAccessToken", response.accessToken, {
              maxAge: 60000,
              httpOnly: true,
              secure: true,
              sameSite: "strict"
            });
            res.cookie("userRefreshToken", response.refreshToken, {
              maxAge: 3600000,
              httpOnly: true,
              secure: true,
              sameSite: "strict",
            });
          }
    
          console.log("RESPONSE body------------------>  ", response);
          return res.status(200).json(response);
        } catch (error) {
          next(error);
        }
      }

      async onForgotPassword(req: Request, res: Response, next: NextFunction){
        try {
          const { body } = req;
          console.log("request body------------------>  ", body);
          const { data,otp, user } = await this.interactor.forgotPassword(body);
          console.log("response at controller---",data,"   otp",otp,"user",user._id);
          if(data.status)
            {
              req.session.otp = otp;
              req.session.user = user;
              console.log("session data addedd--->",req.session.otp,req.session.user,"here we check again------->>");
              
              return res.status(200).json(data);
            }
            else{
              return res.status(200).json(data);
            }
        } catch (error) {
          console.error(error);
          return res.status(400).json({status:false,message:"error occured!"});
        }
      }

      async  onVerifyOtp(req: Request, res: Response, next: NextFunction)
      {
        try {
          const userId = req.session.user?._id;
          const userPassword = req.session.user?.password;
          console.log(req.body,"req object--------->",userId,userPassword,"checking----");
          
    
          const body = {
            ...req.body,
            sessionOtp: req.session.otp,
            userId: userId,
            userPassword:userPassword,
          };
    
          console.log("data at verify forgot password otp----->",body);
          
          const data = await this.interactor.verifyForgotUser(body);
          console.log("data at verify forgot password otp----->",data);

          return res.status(200).json(data);
    
          
        } catch (error) {
          console.error(error);
          return res.status(400).json({status:false,message:"error occured!"});      
        }
    
      }
    


}