import { Router } from 'express';
import { getFacturas, getImpProcesados, getTopClientes, getTotalClientes, getFacturaNum } from '../controllers/reportes.controller';

const router = Router();

router.route('/facturas/relacionado')
    .post(getFacturaNum)
    router.route('/facturas')
        .post(getFacturas)
router.route('/impprocesados')
    .post(getImpProcesados)
router.route('/topclientes')
    .post(getTopClientes)
router.route('/totalclientes')
    .post(getTotalClientes)

export default router;