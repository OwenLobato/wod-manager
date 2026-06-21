import { User, type IUser } from '../../models/User.ts';
import { AppError } from '../../utils/AppError.ts';
import type { UpdatePreferencesInput } from './user.validator.ts';

/** Maps a user document to a clean profile DTO (id, not _id; no password/__v). */
const toProfileDTO = (user: IUser) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  roles: user.roles,
  preferences: user.preferences,
  box: user.box ? String(user.box) : null,
  gender: user.gender,
  birthDate: user.birthDate,
  isPublic: user.isPublic ?? true,
  avatarUrl: user.avatarUrl,
  bio: user.bio,
  organizerStatus: user.organizerStatus ?? 'none',
  plan: user.plan ?? 'free',
});

export type ProfileDTO = ReturnType<typeof toProfileDTO>;

/** Returns the profile DTO for the given user, or throws 404 if not found. */
export const getProfile = async (userId: string): Promise<ProfileDTO> => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'users.errors.notFound');

  return toProfileDTO(user);
};

/** Applies a partial preferences patch and returns the updated profile DTO. */
export const updatePreferences = async (
  userId: string,
  patch: UpdatePreferencesInput
): Promise<ProfileDTO> => {
  const update: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(patch)) {
    update[`preferences.${key}`] = value;
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: update },
    { returnDocument: 'after', runValidators: true }
  );
  if (!user) throw new AppError(404, 'users.errors.notFound');

  return toProfileDTO(user);
};
