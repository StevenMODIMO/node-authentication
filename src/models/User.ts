import { Schema, model, Document } from "mongoose";

interface IUSER extends Document {
  email: string;
  password: string;
  profileUrl: string;
}

const userSchena = new Schema<IUSER>(
  {
    email: String,
    password: String,
    profileUrl: String,
  },
  { timestamps: true }
);

const User = model<IUSER>("User", userSchena);

export default User;
