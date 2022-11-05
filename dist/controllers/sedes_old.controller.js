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
exports.getSedeCorelativo = exports.setSede = exports.getSedes = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET = process.env.SECRET || '123456';
// DB
const database_1 = require("../database");
function getSedes(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sql = "select * ";
            const from = " from t_serviciosmasivos ";
            const resp = yield database_1.pool.query(sql + from);
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
    });
}
exports.getSedes = getSedes;
function setSede(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { rif, razonsocial, direccion, email, telefono } = req.body;
            const insert = "insert into t_serviciosmasivos (rif, razonsocial, direccion, email, telefono, estatus) ";
            const values = " values ($1, $2, $3, $4, $5, 1) RETURNING id";
            let resp = yield database_1.pool.query(insert + values, [rif, razonsocial, direccion, email, telefono]);
            console.log(resp.rows[0].id);
            const id = resp.rows[0].id;
            const datatoken = {
                id,
                rif,
                razonsocial,
                direccion,
                email,
                telefono
            };
            const tokenservicios = jsonwebtoken_1.default.sign({ user: datatoken }, SECRET);
            const sqlupd = "update t_serviciosmasivos set tokenservicios = $1 where id = $2 ";
            yield database_1.pool.query(sqlupd, [tokenservicios, id]);
            const insertselect = "INSERT INTO t_serviciostipodoc (idserviciosmasivo, idtipodocumento, identificador, corelativo ) (SELECT $1, id, 0, 0  FROM t_tipodocumentos ) ";
            yield database_1.pool.query(insertselect, [id]);
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
    });
}
exports.setSede = setSede;
function getSedeCorelativo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const sql = "SELECT a.id, a.idserviciosmasivo, a.idtipodocumento, b.tipodocumento, a.identificador, a.corelativo ";
            const from = " FROM t_serviciostipodoc a, t_tipodocumentos b ";
            const where = " WHERE a.idtipodocumento = b.id AND a.idserviciosmasivo = $1";
            const resp = yield database_1.pool.query(sql + from + where, [id]);
            const cant = resp.rows;
            const data = {
                success: true,
                data: resp.rows
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error Listando Servicios masivos ' + e);
        }
    });
}
exports.getSedeCorelativo = getSedeCorelativo;
