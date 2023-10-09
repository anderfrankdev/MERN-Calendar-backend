import { Mutation } from "../types/mutations.js";
import User from "../models/users.js";
import {User as UserType} from "../types/mutations.js";
import bcrypt from "bcryptjs";
import cloneDeep from "lodash.clonedeep";
import generateJWT from "../helpers/generateJwt.js";
import jwt from "jsonwebtoken";
import isValidJwt from "../helpers/isValidJwt.js";
import { isValidRegisterInput } from "../helpers/isValidRegisterInput.js";



const createUser:Mutation["createUser"] = async (_, args, context)=>{
    const {fullname, email, password} = args
	const {errors,isValid} = isValidRegisterInput(password,email,fullname)
    if (!isValid) return {ok:false,message:errors}
	const user = new User({fullname,email,password});	
    
	const existEmail = await User.findOne({email});
	
	
	if (existEmail) {
		return {    
            ok: false,
			message:"The email already exist"
		}
	}


 	const salt = bcrypt.genSaltSync();
 	 	
 	user.password = bcrypt.hashSync(String(password),salt);
	
	await user.save();
    const createdUser = cloneDeep(user.toJSON()) as any;
    const token = await generateJWT( createdUser.id)

    return {
        ok: true,
        user:{...createdUser},
        token:token
    }
}

const refreshJwt:Mutation["refreshJwt"] = async (_, args, context)=>{
    const {token} = args
    if (!token||token==undefined) return {ok:true,token:""}

    if( isValidJwt(token) ){
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY) as any
        const newToken = await generateJWT( uid )
        console.log(newToken)
        return {
            ok: true,
            token:newToken
        }
    }
    return {
        ok: false,
        token:"",
        message:"Invalid token"
    }
}

export default {createUser,refreshJwt}