import { NextFunction, Request, Response } from "express";
import { IAdminInteractor } from "../../interfaces/IAdminInteractor";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils/appConst";

@injectable()
export class AdminController {

    private interactor: IAdminInteractor;

    constructor(
        @inject(INTERFACE_TYPE.AdminInteractor) interactor: IAdminInteractor
    ) {
        this.interactor = interactor;
    }

    async onSigninAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            
            const username = req.body.email;
            const password = req.body.password;
            const response = await this.interactor.signinAdmin(username, password)
            if (response.status) {
                res.cookie("adminAccessToken", response.accessToken, {
                    maxAge: 60000,
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict"
                });
                res.cookie("adminRefreshToken", response.refreshToken, {
                    maxAge: 3600000,
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                });
            }
            console.log("admin data at controller response---------->",response);

            return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    async onSignoutAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            res.clearCookie("userAccessToken");
            res.clearCookie("userRefreshToken");
            res.status(200).json({ status: true });
        } catch (error) {
            next(error);
        }
    }




    async onfetchUsers(req:Request,res:Response,next:NextFunction)
    {
        try {
            const user=req.body.user;
            const response = await this.interactor.usersData(user);
            
        } catch (error) {
            next(error);
        }
    }
}
