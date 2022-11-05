"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
// Coloca aquí tus credenciales
exports.pool = new pg_1.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'impredigital',
    password: '123456'
});
/* export const pool = new Pool({
    user: 'developj_impreuser',
    host: 'localhost',
    database: 'developj_impredigital',
    password: '*impredigital*'
}) */
