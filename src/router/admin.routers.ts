import express from 'express';
const router=express.Router();

import { adminLogin,adminLogout } from '../controller/admin.authentication.controller';
import { usersData } from '../controller/admin.userhandling.controllers';


router.post('/login',adminLogin);
router.get('/logout',adminLogout);
router.get('/users',usersData);


export default router;
