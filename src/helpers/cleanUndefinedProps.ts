import { curry, entries, pipe, reduce } from "@fxts/core"
import { cleanUndefinedReducer } from "./cleanUndefineReducer.js"

const clean =(entries)=>reduce(cleanUndefinedReducer,{},entries)

export const cleanUndefinedProps = ({title,notes,start,end})=>{

    return pipe(
        {title,notes,start,end},
        entries,
        clean,
        Object.freeze
    ) as any
}

