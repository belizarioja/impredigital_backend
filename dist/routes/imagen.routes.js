"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const imagen_controller_1 = require("../controllers/imagen.controller");
const router = (0, express_1.Router)();
router.route('/:img').get(imagen_controller_1.getImagen);
exports.default = router;
