import type { CaregiverProfile } from '@/components/website/CaregiverProfileModal';
import type { PublicListing } from './PublicListingDetails';
export function listingCaregiverProfile(item: PublicListing): CaregiverProfile {
  const p = item.professional;
  return { id: item.id, name: `${item.firstName ?? ''} ${item.lastName ?? ''}`.trim(), desc: p?.services || 'Caregiver', image: item.photo ?? '', location: p?.location ?? '', gender: '',
    hourlyRate: new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format((p?.hourlyRatePence ?? 0) / 100),
    rating: 0, reviewCount: 0, email: '', phone: '', about: p?.bio ?? '', specializations: p?.services.split(/[,\n]/).filter(Boolean) ?? [], experience: '', availability: [],
    qualifications: p?.qualifications.split('\n').filter(Boolean).map(title => ({ title, provider: '', date: '' })) ?? [], references: [],
    verification: { certificateNumber: '', lastChecked: '', expires: '' },
  };
}
