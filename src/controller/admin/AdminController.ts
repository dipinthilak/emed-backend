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

    //clodinary signature api
    // async onGetSignature(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         console.log("req data-->", req.body);
    //         const { folder } = req.body;
    //         const timestamp = Math.round(new Date().getTime() / 1000);
    //         const cloudinaryApiSecret: any = process.env.CLOUDINARY_API_SECRET;

    //         const signature = cloudinary.utils.api_sign_request
    //         (
    //             {
    //                 timestamp,
    //                 folder,
    //             },
    //             cloudinaryApiSecret
    //         );
    //         console.log("tstamp and signature------>", timestamp, signature);
    //         res.status(200).json({ status: true, timestamp, signature });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ status: false, message: " error occured while creating signature--" })
    //     }
    // }







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
            console.log("admin data at controller response---------->", response);

            return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    async onSignoutAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            res.clearCookie("userAccessToken");
            res.clearCookie("userRefreshToken");
            return res.status(200).json({ status: true, messgae: "admin signout succesfully " });
        } catch (error) {
            next(error);
        }
    }

    async onfetchUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const { status, users } = await this.interactor.usersData();
            return res.status(200).json({ status, users })
        } catch (error) {
            next(error);
        }
    }

    async onUserStatusChange(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const { status, user } = await this.interactor.userStatusChange(userId);
            return res.status(200).json({ status: true, user, message: "user status changed" });
        } catch (error) {
            console.error(error);
            next(error);
        }
    }


    async onfetchDoctors(req: Request, res: Response, next: NextFunction) {
        try {
            let data: boolean = false;
            console.log("fhsdhf", req.query.verified, "fhsdhf");
            if (req.query.verified == 'true') {
                data = true;
            }
            const { status, doctors } = await this.interactor.doctorsData(data);
            return res.status(200).json({ status, doctors })
        } catch (error) {
            next(error);
        }
    }

    async onDoctorsVerification(req: Request, res: Response, next: NextFunction) {
        try {
            const { doctorId } = req.params;
            console.log("params at doc verification controller------>", doctorId);

            const response = await this.interactor.doctorVerify(doctorId);
            return res.status(200).json(response)
        } catch (error) {
            next(error);
        }
    }



    async onDoctorStatusChange(req: Request, res: Response, next: NextFunction) {
        try {
            const { doctorId } = req.params;
            const { status, doctor } = await this.interactor.doctorStatusChange(doctorId);
            console.log(doctor, "---------------", status);

            return res.status(200).json({ status: true, doctor, message: "doctor status changed" });
        } catch (error) {
            console.error(error);
            next(error);
        }
    }


    async onfetchDepartment(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("request arrived at controller----->");

            const response = await this.interactor.departmentData();
            console.log("response data at controller--->>", response);

            return res.status(200).json(response)
        } catch (error) {
            next(error);
        }
    }

    async onAddDepartment(req: Request, res: Response, next: NextFunction) {
        try {
            const departmentData = req.body;
            console.log("request body---formdata  ---->  ", departmentData);
            const response = await this.interactor.addDepartment(departmentData);
            if (response.status) {
                return res.status(201).json(response)
            } else {
                return res.status(200).json(response);
            }
        } catch (error) {
            console.error(error);

        }
    }

}
