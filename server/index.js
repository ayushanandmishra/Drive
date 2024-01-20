import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import multer from "multer";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { S3Client,PutObjectCommand} from "@aws-sdk/client-s3";
import File from "./Models/File.js";
import { getFile,deleteFile } from "./Functions/Getfile.js";
import { Signup,login } from "./Functions/Signup.js";
import { verifytoken } from "./authentication/auth.js";
import Person from "./Models/Person.js";
import {shareFile,getSharedFiles} from "./Functions/ShareFile.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(cors());
dotenv.config();
app.use(express.json());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
console.log("Static files served from:", path.join(__dirname, "public/assets"));

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
   return cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    return cb(null, file.originalname);
    //return cb(null, `${Date.now()}-${file.originalname}`);
  },
}); 
const upload2=multer({storage:storage2});



app.get('/getfile/:userId',getFile);
app.get('/getsharedfile/:userId',getSharedFiles);
app.post('/auth/login',login)
app.post('/auth/register',upload2.single('picture'),Signup)
app.delete('/deletefile/:id',deleteFile);
app.post('/sharefile',shareFile)





const bucketName=process.env.BUCKET_NAME;
const bucketRegion=process.env.BUCKET_REGION;
const access_key=process.env.ACCESS_KEY;
const secret_access_key=process.env.SECRET_ACCESS_KEY;

const s3=new S3Client({
  credentials:{
    accessKeyId:access_key,
    secretAccessKey:secret_access_key
  },
  region:bucketRegion
})


const random=Date.now();
app.post("/api/posts",upload.single('image'),verifytoken,async(req,res)=>{

      console.log('insode api of post');
      console.log(req.body.id);
      console.log(req.file);
      console.log(Date.now());
    // req.file.buffer is the actual file 

    const file=new File({
      fileName:`${random}_${req.file.originalname}`,
      fileType:req.file.mimetype.split('/')[1],
      fileOwner:req.body.username,
      fileOwnerId:req.body.id,
      fileOwnerEmail:req.body.email,
      fileSize:req.file.size
    })

    const savedFile = await file.save();

    const person = await Person.findOneAndUpdate(
      { _id: req.body.id },
      { $push: { userfilesId: savedFile._id } },
      { new: true } // To get the updated document
  );

    console.log(savedFile);
    console.log(person);

    const params = {
      Bucket: bucketName,
      Key: `${random}_${req.file.originalname}`,
      Body: req.file.buffer,
      ContentType:req.file.mimetype
    };
    const uploadCommand = new PutObjectCommand(params);
    const uploadResult = await s3.send(uploadCommand);
    console.log('File uploaded successfully. S3 URL:', uploadResult);
    res.send({});
})



const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

  })
  .catch((error) => console.log(`${error} did not connect`));