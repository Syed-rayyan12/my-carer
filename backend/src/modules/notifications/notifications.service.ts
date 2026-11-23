import type { Notification } from './notifications.types.js';
import * as repository from './notifications.repository.js';
import { ApiError } from '../../utils/ApiError.js';
export async function list(userId: string, role: string): Promise<Notification[]> {
  const prefix = role === 'CAREGIVER' ? '/caregiver-dashboard' : role === 'ADMIN' ? '/admin-dashboard' : '/care-seeker-dashboard';
  const [messages, applications, reviews, decisions, saved] = await Promise.all([
    repository.recentMessages(userId), repository.recentApplications(userId, role),
    repository.recentReviews(userId, role), repository.accountDecisions(userId), repository.states(userId),
  ]);
  const items: Notification[] = [];
  const add = (id: string, title: string, kind: Notification['kind'], time: Date, href: string) => {
    const state = saved.find(s => s.eventId === id);
    items.push({ id, title, kind, time, href, read: state?.read ?? false, dismissed: state?.dismissed ?? false });
  };
  messages.forEach(m => add('message-' + m.id, m.sender.firstName + ' sent you a message', 'message', m.createdAt, prefix + '/messages'));
  applications.forEach(a => add('application-' + a.id + '-' + a.status,
    role === 'CARE_SEEKER' ? a.caregiver.firstName + ' responded to ' + a.request.title + ': ' + a.status.toLowerCase()
      : 'Care offer for ' + a.request.title + ': ' + a.status.toLowerCase(), 'job', a.createdAt,
    role === 'CARE_SEEKER' ? prefix + '/my-requests/' + a.requestId + '/responses' : role === 'CAREGIVER' ? prefix + '/my-applications' : prefix + '/care-requests/' + a.requestId));
  reviews.forEach(r => add('review-' + r.id + '-' + r.visible + '-' + !!r.response,
    'Care review: ' + r.rating + '/5' + (r.response ? ' ? response added' : ''), 'review', r.createdAt,
    prefix + (role === 'ADMIN' ? '/reviews' : '/reviews-ratings')));
  decisions.forEach(d => add('account-' + d.id, 'Account status: ' + d.toStatus.toLowerCase(), 'account', d.createdAt, prefix));
  if (role === 'CAREGIVER') (await repository.recentVerifications(userId)).forEach(v =>
    add('verification-' + v.id + '-' + v.status, v.kind + ' verification: ' + v.status.toLowerCase(), 'verified', v.createdAt, prefix + '/verification'));
  if (role === 'ADMIN') {
    const [registrations, verifications] = await Promise.all([repository.recentRegistrations(), repository.pendingVerifications()]);
    registrations.forEach(u => add('registration-' + u.id, u.firstName + ' ' + u.lastName + ' registered', 'registration', u.createdAt, prefix));
    verifications.forEach(v => add('verification-' + v.id + '-PENDING', v.kind + ' document awaiting review', 'verified', v.createdAt, prefix + '/verification'));
  }
  return items.sort((a,b) => b.time.getTime() - a.time.getTime()).slice(0, 300);
}
export async function update(userId: string, role: string, input: { id?: string; action: 'read' | 'unread' | 'dismiss' | 'restore' | 'read-all' }) {
  const items = await list(userId, role);
  const selected = input.action === 'read-all' ? items.filter(n => !n.dismissed) : items.filter(n => n.id === input.id);
  if (input.action !== 'read-all' && !selected.length) throw new ApiError(404, 'Notification not found');
  await repository.saveStates(userId, selected.map(n => n.id), input.action === 'dismiss' ? { dismissed: true }
    : input.action === 'restore' ? { dismissed: false } : { read: input.action !== 'unread' });
}
