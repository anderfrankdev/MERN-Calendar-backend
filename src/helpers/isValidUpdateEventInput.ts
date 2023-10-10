import { isStartDateBeforeEndDate } from "./isStartDateBeforeEndDate.js";
import Event from "../models/events.js";

export const isValidUpdateEventInput = (update:{end?:string,start?:string}, event:Event ) => {
    const {end,start} = update;

    if(update?.start?.length>0 && !end)
        return isStartDateBeforeEndDate({ start:update?.start, end:event.end })

    if(update?.end?.length>0 && !start){
        return (isStartDateBeforeEndDate({ start:event.start, end:end }))
    }

    if ((update?.start && update?.end) && !isStartDateBeforeEndDate({ start:update?.start, end:update?.end })){     
        return false
    }

    return true;
} 