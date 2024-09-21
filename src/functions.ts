import { Request, Response } from 'express'
import { AccessTokenKey, SQLConfig } from './config'
import jwt from 'jsonwebtoken'
import sql from 'mssql'
import CryptoJS from 'crypto-js'

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

/**
 * Execute a query that returns a recordset
 * @param qry Query to execute
 */
export function ExecuteRecordsetQry(qry: string): Promise<{ success: boolean, message: any }>{
    return new Promise((resolve, reject) => {
        sql.connect(SQLConfig, (err) => {
            if(err) reject({ success: false, message: 'Database connection error!' })

            const req = new sql.Request()

            req.query(qry, (err, recset) => {
                if(err) reject({ success: false, message: err.message })
                
                resolve({ success: true, message: recset })
            })
        })
    })
}