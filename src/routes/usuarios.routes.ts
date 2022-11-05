import { Router } from 'express';
import { getUsuarios, setUsuarios, getLogin, getRoles } from '../controllers/usuarios.controller';

const router = Router();

router.route('/')
    .get(getUsuarios)
router.route('/')
    .post(setUsuarios)
router.route('/login')
    .post(getLogin)
router.route('/roles')
    .get(getRoles)

export default router;