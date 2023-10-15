import Event from "../models/events.js";
import jwt from "jsonwebtoken";

export const updateEventInDb = async (id,update,token) => {

    try {
        const event = await Event
        .findByIdAndUpdate(id, update)

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY) as any;

        await event.save();
        
        Object.entries(update).forEach(([key,value])=>event[key]=value)

        return { ok: true, message: "Event Updated", event };
    } catch (e) {
        console.log(e)
        if(e.name==="TokenExpiredError")
            return { ok: false, message: "Token expired" }
        return { ok: false, message: "Event not Updated" };
    }

}