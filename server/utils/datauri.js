import DataURIParser from "datauri/parser.js";
import path from "path";

export const getDataUri = (file) => {
  //it will have photo in png jpg
  const parser = new DataURIParser();
  //console.log("Parser: ",parser)
  //existing path
  const exisPath = path.extname(file.originalname).toString();
  //console.log("existing path: ",exisPath)

  //console.log("File buffer", file.buffer)
  return parser.format(exisPath, file.buffer);
};
