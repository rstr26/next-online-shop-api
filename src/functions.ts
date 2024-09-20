import { Request, Response } from 'express'
import { AccessTokenKey } from './config'
import jwt from 'jsonwebtoken'

export function authenticateToken(req: Request, res: Response, next: () => void){
    const authHeader = req.headers['authorization']
    const token = authHeader?.split(' ')[1]

    
    if(AccessTokenKey){
        if(token){
            jwt.verify(token, AccessTokenKey, (err, user) => {
                if(err) return res.sendStatus(403)
                req.body = {...req.body, user}
                
                next()
            })
        }
        else res.sendStatus(401)
    }
    else res.sendStatus(500)
}

/**
 * Decrypt Provided String Value
 * @param value string value to decrypt
 * @param key decryption key, uses .env's decryption key if undefined
 */
export function decryptStr(value: string, key?: string){
    if(process.env.DECRYPTION_KEY){
        const k = key || process.env.DECRYPTION_KEY

        const bytes = CryptoJS.AES.decrypt(value, k)
        const decrypted = bytes.toString(CryptoJS.enc.Utf8)
        
        return decrypted
    }
}