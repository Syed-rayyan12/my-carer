# Complete caregiver profile views

Public caregiver cards, seeker Find/Saved Caregivers, responses, arrangements and overview popups now use the same full profile modal. Caregiver My Profile preview, Profile Preview and Preview as Care Seeker use that same renderer. The modal loads fresh saved data from `GET /api/v1/platform/directory/:id` when opened rather than relying on a card's summary payload.

The endpoint exposes active caregivers only and preserves membership/trial entitlements. Saved Pro data includes photo, biography, hourly/mileage rates, travel radius, experience and work history, visible services and descriptions, qualification institution/year, weekly slots, minimum visit, time-off dates, reference names/relationships, approved verification kinds and visible reviews/responses. Missing values are shown as missing rather than replaced with demo values. Paid membership does not create verification approval.

Raw professional JSON, account email/phone/address/date of birth, reference email/phone, certificate URLs, time-off reasons and service reference notes are not returned. Expired membership removes gated historical fields. Inactive/missing profiles return 404; malformed IDs return 400.

Root causes fixed: the old modal had most detail sections commented out; public directory selects omitted experience/availability; dashboard mapping discarded the photo; structured qualifications, schedule and history never reached the view. Old owner-preview hard-coded rates/review totals were removed.

Verification: `npm run test:flow`, `npm run build`, backend lint/build and `node .tools/verify-http.cjs`. Four real-database regression tests cover complete Pro data, both directory lists, private-data filtering, inactive profiles and expiry. The UI suite includes rendered profile-section coverage. A read-only local API check confirmed the existing caregiver's saved history, qualification, weekly schedule, reference and service detail were returned. No account package, profile values or password were changed as part of this fix.

Manual check: save Pro profile changes, then reopen View Profile from public Caregivers, seeker Find/Saved Caregivers and response/arrangement views. Compare against the caregiver's own preview. Reopen after another edit to confirm the modal fetches the latest values. Verification and reviews require actual approved/published records.
