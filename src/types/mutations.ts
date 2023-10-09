import { type } from "os";

export interface Event {
    id:string
    title: string;
    notes?: string;
    start: string;
    end: string;
}
export interface User{
    id:String
    fullname:String
    email:String
    events?:Event[]  
    password?:String
}
export interface Response{
    ok:boolean
    token?:string
    user?:User
    message?: string | string[]
}
type createUserInput = {
    fullname: string, email: string, password: string
}
export interface Mutation{
    createUser(_:any,args:createUserInput,context:any): Promise<Response>
    refreshJwt(_:any,args:{token:string},context:any): Promise<Response>
}