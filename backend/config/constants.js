export const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
export const JWT_EXPIRES_IN = '1h';
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret';
export const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '168h';
export const ROLES = ['user', 'companyOwner', 'admin'];
export const FROM_EMAIL = process.env.FROM_EMAIL || 'no-reply@talenthub.com';
