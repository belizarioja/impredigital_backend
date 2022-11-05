import { Request, Response } from 'express';
import moment from 'moment';

// DB
import { pool } from '../database'

export async function setAnulacion (req: Request, res: Response): Promise<Response | void> {
    try {
        const { id } = req;
        const { idtipodocumento, numerodocumento, observacion } = req.body;
        if( idtipodocumento <= 0 || idtipodocumento >= 5) {
            return res.status(202).json({
                success: false,
                data: null,
                error: {
                    code: 1,
                    message: 'Valor de TIPO DOCUMENTO NO VALIDO!'
                }
            });
        }

        if(numerodocumento.length < 11) {
            return res.status(202).json({
                success: false,            
                data: null,
                error: {
                    code: 2,
                    message: 'Valor de NUMERO DOCUMENTO NO VALIDO!'
                }
            });
        }
        
        const sqlupd = " update t_registros set estatus = 2,  observacion = '" + observacion + "' ";
        const whereupd = " where idserviciosmasivo = " + id + " AND numerodocumento = '" + numerodocumento + "' AND idtipodocumento = " + idtipodocumento;
        // console.log(sqlupd + whereupd)

        const respupd = await pool.query(sqlupd + whereupd)
        
        if(respupd.rowCount === 1) {
            const data = {
                success: true,
                error: null,
                data: {
                    message: 'Documento ANULADO con éxito!'
                }           
            };
            return res.status(200).json(data);
        } else {
            const data = {
                success: false,            
                data: null,
                error: {
                    code: 3,
                    message: 'NUMERO DOCUMENTO no corresponde al tipo ni al cliente emisor!'
                }           
            };
            return res.status(202).json(data);
        }
    }
    catch (e) {
        return res.status(400).send('Error Anulando Documento ' + e);
    }
}