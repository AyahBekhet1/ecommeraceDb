import cloudinary from "./cloudinary.js"

export const deleteFromCloudinary = async(req,res,next)=>{
    if(req?.filePath){
        console.log(req.filePath)
        await cloudinary.api.delete_resources_by_prefix(req.filePath) // btfdi l swar eli gowa l file
        await cloudinary.api.delete_folder(req.filePath) // bms7 l folder bs lazm l 5atwa eli ablha l awl
        next()
    }
}