import { MONGODB_URI } from "#/utils/variables";
import mongoose from "mongoose";
mongoose.connect(MONGODB_URI).then(() => {
  console.log("Connected to MongoDB");
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});

export default mongoose;