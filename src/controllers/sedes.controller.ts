import { Request, Response } from 'express';
import crypto from 'crypto';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import moment from 'moment';

const SECRET = process.env.SECRET || '123456';
// DB
import { pool } from '../database'

export async function getSedes (req: Request, res: Response): Promise<Response | void> {
    try {
        const sql = "select * ";
        const from = " from t_serviciosmasivos ";
        const resp = await pool.query(sql + from);
        const cant = resp.rows.length;
        const data = {
            success: true,
            data: resp.rows
        };
        return res.status(200).json(data);        
    }
    catch (e) {
        return res.status(400).send('Error Listando Servicios masivos ' + e);
    }
}
export async function setSede (req: Request, res: Response): Promise<Response | void> {
    try {
        const { rif, razonsocial, direccion, email, telefono } = req.body;
       
        const insert = "insert into t_serviciosmasivos (rif, razonsocial, direccion, email, telefono, estatus) ";
        const values = " values ($1, $2, $3, $4, $5, 1) RETURNING id";
        let resp = await pool.query(insert + values, [rif, razonsocial, direccion, email, telefono]);
        console.log(resp.rows[0].id)
        const id = resp.rows[0].id
         const datatoken = {
            id,
            rif, 
            razonsocial, 
            direccion, 
            email, 
            telefono            
        }
        const tokenservicios: string = jwt.sign({ user: datatoken }, SECRET);
        const sqlupd = "update t_serviciosmasivos set tokenservicios = $1 where id = $2 ";
        await pool.query(sqlupd, [tokenservicios, id])
        const insertselect = "INSERT INTO t_serviciosdoc (idserviciosmasivo, identificador, corelativo ) values ($1, 0, 0) ";
        await pool.query(insertselect, [id])        
        const data = {
            success: true,
            resp: {
                message: "Servicios creado con éxito"
            }
        };
        return res.status(200).json(data);
        
    }
    catch (e) {
        return res.status(400).send('Error Listando Servicios masivos ' + e);
    }
}
export async function getSedeCorelativo (req: Request, res: Response): Promise<Response | void> {
    try {
        const { id } = req.params;       
        const sql = "SELECT a.id, a.idserviciosmasivo, a.identificador, a.corelativo ";
        const from = " FROM t_serviciosdoc a ";
        const where = " WHERE a.idserviciosmasivo = $1";
        const resp = await pool.query(sql + from + where, [id]);
        const cant = resp.rows;
        const data = {
            success: true,
            data: resp.rows
        };  
        return res.status(200).json(data);
        
    }
    catch (e) {
        return res.status(400).send('Error Listando Corelativos de Servicios masivos ' + e);
    }
}