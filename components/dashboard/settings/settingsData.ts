export type AccountSettings = { accountEmail: string; email: string; phone: string; language: string };
export const initialAccountSettings: AccountSettings = { accountEmail: "", email: "", phone: "", language: "English (UK)" };

export function isAccountSettings(value: unknown): value is AccountSettings {
  if (!value || typeof value !== "object") return false;
  const settings = value as Record<string, unknown>;
  return ["accountEmail", "email", "phone", "language"].every(key => typeof settings[key] === "string");
}

export function validatePasswordChange(current: string, next: string, confirm: string) {
  if (!current || !next || !confirm) return "Please complete all password fields.";
  if (next.length < 12 || next.length > 128 || /^\s|\s$/.test(next)) return "Use 12-128 characters without leading or trailing spaces.";
  if (next !== confirm) return "Your new passwords do not match.";
  if (current === next) return "Choose a new password that is different from your current password.";
  return "";
}
