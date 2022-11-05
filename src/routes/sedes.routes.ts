import { Router } from 'express';
import { getSedes, setSede, getSedeCorelativo } from '../controllers/sedes.controller';

const router = Router();

router.route('/')
    .get(getSedes)
    .post(setSede)
    
router.route('/:id')
    .get(getSedeCorelativo)

export default router;