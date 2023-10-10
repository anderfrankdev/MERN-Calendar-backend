import { Mutation } from "../types/mutations.js";
import User from "../models/users.js";
import Event from "../models/events.js";
import { User as UserType } from "../types/mutations.js";
import bcrypt from "bcryptjs";
import cloneDeep from "lodash.clonedeep";
import generateJWT from "../helpers/generateJwt.js";
import jwt from "jsonwebtoken";
import isValidJwt from "../helpers/isValidJwt.js";
import { isValidRegisterInput } from "../helpers/isValidRegisterInput.js";
import { isValidLoginInput } from "../helpers/isValidLoginInput.js";
import { isStartDateBeforeEndDate } from "../helpers/isStartDateBeforeEndDate.js";
import validator from "validator";
import { isValidUpdateEventInput } from "../helpers/isValidUpdateEventInput.js";

const createUser: Mutation["createUser"] = async (_, args, context) => {
  const { fullname, email, password } = args;
  const { errors, isValid } = isValidRegisterInput(password, email, fullname);
  if (!isValid) return { ok: false, message: errors };
  const user = new User({ fullname, email, password });

  const existEmail = await User.findOne({ email });

  if (existEmail) {
    return {
      ok: false,
      message: "The email already exist",
    };
  }

  const salt = bcrypt.genSaltSync();

  user.password = bcrypt.hashSync(String(password), salt);

  await user.save();
  const createdUser = cloneDeep(user.toJSON()) as any;
  const token = await generateJWT(createdUser.id);

  return {
    ok: true,
    user: { ...createdUser },
    token: token,
  };
};

const refreshJwt: Mutation["refreshJwt"] = async (_, args, context) => {
  const { token } = args;
  if (!token || token == undefined) return { ok: true, token: "" };

  if (isValidJwt(token)) {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY) as any;
    const newToken = await generateJWT(uid);
    return {
      ok: true,
      token: newToken,
    };
  }
  return {
    ok: false,
    token: "",
    message: "Invalid token",
  };
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

    return {
      ok: true,
      token,
    };
  }
  return { ok: false, message: "Invalid email or password" };
};
const createEvent: Mutation["createEvent"] = async (_, args, context) => {
  const { title, notes, start, end, token } = args;

  if (!isStartDateBeforeEndDate({ start, end }))
    return { ok: false, message: "Invalid start or end dates" };
  if (title.length < 1) return { ok: false, message: "Invalid title" };

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY) as any;
    const event = new Event({ title, notes, start, end, createdBy: uid });
    await event.save();
    return { ok: true, message: "Event created", event };
  } catch (e) {

    return { ok: false, message: "Event not created" };
  }
};

const updateEvent: Mutation["updateEvent"] = async (_, args, context) => {
    const { id,title, notes, start, end, token } = args;
    if(!validator.default.isMongoId(id))
        return { ok: false, message: "Invalid id" }
    
    const event = await Event.findById(id);
    
    if(!event){
            return { ok: false, message: "Event's id does not exist" }
    }
    const update = {
		title, notes, start, end
	}
	
	const keys = Object.keys(update)

	for(const i of keys){
		if (update[i]==undefined) {
			delete update[i]
		}
	}
   
    
    if(!isValidUpdateEventInput(update, event)){
        return { ok: false, message: "Invalid dates" }
    }
    
    try {
        const event = await Event
        .findByIdAndUpdate(id, {title, notes, start, end})

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY) as any;
        

        await event.save();
        return { ok: true, message: "Event Updated", event:{...event,...update} };
    } catch (e) {
        console.log(e)
        if(e.name==="TokenExpiredError")
            return { ok: false, message: "Invalid token" }
        return { ok: false, message: "Event not Updated" };
    }
};  

export default { createUser, refreshJwt, login, createEvent,updateEvent };
