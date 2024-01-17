import mongoose from "mongoose";

const FileSchema=mongoose.Schema(
    {
        fileName:String,
        fileType:String,
        fileOwner:String,
        fileOwnerId:String,
        fileOwnerEmail:String,
        fileSize:Number
    }
)

const File=mongoose.model("File",FileSchema);
export default File;