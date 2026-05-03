import { config } from "dotenv";
import path from "path";

config({ path: path.join(process.cwd(), ".env") });

export const MONGODB_URI = process.env.MONGODB_URI!;
export const PORT = process.env.PORT || 3001;
export const MAIL_TRAP_USER = process.env.MAIL_TRAP_USER!;
export const MAIL_TRAP_PASS = process.env.MAIL_TRAP_PASS!;
export const VERIFY_EMAIL = process.env.VERIFY_EMAIL!;