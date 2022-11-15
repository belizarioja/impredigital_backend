import { Request, Response } from 'express';
// DB
import { pool } from '../database'

export async function getBitacora (req: Request, res: Response): Promise<Response | void> {
    try {
        const { idusuario } = req.body;

        const sql = "select a.idusuario, a.accion, b.usuario, b.nombre, a.ip, a.fecha, a.observacion ";
        const from = " from t_bitacoras a, t_usuarios b ";
        let where = " where a.idusuario = b.id ";
        if(idusuario) {
            where += "  AND a.idusuario = " + idusuario;
        }
        const resp = await pool.query(sql + from + where);             
        const cant = resp.rows.length;
        const data = {
            success: true,
            data: resp.rows
        };
        return res.status(200).json(data);        
    }
    catch (e) {
        return res.status(400).send('Error Listando Bitacoras masivos ' + e);
    }
}
export async function setBitacora (req: Request, res: Response): Promise<Response | void> {
    try {
        const { idusuario, accion, ip, observacion, fecha } = req.body;
       const insert = "insert into t_bitacoras (idusuario, accion, fecha, ip, observacion) ";
        const values = " values ($1, $2, $3, $4, $5)";
        await pool.query(insert + values, [idusuario, accion, fecha, ip, observacion]);        
        const data = {
            success: true,
            resp: {
                message: "Bitácora creada con éxito"
            }
        };
        return res.status(200).json(data);
        
    }
    catch (e) {
        return res.status(400).send('Error creando bitácora ' + e);
    }
}