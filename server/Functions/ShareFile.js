import File from "../Models/File.js";
import Person from "../Models/Person.js";
import {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


export const shareFile=async(req,res)=>{

    const {email,fileId}=req.body;
    console.log(req.body);
    try
    {
        const person = await Person.findOne({ email });

            if (!person) {
                 return res.status(404).json({ message: "Email entered is valid" });
            }
            if (person.sharedFilesIds.includes(fileId)) {
                return res.status(200).json({ message: "File is already shared with the user" });
              }

        person.sharedFilesIds.push(fileId);

    // Save the updated person
    await person.save();
    res.status(200).json({ message: "File shared successfully" });
    }
    catch(err)
    {
        console.log({ error_message: err.message });
    }
   
    
}

export const getSharedFiles=async(req,res)=>{

    const {userId}=req.params;
    console.log(userId)

    const bucketName = process.env.BUCKET_NAME;
    const bucketRegion = process.env.BUCKET_REGION;
    const access_key = process.env.ACCESS_KEY;
    const secret_access_key = process.env.SECRET_ACCESS_KEY;


    const user=await Person.findById(userId);

    const s3 = new S3Client({
        credentials: {
          accessKeyId: access_key,
          secretAccessKey: secret_access_key,
        },
        region: bucketRegion,
      });

     

      try
      {
        const sharedFilesIds = user.sharedFilesIds;
        const files = await File.find({ _id: { $in: sharedFilesIds } });

        const filesWithUrls = await Promise.all(files.map(async (file) => {
            const getObjectParams = {
              Bucket: bucketName,
              Key: file.fileName,
            };
      
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
      
            // Create a new object with the additional fileurl property
            return {
              ...file.toObject(), // Convert Mongoose document to plain JavaScript object
              fileurl: url,
            };
          }));
        
        res.status(201).json(filesWithUrls);
    }
      catch(err)
      {
        console.log(err.message);
      }
}