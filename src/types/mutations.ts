import { type } from "os";

export interface Event {
  id: string;
  title: string;
  notes?: string;
  start: string;
  end: string;
  createdBy?: string;
}
export interface EventInput extends Event {
  token: string;
}

export interface User {
  id: String;
  fullname: String;
  email: String;
  events?: Event[];
  password?: String;
}
export interface Response {
  ok: boolean;
  token?: string;
  user?: User;
  message?: string | string[];
}
export interface eventResponse extends Response {
  event?: Event;
  ok: boolean;
  token?: string;
  user?: User;
  message?: string | string[];
}
export interface getEventsResponse extends Response {
  ok:boolean;
  message:string;
  events?:Event[]
}
type createUserInput = {
  fullname: string;
  email: string;
  password: string;
};
export interface Mutation {
  createUser(_: any, args: createUserInput, context: any): Promise<Response>;
  refreshJwt(_: any, args: { token: string }, context: any): Promise<Response>;
  login(
    _: any,
    args: { email: string; password: string },
    context: any,
  ): Promise<Response>;
  createEvent(_: any, args: EventInput, context: any): Promise<eventResponse>;
  updateEvent(_: any, args: EventInput, context: any): Promise<eventResponse>;
  getEvents(_: any, args: {token:string}, context: any): Promise<getEventsResponse>;
}
