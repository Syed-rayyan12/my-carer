import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { HomeCaregiverCard } from '../../components/website/HomeCaregiverCards';
import PublishedBlogCard from '../../components/website/PublishedBlogCard';
import { getDirectory } from '../src/modules/caregivers/caregivers.public.service.js';
import * as repository from '../src/modules/caregivers/caregivers.public.repository.js';
vi.mock('../src/modules/caregivers/caregivers.public.repository.js', () => ({ findManyUser: vi.fn() }));
const record = (id: string, featured: boolean) => ({
  id, firstName: id, lastName: 'Carer', role: 'CAREGIVER',
  membership: { status: 'ACTIVE', pricePence: 0, trialEndsAt: null, paidThrough: null, plan: { entitlements: { featured, bio: true, specialismsLimit: null } } },
  professional: { bio: 'Saved introduction', location: 'York', hourlyRatePence: 2200, qualifications: '', services: 'Companionship', details: {} }, verifications: [],
});
describe('homepage database content', () => {
  it('requests only the latest three active caregivers without featured reordering', async () => {
    vi.mocked(repository.findManyUser).mockResolvedValue([record('Newest', false), record('Older', true)] as never);
    const result = await getDirectory({ params: {}, query: { order: 'latest', limit: '3' }, body: undefined });
    expect(repository.findManyUser).toHaveBeenCalledWith(expect.objectContaining({ take: 3, where: expect.objectContaining({ status: 'ACTIVE', role: 'CAREGIVER' }), orderBy: [{ createdAt: 'desc' }, { id: 'desc' }] }));
    expect(result.body.data.map(row => row.id)).toEqual(['Newest', 'Older']);
  });
  it('keeps featured ordering as the default for the full directory', async () => {
    const result = await getDirectory({ params: {}, query: {}, body: undefined });
    expect(result.body.data.map(row => row.id)).toEqual(['Older', 'Newest']);
  });
  it('renders saved caregiver information without invented ratings or verification', () => {
    const html = renderToStaticMarkup(createElement(HomeCaregiverCard, { caregiver: { id: 'caregiver', firstName: 'Latest', lastName: 'Carer', professional: { bio: 'Actual bio', location: 'York', hourlyRatePence: 2200, qualifications: '', services: 'Companionship' }, verifications: [] }, onView: () => {} }));
    expect(html).toContain('Latest Carer'); expect(html).toContain('Actual bio'); expect(html).toContain('York');
    const text = html.replace(/<[^>]*>/g, '');
    expect(text).not.toContain('Sarah Mitchell'); expect(text).not.toContain('DBS verified'); expect(text).not.toContain('4.9');
  });
  it('links published blog cards to the real article and renders their saved copy', () => {
    const html = renderToStaticMarkup(createElement(PublishedBlogCard, { post: { id: 'published-article', title: 'A saved article', description: 'Description from the database', category: 'Care advice', date: '22 Nov 2026', author: 'Admin', content: 'Saved content', image: '', status: 'Published', seoTitle: '', metaDescription: '' } }));
    expect(html).toContain('href="/blogs/published-article"'); expect(html).toContain('A saved article'); expect(html).toContain('Description from the database');
    expect(html).not.toContain('long established fact'); expect(html).not.toContain('#article');
  });
});
