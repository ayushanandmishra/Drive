import jwt from "jsonwebtoken";

export const verifytoken=(req,res,next)=>{

    try
    {
        const authHeader=req.header('authorization');
    
        if(!authHeader)
        {
           return res.status(500).json({message:"NOT AUTHORIZED"});
        }
    
        const token=authHeader.split(" ")[1]; /* authHeader starts with Bearer word and then a space so we are splitting the word in 2 part and getting the second part*/
    
        jwt.verify(token,process.env.JWT_TOKEN_SECRET,(err,user)=>{
            if(err)
            {
                res.status(403).json({err}); 
            }
    
            req.user=user;
            next();
        });
    }
    catch(err)
    {
        console.log({message:err.message});
    }

}