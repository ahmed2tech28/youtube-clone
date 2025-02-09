import { User } from "@prisma/client";
import { Request } from "express";
import { UploadedFile } from "express-fileupload";

declare global {
  namespace Express {
    interface Request {
      files: { [fieldname: string]: UploadedFile | UploadedFile[] };
      user: User | null;
    }
  }
}
