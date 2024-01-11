import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import multer from "multer";
import cors from "cors";
import { S3Client,PutObjectCommand} from "@aws-sdk/client-s3";
import File from "./Models/File.js";
import { getFile,deleteFile } from "./Functions/Getfile.js";
import { Signup } from "./Functions/Signup.js";


const app = express();
app.use(cors());
dotenv.config();



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


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/getfile',getFile);
app.post('/auth/register',upload2.single('picture'),Signup)
app.delete('/deletefile/:id',deleteFile);



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
app.post("/api/posts",upload.single('image'),async(req,res)=>{
    console.log(req.body);
    console.log(req.file);
    console.log(Date.now());
    //req.file.buffer is the actual file 

    const file=new File({
      fileName:`${random}_${req.file.originalname}`,
      fileType:req.file.mimetype.split('/')[0]
    })

    file.save().then((res)=>{
      console.log(res);
    }).catch((err)=>{
      console.log(err);
    })

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