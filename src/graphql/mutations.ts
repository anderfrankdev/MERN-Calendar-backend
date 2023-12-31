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
import { isStartDateBeforeEndDate } from "../helpers/isStartDateBeforeEndDate.js";
import validator from "validator";
import { isValidUpdateEventInput } from "../helpers/isValidUpdateEventInput.js";
import { cleanUndefinedProps } from "../helpers/cleanUndefinedProps.js";
import { updateEventInDb } from "../helpers/updateEventInDb.js";

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
    if(e.name==="TokenExpiredError") return { ok: false, message: "Token expired" };
    else return { ok: false, message: "Event not created" };
  }
};

const deleteEvent: Mutation["deleteEvent"] = async (_, args, context) => {
  const { eventId, token } = args;

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY) as any;
    const event = await Event.findByIdAndDelete(eventId)

    return { ok: true, message: "Event deleted" };
  } catch (e) {
    if(e.name==="TokenExpiredError") return { ok: false, message: "Token expired" };
    else return { ok: false, message: "Event not deleted" };
  }
};

const updateEvent: Mutation["updateEvent"] = async (_, args, context) => {
    const { id,title, notes, start, end, token } = args;

    const update = cleanUndefinedProps({ title, notes, start, end })
    if(update?.title?.length<1)
      return { ok: false, message: "Title can not be empty" }

    if(!validator.default.isMongoId(id))
      return { ok: false, message: "Invalid id" }
    
    const event = await Event.findById(id);
    
    if(!event){
      return { ok: false, message: "Event's id does not exist" }
    }
    
    if(!isValidUpdateEventInput(update, event)){
      return { ok: false, message: "Invalid dates" }
    }
    
    const response = await updateEventInDb(id, update, token)
    return response
};  


export default { createUser, refreshJwt, createEvent,updateEvent,deleteEvent };
