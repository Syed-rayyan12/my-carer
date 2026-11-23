# Homepage caregivers and published blogs

The homepage caregiver section requests `/platform/directory?order=latest&limit=3`. The database selects active caregiver accounts by creation time, newest first. This explicit latest order does not get reordered by featured membership; the main directory retains its existing featured behavior. Cards use saved rates, location, specialisms and photo, with initials when no photo exists. A DBS badge requires approved DBS evidence. View Profile opens the shared full profile modal.

The homepage/about journal section requests the latest three published blogs. `/blogs` lists published articles; `/blogs/:id` displays the saved article with the same shared website banner. Cards and article banners use saved titles, descriptions, categories and images. Drafts stay private. Returning focus to a homepage/blog tab refreshes the content. Blog links are available in the Platform menu, mobile navigation, footer and homepage View all articles button.

Create or edit posts at `/admin-dashboard/blog`; choose Published to make them public. No sample caregiver or article records are inserted by this flow.

Scoped verification on 23 November 2026: four tests in `tests/home-content.spec.ts`, affected-file ESLint and live HTTP checks only. No full application suite or production build was run for this change. Homepage, blog listing and the existing published article returned HTTP 200. The public API returned the existing caregiver and the user's published article.

Run only this flow's tests from backend: `node node_modules/vitest/vitest.mjs run --config vitest.home.config.ts`.
