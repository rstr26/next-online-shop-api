import express, { Request, Response } from 'express'
import { Login } from '../zod/sharedSchema'
import { AccessTokenKey, ApiKey, DecryptionKey, SqlDb, UnauthorizedMsg, XValidationMsg } from '../config'
import jwt from 'jsonwebtoken'
import { authenticateToken, decryptStr, ExecuteQry, ExecuteRecordsetQry, GenerateRandomString } from '../functions'

const app = express.Router()

app.post('/login', (req: Request, res: Response) => {
    const { success } = Login.safeParse(req.body)
    
    if(success){
        const { key, uname, pword, brandcode } = req.body
        
        if(key === ApiKey){            
            if(AccessTokenKey && DecryptionKey){
                const qry =
                `
                SELECT 
                password,
                first_name AS fname,
                last_name AS lname,
                a.[user_id] AS uid
                FROM [${SqlDb()}].dbo.users AS a
                INNER JOIN [${SqlDb()}].dbo.user_info AS b ON a.[user_id] = b.[user_id]
                WHERE a.username = '${uname}' AND a.brand_code = '${brandcode}'
                `
            
                
                ExecuteRecordsetQry(qry)
                .then(({ success, message }) => {
                    const { recordset } = message
                    
                    // username found, proceed to password validation
                    if(recordset.length > 0){
                        const { password, fname, lname, uid } = recordset[0]
                    
                        const decryptedDb = decryptStr(password)
                        const decryptedReq = decryptStr(pword)

                        // compare if decrypted passwords from request and db is match
                        // if match, create a session id, register it to the database 
                        // and return signed token to client
                        if(decryptedDb === decryptedReq){
                            const sessionId = GenerateRandomString(30)
                            const sessionQry = 
                            `
                            MERGE INTO [${SqlDb()}].dbo.[sessions] AS target
                            USING (SELECT '${uid}' AS [user_id]) AS [source]
                            ON target.[user_id] = source.[user_id]
                            WHEN MATCHED THEN
                                UPDATE SET target.[session_id] = '${sessionId}'
                            WHEN NOT MATCHED THEN
                                INSERT([user_id], [session_id])
                                VALUES(source.[user_id], '${sessionId}');
                            `

                            // console.log(sessionQry)
                            // Execute session
                            ExecuteQry(sessionQry)
                            .then(() => {
                                if(AccessTokenKey){
                                    const accessToken = jwt.sign({ brandcode, fname, lname, uid, sessionId }, AccessTokenKey)

                                    res.send({ success, message: accessToken })
                                }
                            })
                            .catch(({ success, message }) => {
                                console.log(message);
                                res.send({ success, message: 'Session error, failed to login!' })
                            })
                            // res.send({ success: true })
                        }

                        // if not match, return invalid password
                        else res.send({ success: false, message: 'Invalid password.' })
                    }

                    // username not found, return invalid username
                    else res.send({ success: false, message: 'Invalid username.' })
                })
                .catch(({ success, message }) => {
                    res.send({ success, message })
                })
            }
            else res.status(500).send({ success: false })
        }
        else res.status(403).send(XValidationMsg)
    }
    else res.status(401).send(UnauthorizedMsg)
})

app.get('/validate', authenticateToken, (req: Request, res: Response) => {
    
    res.send({ status: 'ok', ...req.body })
})


module.exports = app