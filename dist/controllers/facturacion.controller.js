"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setFacturacion = void 0;
const moment_1 = __importDefault(require("moment"));
// DB
const database_1 = require("../database");
function setFacturacion(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id, rif } = req;
            const { rifcedulacliente, nombrecliente, idtipodocumento, trackingid, tasag, baseg, impuestog, tasaigtf, baseigtf, impuestoigtf, subtotal, total, exento, tasar, baser, impuestor, relacionado } = req.body;
            if (rifcedulacliente.length === 0) {
                return res.status(202).json({
                    success: false,
                    data: null,
                    error: {
                        code: 2,
                        message: 'Valor de RIF CLIENTE no válido!'
                    }
                });
            }
            if (nombrecliente.length === 0) {
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
            if (idtipodocumento === 3 && relacionado.length === 0) {
                return res.status(202).json({
                    success: false,
                    data: null,
                    error: {
                        code: 5,
                        message: 'Campo RELACIONADO es requerido!'
                    }
                });
            }
            const sql = "select a.identificador, a.corelativo ";
            const from = " from t_serviciosdoc a ";
            const where = " where a.idserviciosmasivo = $1 ";
            const resp = yield database_1.pool.query(sql + from + where, [id]);
            // console.log(resp.rows[0].identificador);
            // console.log(resp.rows[0].corelativo);
            let identificador = Number(resp.rows[0].identificador);
            let corelativo = Number(resp.rows[0].corelativo);
            if (corelativo === 99999999) {
                corelativo = 1;
                identificador = Number(identificador) + 1;
            }
            else {
                corelativo = Number(corelativo) + 1;
            }
            // console.log(identificador)
            // console.log(corelativo)
            // console.log(trackingid)
            const sqlupd = "update t_serviciosdoc set identificador = " + identificador + ", corelativo = " + corelativo;
            const whereupd = " where idserviciosmasivo = " + id;
            // console.log(sqlupd + whereupd)
            yield database_1.pool.query(sqlupd + whereupd);
            const numerocompleto = identificador.toString().padStart(2, '0') + '-' + corelativo.toString().padStart(8, '0');
            const relacionadoBD = relacionado || '';
            // const insert = 'INSERT INTO t_registros( numeroducumento, idtipodocumento, idserviciosmasivo, trackingid, cedulacliente, nombrecliente, direccioncliente, telefonocliente, emailcliente, subtotal, total, tasag, baseg, impuestog, tasar, baser, impuestor, tasaa, basea, mpuestoa, tasaigtf, baseigtf, impuestoigtf, fecha) '
            const insert = 'INSERT INTO t_registros (numerodocumento, idtipodocumento, idserviciosmasivo, trackingid, cedulacliente, nombrecliente, subtotal, total, tasag, baseg, impuestog, tasaigtf, baseigtf, impuestoigtf, fecha, exento, tasar, baser, impuestor, estatus, relacionado) ';
            // const values = ' VALUES ($1, $2, $3, $4, %6, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24);'
            const values = ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, 1, $20)';
            yield database_1.pool.query(insert + values, [numerocompleto, idtipodocumento, id, trackingid, rifcedulacliente, nombrecliente, subtotal, total, tasag, baseg, impuestog, tasaigtf, baseigtf, impuestoigtf, (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'), exento, tasar, baser, impuestor, relacionadoBD]);
            const data = {
                success: true,
                error: null,
                data: {
                    numerodocumento: numerocompleto,
                    identificador: identificador.toString().padStart(2, '0'),
                    corelativo: corelativo.toString().padStart(8, '0'),
                    datatime: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
                    fecha: (0, moment_1.default)().format('YYYYMMDD'),
                    hora: (0, moment_1.default)().format('HH:mm:ss')
                }
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error Listando Tipos de Documentos ' + e);
        }
    });
}
exports.setFacturacion = setFacturacion;
