const jwt=require('jsonwebtoken');
const isLogin=(req,res,next)=>{
    
    try {
        if(req.session.user_id){
            let token=req.headers.authorization;
            console.log("gfgfgfg",token);
            if(token){
                //token k first elemnt ko access karo
                token=token.split(" ")[1];
                let user=jwt.verify(token,process.env.SECRET_KEY);
                req.user_id=user
                next();
            }
            else{
                res.status(404).send("Unauthorized user")
            }
            
        }
        else{
            console.log("Not logged in");
            res.status(401).send("Session is expired")
        }
    } catch (error) {
        console.log(error);
        res.status(401).send("Unauthorized user")
    }
}

const isLogoutSession=async(req,res,next)=>{
    try {
        console.log("SESSION CHECK",req.session.user_id);
        if(!req.session.user_id){
            let token=req.headers.authorization;
            console.log("gfgfgfg",token);
            if(token){
                //token k first elemnt ko access karo
                token=token.split(" ")[1];
                let user=jwt.verify(token,process.env.SECRET_KEY);
                req.user_id=user
                next();
            }
            else{
                res.status(401).json({message:"Unauthorized user"})
            }
        }
        else{
            res.status(200).send("You are logged in")
        }
        
    } catch (error) {
        console.log(error);
    }
}
const isLogout=async(req,res,next)=>{
    try {
        console.log("session==>",req.session)
        if(req.session.user_id){
            let token=req.headers.authorization;
            console.log("gfgfgfg",token);
            if(token){
                //token k first elemnt ko access karo
                token=token.split(" ")[1];
                let user=jwt.verify(token,process.env.SECRET_KEY);
                req.user_id=user
                next();
            }
            else{
                res.status(401).json({message:"Unauthorized user"})
            }
        }
        else{
            res.status(200).send("You are logged in")
        }
        
    } catch (error) {
        console.log(error);
    }
}


module.exports={
    isLogin,
    isLogoutSession,
    isLogout
}