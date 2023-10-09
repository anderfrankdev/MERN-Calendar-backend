import jwt from "jsonwebtoken"


const isValidJwt = (token: string):Boolean=> {

	
    try{
        jwt.verify(token,process.env.SECRETORPRIVATEKEY)
        return true
    }catch(e){
        return false
    }
};

export default isValidJwt;