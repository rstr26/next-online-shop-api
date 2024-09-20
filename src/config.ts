
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