import multer from "multer";

//temporary storage
const storage = multer.memoryStorage();

export const singleUpload = multer({ storage }).single("file");
