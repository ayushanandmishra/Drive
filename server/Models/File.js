import mongoose from "mongoose";

const FileSchema=mongoose.Schema(
    {
        fileName:String,
        fileType:String
    }
)

const File=mongoose.model("File",FileSchema);
export default File;