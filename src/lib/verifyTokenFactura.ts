import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'
const SECRET = process.env.SECRET || '123456';

interface IPaylod {
    user: {
        id: number,
        rif: string
    }
}

// Authorization: Bearer <token>
export function verifyTokenFactura (req: Request, res: Response, next: NextFunction) {
    const bearerHeader = req.headers['authorization']
    // const idusuario = req.body.idusuario;
    // console.log(typeof bearerHeader)
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(" ")[1];
        try {
            const payload = jwt.verify(bearerToken, SECRET) as IPaylod;
            // console.log(payload.user)
            console.log(req.body.rif, payload.user.rif)
            if(req.body.rif === payload.user.rif)
            {
                req.id = payload.user.id || 0
                req.rif = payload.user.rif || ''
                next();
            } else {
                return res.status(202).json({
                    success: false,
                    data: null,
                    error: {
                        code: 3,
                        message: 'Token NO CORRESPONDE al RIF'
                    }
            });
            }

        } catch (e) {
            return res.status(202).json({
                success: false,
                data: null,
                error: {
                    code: 1,
                    message: 'Token NO VALIDO'
                }
            });
        }
    } else {
        res.status(401).json('Acceso denegado');
    }
}
declare global {
    namespace Express {
        interface Request {
            id: number;
            rif: string;
        }
    }
}