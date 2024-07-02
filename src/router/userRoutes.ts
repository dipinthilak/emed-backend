import express from 'express';
import { Request, Response, NextFunction } from "express";
import { Container } from 'inversify';
import { INTERFACE_TYPE } from '../utils';
import { IUserRepository } from '../interfaces/iUserRepository';
import { UserRepository } from '../repositories/UserRepository';
import { IUserInteractor } from '../interfaces/iUserInteractor';
import { UserController } from '../controller/user/UserController';
import { UserInteractor } from '../interactors/UserInteractor';
import { verifyUser } from '../helper/verifyUser';


const container = new Container();

container.bind<IUserRepository>(INTERFACE_TYPE.UserRepository).to(UserRepository);
container.bind<IUserInteractor>(INTERFACE_TYPE.UserInteractor).to(UserInteractor);
container.bind(INTERFACE_TYPE.UserController).to(UserController)

const controller = container.get<UserController>(INTERFACE_TYPE.UserController);

const router = express.Router();

router.post('/signup', controller.onSignupUser.bind(controller));
router.post('/login', controller.onSigninUser.bind(controller));
router.post('/verify-otp', controller.onVerifyUser.bind(controller));
router.get('/logout', controller.onSignoutUser.bind(controller));
router.post('/forgot-password', controller.onForgotPassword.bind(controller));
router.post('/verify-forgototp', controller.onVerifyOtp.bind(controller));


router.get('/user-data/:userId',verifyUser,(req:Request,res:Response,next:NextFunction)=>{console.log("verify user passed--->"); next();}, controller.onUserdata.bind(controller));
router.put('/update-user/:userId', verifyUser, controller.onUserUpdate.bind(controller));
router.put('/add-member/:userId',verifyUser,controller.onAddMember.bind(controller));

router.post('/google-signup', controller.onSignupGoogle.bind(controller));
router.post('/google-login', controller.onSigninGoogle.bind(controller));

export default router;
 