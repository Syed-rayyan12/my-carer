const storageKey = 'carer-account-context';
const rememberedKey = 'carer-remembered-context';
const valid = /^[a-f0-9]{32}$/;

export function newAccountContext() {
  return crypto.randomUUID().replaceAll('-', '');
}

export function getAccountContext() {
  const saved = sessionStorage.getItem(storageKey);
  if (saved && valid.test(saved)) return saved;
  const remembered = localStorage.getItem(rememberedKey);
  const context = remembered && valid.test(remembered) ? remembered : newAccountContext();
  sessionStorage.setItem(storageKey, context);
  return context;
}

export function setAccountContext(context: string, remember = false) {
  if (!valid.test(context)) throw new Error('Invalid account context');
  sessionStorage.setItem(storageKey, context);
  if (remember) localStorage.setItem(rememberedKey, context);
}

export function forgetRememberedContext() {
  if (localStorage.getItem(rememberedKey) === getAccountContext()) localStorage.removeItem(rememberedKey);
}

export const accountChannel = () => `carer-auth-${getAccountContext()}`;
