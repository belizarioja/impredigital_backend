"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reportes_controller_1 = require("../controllers/reportes.controller");
const router = (0, express_1.Router)();
router.route('/facturas/relacionado')
    .post(reportes_controller_1.getFacturaNum);
router.route('/facturas')
    .post(reportes_controller_1.getFacturas);
router.route('/impprocesados')
    .post(reportes_controller_1.getImpProcesados);
router.route('/topclientes')
    .post(reportes_controller_1.getTopClientes);
router.route('/totalclientes')
    .post(reportes_controller_1.getTotalClientes);
exports.default = router;
