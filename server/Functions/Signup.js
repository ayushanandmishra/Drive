import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import Person from "../Models/Person.js";

export async function Signup(req,res)
{   
    
    try
    {
        const{
            firstName,
            lastName,
            email,
            password,
            picturePath,
        }=req.body;

        const salt=await bcrypt.genSalt();
        const hashPassword=await bcrypt.hash(password,salt);

        const newPerson=new Person({
            firstName,
            lastName,
            email,
            password:hashPassword,
            picturePath
        });

        const savePerson=await newPerson.save();
        res.status(201).json(savePerson);

    }
    catch(err)
    {
        res.status(500).json(err.message);
    }
}

export const login=async(req,res)=>{

   
    try
    {   
        const {email,password}=req.body;
        const person=await Person.findOne({email:email});
      

        if(!person)
        {
           return res.status(500).send({message:"User Not Found"});
        }

        const passwordMatch=await bcrypt.compare(password,person.password);

        if(!passwordMatch)
        {
            return res.status(400).json({ msg: "Invalid credentials. " });
        }

        const objectToSerialize = { id: person._id };

        const accessToken = jwt.sign(
            objectToSerialize,
            process.env.JWT_TOKEN_SECRET
        );

        delete person.password;
        res.status(200).send({person:person,token:accessToken})
            

    }
    catch(err)
    {
        res.send({error_message:err.message})
    }
   
}