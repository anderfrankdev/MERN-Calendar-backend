import { Schema, model } from "mongoose";
import { User } from "../types/mutations.js";

const UserSchema = new Schema<User>({
  fullname: {
    type: String,
    required: [true, "The name is obligatory"],
  },
  password: {
    type: String,
    required: [true, "The password is obligatory"],
  },
  email: {
    type: String,
    required: [true, "The email is obligatory"],
    unique: true,
  },
});

UserSchema.methods.toJSON = function () {
  const { __v, _id, password, ...user } = this.toObject();
  user.id = _id;
  return user;
};

const User = model<User>("User", UserSchema);
export default User;
