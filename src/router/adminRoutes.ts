import express from 'express';
import { Container } from 'inversify';
import { INTERFACE_TYPE } from '../utils/appConst';
import { IAdminRepository } from '../interfaces/IAdminRepository';
import { AdminRepository } from '../repositories/AdminRepository';
import { IAdminInteractor } from '../interfaces/IAdminInteractor';
import { AdminInteractor } from '../interactors/AdminInteractor';
import { AdminController } from '../controller/admin/AdminController';
import { verifyAdmin } from '../helper/verifyAdmin';

const container = new Container();

container.bind<IAdminRepository>(INTERFACE_TYPE.AdminRepository).to(AdminRepository);
container.bind<IAdminInteractor>(INTERFACE_TYPE.AdminInteractor).to(AdminInteractor);
container.bind(INTERFACE_TYPE.AdminController).to(AdminController);

const controller = container.get<AdminController>(INTERFACE_TYPE.AdminController);

const router = express.Router();

router.post('/login', controller.onSigninAdmin.bind(controller));
router.get('/logout', controller.onSignoutAdmin.bind(controller));


router.get('/users/:pageNo',verifyAdmin, controller.onfetchUsers.bind(controller));
router.patch('/change-user-status/:userId', controller.onUserStatusChange.bind(controller));


router.get('/doctors', controller.onfetchDoctors.bind(controller));
router.patch('/change-doctor-status/:doctorId', controller.onDoctorStatusChange.bind(controller));

router.patch('/doctor-verification/:doctorId', controller.onDoctorsVerification.bind(controller));





router.get('/departments', controller.onfetchDepartment.bind(controller));
router.post('/addDepartments', controller.onAddDepartment.bind(controller));
router.patch('/change-department-status/:departmentId', controller.onDepartmentStatusChange.bind(controller));

// router.post('cloudSignature',controller.onGetSignature.bind(controller));
export default router;
