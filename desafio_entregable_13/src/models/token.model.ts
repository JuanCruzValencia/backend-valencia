import { Document, Schema, Types, model } from "mongoose";

type TokenDocument = Document & {
  userId: Types.ObjectId;
  token: string;
  expireAt: Date;
}

const tokenSchema: Schema<TokenDocument> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
  expireAt: {
    type: Date,
    default: new Date(),
    expires: 3600,
  },
});

const tokenModel = model<TokenDocument>("Token", tokenSchema);

export default tokenModel;
