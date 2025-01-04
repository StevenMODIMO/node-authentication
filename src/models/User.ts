import { Schema, model, Document } from "mongoose";

interface IUSER extends Document {
  email: string;
  password: string;
}

const userSchena = new Schema<IUSER>({
  email: String,
  password: String,
});

const User = model<IUSER>("User", userSchena);

export default User;
