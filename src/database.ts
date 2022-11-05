import { Pool } from "pg";

// Coloca aquí tus credenciales
export const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'impredigital',
    password: '123456'
})
/* export const pool = new Pool({
    user: 'developj_impreuser',
    host: 'localhost',
    database: 'developj_impredigital',
    password: '*impredigital*'
}) */
