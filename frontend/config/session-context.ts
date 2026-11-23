// A context selects a cookie; it is never an authentication credential.
export const accountContextHeader = 'x-account-context';
export const accountContextPattern = /^[a-f0-9]{32}$/;

export function selectedSessionCookie(header: string, context: string) {
  const cookies = header.split(';').map(part => part.trim());
  for (const base of ['__Host-carer_session', 'carer_session']) {
    const name = `${base}_${context}`;
    const matches = cookies.filter(part => part.startsWith(`${name}=`));
    if (matches.length === 1) return `${base}=${matches[0].slice(name.length + 1)}`;
    if (matches.length > 1) return '';
  }
  return '';
}

export function contextualSessionCookie(cookie: string, context: string) {
  return cookie.replace(/^((?:__Host-)?carer_session)=/, `$1_${context}=`);
}
