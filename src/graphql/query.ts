import isValidJwt from "../helpers/isValidJwt.js";
import { getEventsForUser } from "../helpers/getEventsForUserInDb.js";
import generateJWT from "../helpers/generateJwt.js";
import bcrypt from "bcryptjs";
import User from "../models/users.js";
import { isValidLoginInput } from "../helpers/isValidLoginInput.js";
import { Mutation } from "../types/mutations.js";
import jwt from "jsonwebtoken";


const query  = {
    async record(_, { id }) {
      return "Hola";
    },
    async records(_, __, context) {
      return "Hola";
    },
}

const getEvents:Mutation["getEvents"]= async (_, args, context) => {

  if(!isValidJwt(args.token)){
    return {ok:false, message:"Invalid token"}
  }
  const {uid} =  jwt.verify(args.token, process.env.SECRETORPRIVATEKEY) as any;

  const events = await getEventsForUser(uid)

  return {
    events,
    ok:true,
    message:"Events retrieved"
  }
};
const login: Mutation["login"] = async (_, args, context) => {
  const { email, password } = args;
  if (isValidLoginInput(password, email)) {
    const user = await User.findOne({ email });
    if (!user) return { ok: false, message: "Invalid email or password" };
    const validPassword = bcrypt.compareSync(password, user.password + "");
    if (!validPassword)
      return { ok: false, message: "Invalid email or password" };
    const token = await generateJWT(user.id);
    const events = await getEventsForUser(user.id)

    return {
      ok: true,
      user: { ...user.toJSON(),events },
      token,
    };
  }
  return { ok: false, message: "Invalid email or password" };
};

export default {...query,getEvents,login}