import { Request, Response } from 'express';
import fs from 'fs';

  
export async function getImagen (req: Request, res: Response): Promise<Response | void> {
    try {
        const img = req.params.img
        const path = __dirname + '/images/' + img
        // console.log(path)
        if (fs.existsSync(path)) {
        // const imgbase64 = fs.readFileSync(path, { encoding: 'base64' })
        return res.sendFile(path)
        // return res.status(200).send({ imgbase64, message: 'Imagen encontrada!' })
        } else {
        return res.status(202).send({ message: 'Imagen no encontrada!' })
        }
    }
    catch (e) {
        return res.status(400).send('Error Anulando Documento ' + e);
    }
}