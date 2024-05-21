import express from 'express';
import { Container } from 'inversify';
import { INTERFACE_TYPE } from '../utils/appConst';
import { IAdminRepository } from '../interfaces/IAdminRepository';
import { AdminRepository } from '../repositories/AdminRepository';
import { IAdminInteractor } from '../interfaces/IAdminInteractor';
import { AdminInteractor } from '../interactors/AdminInteractor';
import { AdminController } from '../controller/admin/AdminController';

const container = new Container();

container.bind<IAdminRepository>(INTERFACE_TYPE.AdminRepository).to(AdminRepository);
container.bind<IAdminInteractor>(INTERFACE_TYPE.AdminInteractor).to(AdminInteractor);
container.bind(INTERFACE_TYPE.AdminController).to(AdminController);

const controller = container.get<AdminController>(INTERFACE_TYPE.AdminController);

const router = express.Router();

router.post('/login', controller.onSigninAdmin.bind(controller));
router.get('/logout', controller.onSignoutAdmin.bind(controller));
router.get('/users',controller.onfetchUsers.bind(controller));


export default router;
