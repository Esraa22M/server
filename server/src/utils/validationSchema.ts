import { isValidObjectId } from 'mongoose';
import * as yup from 'yup';
import { categories } from './media_category';
export const CreateUserSchema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required')
    .max(100, 'Password must be at most 100 characters')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d).{8,100}$/,
      'Password must contain at least one letter and one number'
    ),
  name: yup
    .string()
    .trim()
    .min(3, 'Name must be at least 3 characters')
    .required('Name is required')
    .max(50, 'Name must be at most 50 characters')
    .max(50, 'Name must be at most 50 characters'),
});

export const tokenAndIdVerificationSchema = yup.object().shape({
  token: yup.string().trim().required('Invalid token'),
  userId: yup
    .string()
    .trim()
    .required('Invalid userId')
    .test('is-valid-object-id', 'Invalid userId', (value) =>
      isValidObjectId(value)
    ),
});
export const updatePasswordSchema = yup.object().shape({
  token: yup.string().trim().required('Invalid token'),
  userId: yup
    .string()
    .trim()
    .required('Invalid userId')
    .test('is-valid-object-id', 'Invalid userId', (value) =>
      isValidObjectId(value)
    ),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required')
    .max(100, 'Password must be at most 100 characters')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d).{8,100}$/,
      'Password must contain at least one letter and one number'
    ),
});

export const SignInValiadtionSchema = yup
  .object()
  .shape({
    email: yup
      .string()
      .email('Invalid email address')
      .required('Email is required'),
    password: yup.string().trim().required('Password is missing!'),
  });

  export const mediaValidationSchema = yup
  .object()
  .shape({
    title: yup
      .string()
      .required('Title is missing!'),
    about: yup
      .string()
      .required('About is missing!'),
    category: yup
      .string()
      .oneOf(categories, "Invalid category")
      .required('Category is missing!'),
  });