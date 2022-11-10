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
exports.getImagen = void 0;
const fs_1 = __importDefault(require("fs"));
function getImagen(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const img = req.params.img;
            const path = __dirname + '/images/' + img;
            // console.log(path)
            if (fs_1.default.existsSync(path)) {
                // const imgbase64 = fs.readFileSync(path, { encoding: 'base64' })
                return res.sendFile(path);
                // return res.status(200).send({ imgbase64, message: 'Imagen encontrada!' })
            }
            else {
                return res.status(202).send({ message: 'Imagen no encontrada!' });
            }
        }
        catch (e) {
            return res.status(400).send('Error Anulando Documento ' + e);
        }
    });
}
exports.getImagen = getImagen;
