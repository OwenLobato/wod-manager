import { User } from '../../models/User.ts';
import { AppError } from '../../utils/AppError.ts';

/** Returns a clean profile DTO (id, not _id; no password/__v) for the given user. */
export const getProfile = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');

  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    roles: user.roles,
    preferences: user.preferences,
  };
};
