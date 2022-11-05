"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sedes_controller_1 = require("../controllers/sedes.controller");
const router = (0, express_1.Router)();
router.route('/')
    .get(sedes_controller_1.getSedes)
    .post(sedes_controller_1.setSede);
router.route('/:id')
    .get(sedes_controller_1.getSedeCorelativo);
exports.default = router;
