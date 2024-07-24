import { NextFunction, Request, Response } from "express";
import { INTERFACE_TYPE } from "../../utils";
import { inject, injectable } from "inversify";
import { IDoctorInteractor } from "../../interfaces/IDoctorInteractor";

@injectable()
export class DoctorController {
  private interactor: IDoctorInteractor;
  constructor(
    @inject(INTERFACE_TYPE.DoctorInteractor) interactor: IDoctorInteractor
  ) {
    this.interactor = interactor;
  }




  async onSignupDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body.formData;
      console.log("request body data------------", body);

      const { data, otp, doctor } = await this.interactor.signUpDoctor(body);
      console.log("data from interactor ",data,"--other",otp,doctor);
      
      if(data.status){
        req.session.otp = otp;
        req.session.doctorData = doctor;
      }
      console.log("no controll over here-------");
      
      return res.status(200).json(data);
    } catch (error) {
      console.error("error at doctor controller --",error);
      return res.status(200).json({status:false,message:"response from the error-catch block of the doctor controller -"});
    }
  }




  async onVerifyDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const doctorId = req.session.doctorData?._id;

      const body = {
        ...req.body,
        sessionOtp: req.session.otp,
        doctorid: doctorId,
      };
      const data = await this.interactor.verifyDoctor(body);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async onUpdateDoctor(req:Request,res:Response,next:NextFunction){
    try {
      const doctorId = req.session.doctorData?._id;
      const body={_id:doctorId,
        ...req.body.formData       
      };
      const data=await this.interactor.updateDoctor(body);
      return res.status(201).json(data);
    } catch (error) {
      return res.status(401).json({messsage:"error occcured while updating doctor profile , Try contacting Admin"})
    }
  }

  async onDepartmentList(req:Request,res:Response,next:NextFunction){
    try {
      const data=await this.interactor.departmentsData();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(401).json({messsage:"error occcured while fetching department datas !"})
    }
  }
 
  async onSigninDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const username = req.body.formData.email;
      const password = req.body.formData.password;
      console.log("request body data------------", req.body);

      const response = await this.interactor.signInDoctor(username, password);
      console.log("response data from interactor---->", response);

      if (response.status) {
        res.cookie("doctorAccessToken", response.accessToken, {
          maxAge: 60000,
          httpOnly: true,
          secure: true,
          sameSite: "strict"
        });
        res.cookie("doctorRefreshToken", response.refreshToken, {
          maxAge: 3600000,
          httpOnly: true,
          secure: true,
          sameSite: "strict",
        });

        return res.status(200).json(response);
      }else{
        return res.status(200).json(response);
      }

    } catch (error) {
      next(error);
    }
  }



  async onSignoutDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie("doctorAccessToken");
      res.clearCookie("doctorRefreshToken");
      return res
        .status(200)
        .json({ status: true, message: "doctor signed-out succesfully" });
    } catch (error) {
      next(error);
    }
  }



  async onSignupGoogle(req: Request, res: Response, next: NextFunction) {
    try {
      const { body } = req;
      console.log("request body------------------>  ", body);

      const {data,doctor} = await this.interactor.signUpGoogle(body);

      console.log("response body------------------>  ", data,doctor);
      req.session.doctorData=doctor;
      return res.status(200).json(data);
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
        res.cookie("doctorAccessToken", response.accessToken, {
          maxAge: 60000,
          httpOnly: true,
          secure: true,
          sameSite: "strict"
        });
        res.cookie("doctorRefreshToken", response.refreshToken, {
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
      const { data,otp, doctor } = await this.interactor.forgotPassword(body);
      console.log("response at controller---",data,"   otp",otp,"doctor",doctor._id);
      if(data.status)
        {
          req.session.otp = otp;
          req.session.doctorData = doctor;
          console.log("session data addedd--->",req.session.otp,req.session.doctorData,"here we check again------->>");
          
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
      const doctorId = req.session.doctorData?._id;
      const doctorPassword = req.session.doctorData?.password;
      console.log(req.body,"req object--------->");
      

      const body = {
        ...req.body,
        sessionOtp: req.session.otp,
        doctorId: doctorId,
        doctorPassword:doctorPassword,
      };

      console.log("data at verify forgot password otp----->",body);
      
      const data = await this.interactor.verifyForgotDoctor(body);
      return res.status(200).json(data);

      
    } catch (error) {
      console.error(error);
      return res.status(400).json({status:false,message:"error occured!"});      
    }

  }

}
