
export const ApiKey = process.env.API_KEY



export const DecryptionKey = process.env.DECRYPTION_KEY



export const AccessTokenKey = process.env.ACCESS_TOKEN_SECRET



export const XValidationMsg = { success: false, message: 'Request failed, forbidden access!' }



export const UnauthorizedMsg = { success: false, message: 'Request failed, unauthorized access!' }



// for every client/brand, add their url here for CORS to accept the incoming requests
export function CorsOrigins(env: string){
    return [
        ... env === 'DEVELOPMENT' ? ['http://localhost:3000'] : [], // local/dev origin
    ]
}



// Get database name
export function SqlDb(env?: string): string{
    const e = env || process.env.ENVIRONMENT
    return e === 'PRODUCTION' ? 'online_shop.v1' : 'online_shop.v1_test'
}



// SQL Server Config
export const SQLConfig = {
    user: 'shopinas',
    password: process.env.SQL_PW,
    server: 'LAPTOP-QH8MA6C7',
    // database: process.env.ENVIRONMENT === 'PRODUCTION' ? 'online_shop.v1' : 'online_shop.v1_test',
    options: {
        encrypt: false,
        trustedConnection: true,
        trustServerCertificate: true
    }
}