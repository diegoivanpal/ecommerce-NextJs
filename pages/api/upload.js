import formidable from 'formidable'
import path from 'path'
import fs from 'fs/promises'


export default async function handle(req,res) {
    try {
       // console.log("Read Directory")
        await fs.readdir(path.join(process.cwd() +"/public","/images"))
    } catch (error) {
       // console.log("MkDir Directory")
        await fs.mkdir(path.join(process.cwd() +"/public","/images"))
    }
   
   const options = {}
   options.uploadDir = path.join(process.cwd(), "/public/images")
   options.filename = (name, ext, path, form) =>{ 
    return Date.now().toString() + "_" +path.originalFilename
   }

   const form = formidable(options)

   const {fields,files} = await new Promise((resolve, reject) =>{
    form.parse(req, (err, fields, files) => {
        if (err) reject(err)
            resolve({fields,files})   
       })
   })
    const link = files.file.filepath
    console.log(files.file)

   return res.status(200).json({link})

}

export const config = {
    api: {bodyParser: false}
}