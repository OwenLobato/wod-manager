/** Sends the password-reset email. */
export const sendPasswordResetEmail = async (to: string, resetLink: string): Promise<void> => {
  // TODO: Use Nodemailer (config/mailer.ts)
  console.log(`[email:stub] Password reset for ${to}: ${resetLink}`);
};
