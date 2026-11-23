import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import WebsiteAccountActions from '../../components/shared/WebsiteAccountActions';
import PublicListingDetails from '../../components/platform/PublicListingDetails';
import type { AuthSession } from '../../components/auth/auth-client';
import CaregiverProfileModal from '../../components/website/CaregiverProfileModal';
import { listingCaregiverProfile } from '../../components/platform/listing-caregiver-profile';

const session = (role: AuthSession['user']['role'], name: string, profileComplete = true): AuthSession => ({
  user: { id: name, firstName: name, lastName: 'Test', email: `${name}@example.test`, role, status: 'ACTIVE', profileComplete }, csrfToken: 'test-csrf',
});
const header = (account: AuthSession | null, mobile = false, ready = true) => renderToStaticMarkup(createElement(WebsiteAccountActions, {
  session: account, ready, error: '', mobile, onNavigate: () => {}, onRegister: () => {},
}));
describe('public website account navigation', () => {
  it('renders all professional profile sections rather than the old summary-only popup', () => {
    const profile = listingCaregiverProfile({ id: 'preview', firstName: 'Full', lastName: 'Carer', professional: { bio: 'Professional introduction', location: 'York', hourlyRatePence: 2200, qualifications: 'NVQ Level 3', services: 'Companionship' } });
    const html = renderToStaticMarkup(createElement(CaregiverProfileModal, { open: true, profile, onClose: () => {}, onContact: () => {}, onFavouriteChange: () => {} }));
    for (const section of ['Full Carer', 'Professional introduction', 'Care services', 'Experience', 'Qualifications', 'NVQ Level 3', 'Availability', 'References', 'Reviews', 'Contact caregiver', 'Save caregiver']) expect(html).toContain(section);
    expect(html).not.toContain('4.8');
    expect(html).not.toContain('26 Reviews');
  });
  it('keeps seeker and caregiver dashboard links tied to their respective tab identities', () => {
    const seeker = header(session('CARE_SEEKER', 'Seeker'));
    const caregiver = header(session('CAREGIVER', 'Carer'), true);
    expect(seeker).toContain('href="/care-seeker-dashboard"');
    expect(seeker).toContain('Seeker');
    expect(caregiver).toContain('href="/caregiver-dashboard"');
    expect(caregiver).toContain('Carer');
    for (const html of [seeker, caregiver]) {
      expect(html).toContain('Sign out');
      expect(html).not.toContain('href="/signin"');
      expect(html).not.toContain('Register Today');
    }
  });
  it('routes admin and incomplete profiles to their correct destinations', () => {
    expect(header(session('ADMIN', 'Admin'))).toContain('href="/admin-dashboard"');
    expect(header(session('CARE_SEEKER', 'Incomplete', false))).toContain('href="/care-seeker-dashboard/my-profile"');
  });
  it('offers sign-in only to confirmed guests and avoids a sign-in flash while checking', () => {
    expect(header(null)).toContain('href="/signin"');
    expect(header(null)).toContain('Register Today');
    expect(header(null, false, false)).not.toContain('href="/signin"');
  });
  it('renders caregiver details for a signed-in seeker with a dashboard continuation', () => {
    const html = renderToStaticMarkup(createElement(PublicListingDetails, {
      item: { id: 'listing', firstName: 'Real', lastName: 'Carer', professional: { bio: 'Care experience', location: 'York', qualifications: 'NVQ', hourlyRatePence: 1500, services: 'Companionship' } },
      caregivers: true, session: session('CARE_SEEKER', 'Seeker'), checking: false, onClose: () => {},
    }));
    expect(html).toContain('Real Carer');
    expect(html).toContain('Care experience');
    expect(html).toContain('href="/care-seeker-dashboard/find-caregivers"');
    expect(html).not.toContain('href="/signin"');
  });
  it('keeps a logged-in caregiver on the care-job flow rather than sign-in', () => {
    const html = renderToStaticMarkup(createElement(PublicListingDetails, {
      item: { id: 'job', title: 'Evening care', location: 'York', budgetPence: 1800 },
      caregivers: false, session: session('CAREGIVER', 'Carer'), checking: false, onClose: () => {},
    }));
    expect(html).toContain('Evening care');
    expect(html).toContain('href="/caregiver-dashboard/find-care-jobs"');
    expect(html).not.toContain('href="/signin"');
  });
});
