import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as repository from '../src/modules/account/account.repository.js';
import { getProfile, saveProfile } from '../src/modules/account/account.service.js';
import { profileSchema } from '../src/modules/account/account.validation.js';

vi.mock('../src/modules/account/account.repository.js', () => ({
  findUserById: vi.fn(), updateSeekerProfile: vi.fn(), getAccountAccess: vi.fn(),
}));
const user = {
  id: 'own-user', role: 'CARE_SEEKER', firstName: 'Test', lastName: 'User',
  email: 'login@example.test', profile: null,
};
beforeEach(() => vi.mocked(repository.findUserById).mockResolvedValue(user));

describe('account profile regression', () => {
  it('returns editable defaults without database identifiers', async () => {
    const profile = await getProfile(user.id);
    expect(profile).toMatchObject({ email: user.email, accountEmail: user.email,
      phone: '', dateOfBirth: '', language: 'English (UK)', profileComplete: false });
    expect(profile).not.toHaveProperty('id');
    expect(profile).not.toHaveProperty('userId');
  });
  it('returns 404 for a missing account', async () => {
    vi.mocked(repository.findUserById).mockResolvedValue(null);
    await expect(getProfile('missing')).rejects.toMatchObject({ statusCode: 404 });
  });
  it('saves contact details and UTC birth date without replacing sign-in email', async () => {
    const defaults = await getProfile(user.id);
    const { accountEmail, profileComplete, ...editable } = defaults;
    expect(accountEmail).toBe(user.email);
    expect(profileComplete).toBe(false);
    const input = profileSchema.parse({ ...editable, email: 'contact@example.test',
      dateOfBirth: '1990-02-03' });
    await saveProfile(user.id, input);
    expect(repository.updateSeekerProfile).toHaveBeenCalledWith(user.id,
      { firstName: 'Test', lastName: 'User' }, expect.objectContaining({
        contactEmail: 'contact@example.test', dateOfBirth: new Date('1990-02-03T00:00:00Z'),
      }));
    const changes = vi.mocked(repository.updateSeekerProfile).mock.calls[0]!;
    expect(changes[1]).not.toHaveProperty('email');
    expect(changes[2]).not.toHaveProperty('email');
  });
  it('rejects impossible dates and attempts to target another account', async () => {
    const { accountEmail, profileComplete, ...editable } = await getProfile(user.id);
    expect(accountEmail).toBe(user.email);
    expect(profileComplete).toBe(false);
    expect(profileSchema.safeParse({ ...editable, dateOfBirth: '2020-02-30' }).success).toBe(false);
    expect(profileSchema.safeParse({ ...editable, userId: 'other' }).success).toBe(false);
  });
});
