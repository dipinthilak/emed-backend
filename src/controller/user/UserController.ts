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
            const { data, otp } = await this.interactor.signupUser(body);
            req.session.otp = otp;
            req.session.user = data;
            return res.status(200).json(data);

        } catch (error) {
            next(error)
        }
    }

    async onVerifyUser(req: Request, res: Response, next: NextFunction) {
        try {
            const body = { ...req.body, sessionOtp: req.session.otp };
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


}