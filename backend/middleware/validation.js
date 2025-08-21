import { registerValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator } from '../utils/validators.js';

export const validateRegister = registerValidator;
export const validateLogin = loginValidator;
export const validateForgotPassword = forgotPasswordValidator;
export const validateResetPassword = resetPasswordValidator;
