import Event from "../models/events.js"

export const getEventsForUser = async (createdBy:string)=>{
    const events = await Event.find({createdBy})
    return events
}