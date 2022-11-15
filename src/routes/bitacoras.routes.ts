import { Router } from 'express';
import { setBitacora, getBitacora } from '../controllers/bitacoras.controller';

const router = Router();

router.route('/')
    .post(setBitacora)
    
router.route('/listar')
    .post(getBitacora)

export default router;