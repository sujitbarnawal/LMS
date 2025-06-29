import CryptoJS from "crypto-js";

export const GenerateSignature=(message)=>{
    const secret=import.meta.env.VITE_ESEWA_SECRET
    const hash=CryptoJS.HmacSHA256(message,secret)
    const hashInBase64=CryptoJS.enc.Base64.stringify(hash)
    return hashInBase64
}