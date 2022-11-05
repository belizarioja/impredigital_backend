import { Request, Response } from 'express';
import crypto from 'crypto';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import moment from 'moment';

const SECRET = process.env.SECRET || '123456';
const TIMETOKEN = process.env.TIMETOKEN || 86400;
const PEGASUS_PATH = process.env.PEGASUS_PATH;
// DB
import { pool } from '../database'

export async function getLogin (req: Request, res: Response): Promise<Response | void> {
    try {
        const { usuario, clave } = req.body;
        const clavehash = crypto.createHash('md5').update(clave).digest("hex");
        const sql = "select idrol, idserviciosmasivo, nombre, razonsocial, rol ";
        const from = " from t_usuarios a ";
        let leftjoin = " left join t_roles b ON a.idrol = b.id  ";
        leftjoin += " left join t_serviciosmasivos c ON a.idserviciosmasivo = c.id  ";
        const where = " where a.usuario ='" + usuario + "' and a.clave = '" + clave + "'";
        console.log(sql + from + leftjoin + where);
        const resp = await pool.query(sql + from + leftjoin + where);
        console.log(resp)
        const cant = resp.rows.length;
        if (cant > 0) {
            const accessToken: string = jwt.sign({ user: resp.rows[0] }, SECRET);
            const data = {
                message: "Acceso válido",
                resp: resp.rows[0],
                accessToken: accessToken
            };
            return res.status(200).json(data);
        } else {
            const data = {
                message: "Credenciales Incorrectas!"
            };
            return res.status(202).json(data);
        }
    }
    catch (e) {
        return res.status(400).send('Error Logueando ' + e);
    }
}
export async function getUsuarios (req: Request, res: Response): Promise<Response | void> {
    try {
        const sql = "select a.idrol, a.usuario, a.clave, a.idserviciosmasivo, a.nombre, c.razonsocial, b.rol, a.estatus ";
        const from = " from t_usuarios a ";
        let leftjoin = " left join t_roles b ON a.idrol = b.id  ";
        leftjoin += " left join t_serviciosmasivos c ON a.idserviciosmasivo = c.id  ";
        const resp = await pool.query(sql + from + leftjoin);
        const cant = resp.rows.length;
        const data = {
            success: true,
            resp: resp.rows
        };
        return res.status(200).json(data);        
    }
    catch (e) {
        return res.status(400).send('Error Listando Usuarios ' + e);
    }
}
export async function getRoles (req: Request, res: Response): Promise<Response | void> {
    try {
        const sql = "select * ";
        const from = " from t_roles ";
        const resp = await pool.query(sql + from);
        const cant = resp.rows.length;
        const data = {
            success: true,
            resp: resp.rows
        };
        return res.status(200).json(data);        
    }
    catch (e) {
        return res.status(400).send('Error Listando Roles ' + e);
    }
}
export async function setUsuarios (req: Request, res: Response): Promise<Response | void> {
    try {
        const { nombre, usuario, clave, idrol, idserviciosmasivo, estatus } = req.body;

        const insert = "insert into t_usuarios (nombre, usuario, clave, idrol, idserviciosmasivo, estatus ) ";
        const values = " values ($1, $2, $3, $4, $5, $6) ";
        const resp = await pool.query(insert + values, [nombre, usuario, clave, idrol, idserviciosmasivo, estatus]);
        const cant = resp.rows.length;
        const data = {
            success: true,
            resp: {
                message: "Usuario creado con éxito"
            }
        };
        return res.status(200).json(data);        
    }
    catch (e) {
        return res.status(400).send('Error Ingesando Usuario ' + e);
    }
}