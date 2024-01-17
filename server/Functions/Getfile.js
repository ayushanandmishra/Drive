import File from "../Models/File.js";
import Person from "../Models/Person.js";
import {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";





export const getFile = async (req, res) => {

    const bucketName = process.env.BUCKET_NAME;
  const bucketRegion = process.env.BUCKET_REGION;
  const access_key = process.env.ACCESS_KEY;
  const secret_access_key = process.env.SECRET_ACCESS_KEY;

  const {userId}=req.params;

  const user=await Person.findById(userId);


  const s3 = new S3Client({
    credentials: {
      accessKeyId: access_key,
      secretAccessKey: secret_access_key,
    },
    region: bucketRegion,
  });
  console.log("inside getFile");
  try {
    // const files = await File.find({});

    const userFilesIds = user.userfilesId;
    const files = await File.find({ _id: { $in: userFilesIds } });

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
  } catch (err) {
    console.log({ error_message: err.message });
  }
};


export const deleteFile=async(req,res)=>{

    const bucketName = process.env.BUCKET_NAME;
    const bucketRegion = process.env.BUCKET_REGION;
    const access_key = process.env.ACCESS_KEY;
    const secret_access_key = process.env.SECRET_ACCESS_KEY;
  
    const s3 = new S3Client({
      credentials: {
        accessKeyId: access_key,
        secretAccessKey: secret_access_key,
      },
      region: bucketRegion,
    });
    console.log('inside delete function');
    try
    {
        const id = req.params.id;
        console.log("the id is "+id);
        const file=await File.findById(id);

        if(!file)
        {
            res.status(404).send("File Not Found");
            return;
        }

        const params={
            Bucket:bucketName,
            Key:file.fileName
        }

        const command = new DeleteObjectCommand(params)
        await s3.send(command);
        await File.deleteOne({_id:id});
        res.status(200).json({ message: 'File deleted successfully' });
    }
    catch(err)
    {
        console.log({message:err.message})
    }

}


