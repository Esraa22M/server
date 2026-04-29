import { RequestHandler } from 'express';
import * as yup from 'yup';

export const validateRequest = (schema: any): RequestHandler => {
  return async(req, res,next ) => {
    if (!req.body) {
      return res.status(422).json({ error: 'Empty body is not accepted' });
    }
   try {
      const schemaToValidate = yup.object({ body: schema });
      
      await schemaToValidate.validate(
        { body: req.body },
        { abortEarly: true }
      );
      next();
    } catch (err: any) {
      if (err instanceof yup.ValidationError) {
        res.status(422).json({ error: err.message });
      }
    
    }
  }
};
