import mongoose from "mongoose";
import File from './File.js'

const PersonSchema=new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: 2,
        max: 50,
      },
      lastName: {
        type: String,
        required: true,
        min: 2,
        max: 50,
      },
      email: {
        type: String,
        required: true,
        max: 50,
        unique: true,
      },
      password: {
        type: String,
        required: true,
        min: 5,
      },
      picturePath: {
        type: String,
        default: "",
      },
      userfilesId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File', // Assuming you have a File model defined
    }],
    sharedFilesIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File', // Assuming you have a File model defined
    }],

});

const Person=mongoose.model('Person',PersonSchema);
export default Person;
