import { Document, Schema, model } from "mongoose";

export interface Message {
  user: string;
  message: string;
}

type MessageDocument = Document & Message;

const messageSchema: Schema<MessageDocument> = new Schema({
  user: String,
  message: String,
});

const messageModel = model<MessageDocument>("Messages", messageSchema);

export default messageModel;
