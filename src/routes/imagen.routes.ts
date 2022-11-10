import { Router } from 'express';
import { getImagen } from '../controllers/imagen.controller';

const router = Router();

router.route('/:img').get(getImagen)

export default router;