import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import multer from "multer";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import File from "./Models/File.js";
import { getFile, deleteFile } from "./Functions/Getfile.js";
import { Signup, login } from "./Functions/Signup.js";
import { verifytoken } from "./authentication/auth.js";
import Person from "./Models/Person.js";
import { shareFile, getSharedFiles, sharedWithInfo } from "./Functions/ShareFile.js";
import { fileTypeFromBuffer } from 'file-type';


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
const upload2 = multer({ storage: storage2 });



app.get('/getfile/:userId', verifytoken, getFile);
app.get('/getsharedfile/:userId', verifytoken, getSharedFiles);
app.get('/getsharedwith/:fileId', verifytoken, sharedWithInfo);
app.post('/auth/login', login)
app.post('/auth/register', upload2.single('picture'), Signup)
app.delete('/deletefile/:id/:userId', verifytoken, deleteFile);
app.post('/sharefile', verifytoken, shareFile)





const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const access_key = process.env.ACCESS_KEY;
const secret_access_key = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: access_key,
    secretAccessKey: secret_access_key
  },
  region: bucketRegion
})


const random = Date.now();
app.post("/api/posts", upload.array('images', 20), verifytoken, async (req, res) => {

  try {
    const uploadedFiles = req.files;

    for (const uploadedFile of uploadedFiles) {
      const buffer = uploadedFile.buffer;
      const typeInfo = await fileTypeFromBuffer(buffer);

      const file = new File({
        fileName: `${uploadedFile.originalname.split('.')[0]}_${random}.${uploadedFile.originalname.split('.')[1]}`,
        fileType: typeInfo?.ext || 'n/a',
        fileOwner: req.body.username,
        fileOwnerId: req.body.id,
        fileOwnerEmail: req.body.email,
        fileSize: uploadedFile.size
      });

      const savedFile = await file.save();

      await Person.findOneAndUpdate(
        { _id: req.body.id },
        { $push: { userfilesId: savedFile._id } },
        { new: true }
      );

      const params = {
        Bucket: bucketName,
        Key: `${uploadedFile.originalname.split('.')[0]}_${random}.${uploadedFile.originalname.split('.')[1]}`,
        Body: uploadedFile.buffer,
        ContentType: uploadedFile.mimetype
      };
      const uploadCommand = new PutObjectCommand(params);
      

      await s3.send(uploadCommand);

      console.log(`File ${uploadedFile.originalname} uploaded successfully.`);
    }

    res.send({});
  }
  catch (err) {
    console.log("error :" + err.message);
  }
});



const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

  })
  .catch((error) => console.log(`${error} did not connect`));