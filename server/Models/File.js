import mongoose from "mongoose";
import Person from "./Person.js";

const FileSchema=mongoose.Schema(
    {
        fileName:String,
        fileType:String,
        fileOwner:String,
        fileOwnerId:String,
        fileOwnerEmail:String,
        fileSize:Number,
        sharedWithIds: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Person', // Assuming you have a File model defined
        }],
    }
)

const File=mongoose.model("File",FileSchema);
export default File;