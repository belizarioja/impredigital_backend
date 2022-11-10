import { Request, Response } from 'express';
import moment from 'moment';

// DB
import { pool } from '../database'

export async function setFacturacion (req: Request, res: Response): Promise<Response | void> {
    try {
        const { id, rif } = req;
        const { rifcedulacliente, nombrecliente, idtipodocumento, trackingid, tasag, baseg, impuestog, tasaigtf, baseigtf, impuestoigtf, subtotal, total, exento, tasar, baser, impuestor, relacionado } = req.body;
        if(rifcedulacliente.length === 0) {
            return res.status(202).json({
                success: false,
                data: null,
                error: {
                    code: 2,
                    message: 'Valor de RIF CLIENTE no válido!'
                }
            });
        }
        if(nombrecliente.length === 0) {
            return res.status(202).json({
                success: false,            
                data: null,
                error: {
                    code: 2,
                    message: 'Valor de NOMBRE CLIENTE no válido!'
                }
            });
        }
        /* if(Number(tasag) === 0) {
            return res.status(202).json({
                success: false,
                data: null,
                error: {
                    code: 2,
                    message: 'Valor de TASA G NO VALIDO!'
                }
            });
        }
        if(Number(baseg) === 0) {
            return res.status(202).json({
                success: false,
                data: null,
                error: {
                    code: 2,
                    message: 'Valor de BASE G NO VALIDO!'
                }
            });
        }
        if(Number(impuestog) === 0) {
            return res.status(202).json({
                success: false,
                data: null,
                error: {
                    code: 2,
                    message: 'Valor de IMPUESTO G NO VALIDO!'
                }
            });
        } */
        // console.log(Number(baseg) * Number(tasag) / 100, Number(impuestog))
        /* if(Number(baseg) > 0 && Number(tasag) > 0) {
            if((Number(baseg) * Number(tasag) / 100) !== Number(impuestog)) {
                return res.status(202).json({
                    success: false,
                    data: null,
                    error: {
                        code: 4,
                        message: 'Valor de IMPUESTO G MAL CALCULADO!'
                    }
                });
            }
        } */
        if(idtipodocumento === 3 && relacionado.length === 0) {
            return res.status(202).json({
                success: false,
                data: null,
                error: {
                    code: 5,
                    message: 'Campo RELACIONADO es requerido!'
                }
            });
        }
        /* const sql = "select f_registros($1) ";
        const resp = await pool.query(sql, [id]);
        console.log(resp) */

        const sql = " UPDATE t_serviciosdoc ";
        let set = " SET identificador = CASE WHEN corelativo = 99999999 THEN identificador + 1 ELSE identificador END, ";
        set += " corelativo = CASE WHEN corelativo = 99999999 THEN 1 ELSE corelativo + 1 END ";
        const where = " where idserviciosmasivo = $1 RETURNING idserviciosmasivo, identificador, corelativo ";
      
        // console.log(sql + set + where);
        const resp = await pool.query(sql + set + where, [id]);

        // console.log(resp);
        // console.log(resp.rows[0].idserviciosmasivo);
        // console.log(resp.rows[0].identificador);
        // console.log(resp.rows[0].corelativo);

        let identificador = Number(resp.rows[0].identificador)
        let corelativo = Number(resp.rows[0].corelativo)
        /*if(corelativo === 99999999) {
            corelativo = 1
            identificador = Number(identificador) + 1
        } else {
            corelativo = Number(corelativo) + 1
        }

        // console.log(identificador)
        // console.log(corelativo)
        // console.log(trackingid)
        
        const sqlupd = "update t_serviciosdoc set identificador = " + identificador + ", corelativo = " + corelativo;
        const whereupd = " where idserviciosmasivo = " + id;

        await pool.query(sqlupd + whereupd) */
        
        const numerocompleto =  identificador.toString().padStart(2, '0') + '-' + corelativo.toString().padStart(8, '0')
        const relacionadoBD = relacionado || ''
        const insert = 'INSERT INTO t_registros (numerodocumento, idtipodocumento, idserviciosmasivo, trackingid, cedulacliente, nombrecliente, subtotal, total, tasag, baseg, impuestog, tasaigtf, baseigtf, impuestoigtf, fecha, exento, tasar, baser, impuestor, estatus, relacionado ) '
        const values = ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, 1, $20)'
        await pool.query(insert + values, [numerocompleto, idtipodocumento, id, trackingid, rifcedulacliente, nombrecliente, subtotal, total, tasag, baseg, impuestog, tasaigtf, baseigtf, impuestoigtf, moment().format('YYYY-MM-DD HH:mm:ss'), exento, tasar, baser, impuestor, relacionadoBD])
        
        const data = {
            success: true,
            error: null,
            data: {
                numerodocumento:  numerocompleto,
                identificador: identificador.toString().padStart(2, '0'),
                corelativo: corelativo.toString().padStart(8, '0'),
                datatime: moment().format('YYYY-MM-DD HH:mm:ss'),
                fecha: moment().format('YYYYMMDD'),
                hora: moment().format('HH:mm:ss')
            }           
        };
        return res.status(200).json(data); 

    }
    catch (e) {
        return res.status(400).send('Error Listando Tipos de Documentos ' + e);
    }
}