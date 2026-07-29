import { RequestHandler } from 'express';
import { Request } from 'express';
import formidable from 'formidable';
export interface RequestWithFiles extends Request {
  files?: { [key: string]: formidable.File };
}
export const fileParser: RequestHandler = async (
  req: RequestWithFiles,
  res,
  next
) => {
  if (!req.headers['content-type']?.startsWith('multipart/form-data')) {
    return res.status(422).json({ error: 'only accept form-data!' });
  }
  const form = formidable({ multiples: false });
  const [fields, files] = await form.parse(req);
  console.log('fields : ', fields);
  console.log('files : ', files);
  for (const key in fields) {
    const field = fields[key];
    if (field !== undefined && field !== null) {
      req.body[key] = Array.isArray(field) ? field[0] : field;
    }
  }
  for (const key in files) {
    const file = files[key];
    if (!req.files) {
      req.files = {};
    }
    if (file) {
      req.files[key] = Array.isArray(file) ? file[0] : file;
    }
  }
  next();
};
