import { isStartDateBeforeEndDate } from "./isStartDateBeforeEndDate.js";
import Event from "../models/events.js";

export const isValidUpdateEventInput = (update:{end:string,start:string}, event:Event ) => {
    if(((!!update.start||!!update.end) && !(!!update.start&&!!update.end))){
        if(update?.start?.length>0){
            if(!isStartDateBeforeEndDate({ start:update?.start, end:event.end })){
                return false;
            }
        }
        if(update?.end?.length>0){
            if(!isStartDateBeforeEndDate({ start:event.start, end:update?.end }))

                return false;

        }
    }
    if ((update?.start && update?.end) && !isStartDateBeforeEndDate({ start:update?.start, end:update?.end })){
        
        return false
    }

    return true;
} 