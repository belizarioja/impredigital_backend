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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopClientes = exports.getTotalClientes = exports.getImpProcesados = exports.getFacturaNum = exports.getFacturas = void 0;
// DB
const database_1 = require("../database");
function getFacturas(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { idserviciosmasivo, idtipodocumento, numerodocumento, desde, hasta, exento, impuestog, impuestor, impuestoigtf, estatus, cedulacliente } = req.body;
            let sql = "select a.id, a.idserviciosmasivo, c.razonsocial, c.rif, c.direccion, c.telefono, a.numerodocumento, a.cedulacliente, a.nombrecliente, a.direccioncliente, a.telefonocliente, a.idtipodocumento, b.tipodocumento, ";
            sql += " a.trackingid, a.fecha, a.tasag, a.baseg, a.impuestog, a.tasar, a.baser, a.impuestor, a.tasaigtf, a.baseigtf, a.impuestoigtf, a.subtotal, a.total, a.exento, a.estatus, a.observacion, a.relacionado, a.fechaanulado ";
            const from = " from t_registros a, t_tipodocumentos b, t_serviciosmasivos c ";
            let where = " where a.idtipodocumento = b.id and a.idserviciosmasivo = c.id and a.estatus = " + estatus;
            if (idserviciosmasivo) {
                where += " and a.idserviciosmasivo = " + idserviciosmasivo;
            }
            if (idtipodocumento) {
                where += " and a.idtipodocumento = " + idtipodocumento;
            }
            if (numerodocumento) {
                where += " and a.numerodocumento = '" + numerodocumento + "'";
            }
            if (cedulacliente) {
                where += " and a.cedulacliente = '" + cedulacliente + "'";
            }
            if (desde && hasta) {
                where += " and a.fecha BETWEEN '" + desde + "'::timestamp AND '" + hasta + " 23:59:59'::timestamp ";
            }
            if (exento) {
                where += " and a.exento > 0 ";
            }
            if (impuestog) {
                where += " and a.impuestog > 0 ";
            }
            if (impuestor) {
                where += " and a.impuestor > 0 ";
            }
            if (impuestoigtf) {
                where += " and a.impuestoigtf > 0 ";
            }
            const orderBy = ' order by a.fecha desc, a.numerodocumento desc ';
            const resp = yield database_1.pool.query(sql + from + where + orderBy);
            const data = {
                succes: true,
                data: resp.rows
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error Listando Facturas' + e);
        }
    });
}
exports.getFacturas = getFacturas;
function getFacturaNum(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { numerodocumento, idserviciosmasivo } = req.body;
            let sql = "select c.razonsocial, c.rif, c.direccion, c.telefono, a.numerodocumento, a.cedulacliente, a.nombrecliente, a.direccioncliente, a.telefonocliente, a.idtipodocumento, b.tipodocumento, ";
            sql += " a.trackingid, a.fecha, a.tasag, a.baseg, a.impuestog, a.tasar, a.baser, a.impuestor, a.tasaigtf, a.baseigtf, a.impuestoigtf, a.subtotal, a.total, a.exento, a.estatus, a.observacion, a.relacionado ";
            const from = " from t_registros a, t_tipodocumentos b, t_serviciosmasivos c ";
            let where = " where a.idtipodocumento = b.id and a.idserviciosmasivo = c.id ";
            where += " and a.idserviciosmasivo = " + idserviciosmasivo + " and a.numerodocumento = '" + numerodocumento + "' ";
            const resp = yield database_1.pool.query(sql + from + where);
            const data = {
                succes: true,
                data: resp.rows
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error Buscando Facturas' + e);
        }
    });
}
exports.getFacturaNum = getFacturaNum;
function getImpProcesados(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { idtipodocumento, idserviciosmasivo, desde, hasta } = req.body;
            const sql = "select COUNT (*) AS total, SUM (a.impuestog) AS totalg, SUM (a.impuestor) AS totalr, SUM ( a.impuestoigtf) AS totaligtf , SUM ( a.exento) AS totalexento ";
            const from = " from t_registros a ";
            let where = " where a.idserviciosmasivo > 0 ";
            if (idtipodocumento) {
                where += " and a.idtipodocumento = " + idtipodocumento;
            }
            if (idserviciosmasivo) {
                where += " and a.idserviciosmasivo = " + idserviciosmasivo;
            }
            if (desde.length > 0 && hasta.length > 0) {
                where += " and a.fecha BETWEEN '" + desde + "'::timestamp AND '" + hasta + " 23:59:59'::timestamp ";
            }
            const resp = yield database_1.pool.query(sql + from + where);
            const data = {
                succes: true,
                data: resp.rows
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error Reporte' + e);
        }
    });
}
exports.getImpProcesados = getImpProcesados;
function getTotalClientes(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { idtipodocumento, idserviciosmasivo, desde, hasta } = req.body;
            const sql = "select COUNT (*) total , a.idserviciosmasivo  ";
            const from = " from t_registros a ";
            let where = " where a.idserviciosmasivo > 0 ";
            const groupBy = " GROUP BY a.idserviciosmasivo";
            if (idtipodocumento) {
                where += " and a.idtipodocumento = " + idtipodocumento;
            }
            if (idserviciosmasivo) {
                where += " and a.idserviciosmasivo = " + idserviciosmasivo;
            }
            if (desde.length > 0 && hasta.length > 0) {
                where += " and a.fecha BETWEEN '" + desde + "'::timestamp AND '" + hasta + " 23:59:59'::timestamp ";
            }
            const resp = yield database_1.pool.query(sql + from + where + groupBy);
            const data = {
                succes: true,
                data: resp.rows
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error Reporte' + e);
        }
    });
}
exports.getTotalClientes = getTotalClientes;
function getTopClientes(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { idtipodocumento, idserviciosmasivo, desde, hasta } = req.body;
            const sql = "select COUNT (*) total, a.idserviciosmasivo, c.razonsocial, c.rif, SUM (a.impuestog) AS totalg, SUM (a.impuestor) AS totalr, SUM ( a.impuestoigtf) AS totaligtf ";
            const from = " from t_registros a, t_serviciosmasivos c ";
            let where = " where a.idserviciosmasivo = c.id ";
            const groupBy = " GROUP BY a.idserviciosmasivo, c.razonsocial, c.rif ORDER BY totalg desc limit 5";
            if (idtipodocumento) {
                where += " and a.idtipodocumento = " + idtipodocumento;
            }
            if (idserviciosmasivo) {
                where += " and a.idserviciosmasivo = " + idserviciosmasivo;
            }
            if (desde.length > 0 && hasta.length > 0) {
                where += " and a.fecha BETWEEN '" + desde + "'::timestamp AND '" + hasta + " 23:59:59'::timestamp ";
            }
            const resp = yield database_1.pool.query(sql + from + where + groupBy);
            const data = {
                succes: true,
                data: resp.rows
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error Reporte' + e);
        }
    });
}
exports.getTopClientes = getTopClientes;
