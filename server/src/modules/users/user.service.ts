import { User } from '../../models/User.ts';
import { AppError } from '../../utils/AppError.ts';

/** Returns the user profile by id, or throws 404 if not found. */
export const getProfile = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');
  return user;
};
