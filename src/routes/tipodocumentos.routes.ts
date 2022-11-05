import { Router } from 'express';
import { getTipoDocumento } from '../controllers/tipodocumentos.controller';

const router = Router();

router.route('/')
    .get(getTipoDocumento)

export default router;