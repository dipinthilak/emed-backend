import express from 'express';
import { Container } from 'inversify';
import { INTERFACE_TYPE } from '../utils';
import { DoctorRepository } from '../repositories/DoctorRepository';
import { DoctorInteractor } from '../interactors/DoctorInteractor';
import { DoctorController } from '../controller/doctor/DoctorController';
import { IDoctorInteractor } from '../interfaces/IDoctorInteractor';
import { IDoctorRepository } from '../interfaces/IDoctorRepository';
// import upload from '../helper/multer'/

const container = new Container();

container.bind<IDoctorRepository>(INTERFACE_TYPE.DoctorRepository).to(DoctorRepository);
container.bind<IDoctorInteractor>(INTERFACE_TYPE.DoctorInteractor).to(DoctorInteractor);
container.bind(INTERFACE_TYPE.DoctorController).to(DoctorController);

const controller = container.get<DoctorController>(INTERFACE_TYPE.DoctorController);

const router = express.Router();

router.use(express.json());

router.post('/signup', controller.onSignupDoctor.bind(controller));
router.post('/login', controller.onSigninDoctor.bind(controller));
router.post('/verify-otp', controller.onVerifyDoctor.bind(controller));
router.post('/verify-forgototp', controller.onVerifyOtp.bind(controller));


router.get('/logout', controller.onSignoutDoctor.bind(controller));
router.post('/forgot-password', controller.onForgotPassword.bind(controller));

router.post('/google-signup', controller.onSignupGoogle.bind(controller));
router.post('/google-login', controller.onSigninGoogle.bind(controller));

export default router;
