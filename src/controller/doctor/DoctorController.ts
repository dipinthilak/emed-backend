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
      const { data, otp, doctor } = await this.interactor.signUpDoctor(body);
      req.session.otp = otp;
      req.session.user = doctor;

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async onVerifyDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const doctorId = req.session.user?._id;

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

  async onSigninDoctor(req: Request, res: Response, next: NextFunction) {
    try {
        const username = req.body.formData.email;
        const password = req.body.formData.password;
        console.log("request body data------------",req.body);
        
        const response = await this.interactor.signInDoctor(username, password);
        console.log("response data from interactor---->",response);
        
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
}
