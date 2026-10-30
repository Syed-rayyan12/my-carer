export type SitemapNode = {
  title: string;
  href: string;
  description: string;
  route?: string;
  kind?: "dynamic" | "alias";
};

export type SitemapGroup = {
  id: string;
  title: string;
  area: "website" | "dashboard";
  description: string;
  pages: SitemapNode[];
};

export const sitemapGroups: SitemapGroup[] = [
  { id: "discover", title: "Explore My Carer", area: "website", description: "Learn about the platform and discover care, people and services.", pages: [
    { title: "Home", href: "/", description: "The starting point: search for care, explore services and learn how My Carer works." },
    { title: "About", href: "/about", description: "Our story, mission and approach to trusted care." },
    { title: "Caregivers", href: "/caregivers", description: "The public caregiver directory and caregiver profile dialogs." },
    { title: "Care Seekers", href: "/care-seekers", description: "Explore care seeker listings and view their profiles." },
    { title: "Job Listing", href: "/jobs", description: "Browse care opportunities and open job details." },
    { title: "Care Technology", href: "/technology", description: "Discover care technology and explore product details." },
  ] },
  { id: "support", title: "Information & support", area: "website", description: "Plans, useful information and ways to get in touch.", pages: [
    { title: "Pricing", href: "/pricing", description: "Compare plans and explore registration options for different care roles." },
    { title: "FAQs", href: "/faqs", description: "Answers to common questions about finding and providing care." },
    { title: "Blogs", href: "/blogs", description: "Browse care articles and updates." },
    { title: "Contact", href: "/contact", description: "Find contact details and the enquiry form." },
  ] },
  { id: "legal", title: "Legal & site information", area: "website", description: "Policies and the map you are viewing now.", pages: [
    { title: "Terms & Conditions", href: "/terms", description: "Read the terms for using My Carer." },
    { title: "Privacy Policy", href: "/privacy-policy", description: "Understand the site's privacy policy." },
    { title: "Visual Sitemap", href: "/sitemap", description: "Explore all pages, follow user journeys and preview the UI structure." },
  ] },
  { id: "account", title: "Your dashboard & account", area: "dashboard", description: "The shared dashboard sidebar and header connect these pages.", pages: [
    { title: "Dashboard Overview", href: "/care-seeker-dashboard", description: "Care statistics, recommended caregivers, activity, requirements and reviews." },
    { title: "My Profile", href: "/care-seeker-dashboard/my-profile", description: "Personal information, location, about you, emergency contact and profile completion." },
    { title: "Settings", href: "/care-seeker-dashboard/settings", description: "Local account preferences and previews of account security controls." },
    { title: "Dashboard shortcut", href: "/dashboard", kind: "alias", description: "An alternative URL for the same dashboard overview." },
  ] },
  { id: "caregivers", title: "Find & save caregivers", area: "dashboard", description: "Discover people who fit your needs and keep your favourites together.", pages: [
    { title: "Find Your Caregiver", href: "/care-seeker-dashboard/find-caregivers", description: "Live search, filters, two-column caregiver cards, profile dialogs and save controls." },
    { title: "Saved Caregivers", href: "/care-seeker-dashboard/saved-caregivers", description: "Compare saved profiles, write message drafts and remove or restore favourites." },
  ] },
  { id: "requests", title: "Care requirements & responses", area: "dashboard", description: "Create a care requirement, manage it and explore caregiver responses.", pages: [
    { title: "My Care Requirements", href: "/care-seeker-dashboard/care-requirements", description: "Manage active and closed requirements, view responses and open the close confirmation." },
    { title: "Create Requirement", href: "/care-seeker-dashboard/care-requirements/create", description: "Choose care type, recipient, dates, times, hours, budget and preferences." },
    { title: "Edit Requirement", href: "/care-seeker-dashboard/care-requirements/dementia-care/edit", route: "/care-seeker-dashboard/care-requirements/[id]/edit", kind: "dynamic", description: "Edit a specific requirement. This link opens the sample Dementia Care for Mum record." },
    { title: "My Requests", href: "/care-seeker-dashboard/my-requests", description: "Filter all, active, responded and closed requests with live counts." },
    { title: "Caregiver Responses", href: "/care-seeker-dashboard/my-requests/dementia-care/responses", route: "/care-seeker-dashboard/my-requests/[id]/responses", kind: "dynamic", description: "View the selected request's caregivers, open profiles, draft messages and shortlist candidates." },
  ] },
  { id: "admin", title: "Admin workspace", area: "dashboard", description: "A separate admin overview with its own navigation, registration review and activity feed.", pages: [
    { title: "Admin Dashboard", href: "/admin-dashboard", description: "Platform statistics, recent registrations, local approval and rejection actions, account details and recent activity." },
    { title: "Admin Caregivers", href: "/admin-dashboard/caregivers", description: "Search and filter caregiver accounts, review verification and account status, and open caregiver details." },
    { title: "Admin Caregiver Account", href: "/admin-dashboard/caregivers/sarah-mitchell", route: "/admin-dashboard/caregivers/[id]", kind: "dynamic", description: "A caregiver's profile, professional details, verification documents and local account management actions." },
    { title: "Admin Subscriptions", href: "/admin-dashboard/subscriptions", description: "Revenue statistics, subscription status tabs, payment details and local refund previews." },
    { title: "Admin Settings", href: "/admin-dashboard/settings", description: "Shared account settings and security UI with separate admin preferences." },
    { title: "Admin Care Requests", href: "/admin-dashboard/care-requests", description: "Care seeker requirements with status filters and matched caregivers." },
    { title: "Admin Care Request Details", href: "/admin-dashboard/care-requests/john-smith-elderly", route: "/admin-dashboard/care-requests/[id]", kind: "dynamic", description: "View, edit, approve and remove care requests in the local preview." },
    { title: "Admin Blog", href: "/admin-dashboard/blog", description: "Search posts, filter drafts and published articles, preview or delete posts." },
    { title: "Admin Blog Editor", href: "/admin-dashboard/blog/early-signs-of-dementia", route: "/admin-dashboard/blog/[id]", kind: "dynamic", description: "Edit article content, featured images, categories and SEO fields." },
    { title: "Add Blog Post", href: "/admin-dashboard/blog/new", description: "Create a local article and save it as a draft or published post." },
    { title: "Admin Messages", href: "/admin-dashboard/messages", description: "Manage incoming messages, save local replies and drafts, archive or restore conversations." },
    { title: "Admin Reviews", href: "/admin-dashboard/reviews", description: "Review ratings and moderate pending, published and hidden reviews." },
    { title: "Admin Care Jobs", href: "/admin-dashboard/care-jobs", description: "Search and filter job listings by approval status." },
    { title: "Admin Care Job Details", href: "/admin-dashboard/care-jobs/dementia-caregiver", route: "/admin-dashboard/care-jobs/[id]", kind: "dynamic", description: "View job requirements and applicants; edit, approve or remove listings in the local preview." },
    { title: "Admin Verification", href: "/admin-dashboard/verification", description: "Review caregiver documents, approve submissions or reject with a reason." },
    { title: "Admin Care Seekers", href: "/admin-dashboard/care-seekers", description: "Search and filter care seeker accounts by location, care type and account status." },
    { title: "Admin Care Seeker Account", href: "/admin-dashboard/care-seekers/john-smith", route: "/admin-dashboard/care-seekers/[id]", kind: "dynamic", description: "Personal information, care requirements, connected caregivers and local account management actions." },
  ] },
  { id: "ongoing-care", title: "Conversations & ongoing care", area: "dashboard", description: "Keep conversations, arrangements and feedback in one place.", pages: [
    { title: "Messages", href: "/care-seeker-dashboard/messages", description: "Four conversation tabs, read states, reply dialogs, drafts, stars and archives." },
    { title: "Care Arrangements", href: "/care-seeker-dashboard/care-arrangements", description: "Upcoming, active and completed care, with a selectable details panel and local edits." },
    { title: "Reviews & Ratings", href: "/care-seeker-dashboard/reviews-ratings", description: "Review rows with reviewer details, star ratings, care types and dates." },
  ] },
];

export const siteJourneys = [
  { id: "find-care", title: "Find the right caregiver", description: "Search, compare and keep the people you want to contact.", steps: [
    { title: "Discover", description: "Browse the public directory.", href: "/caregivers" },
    { title: "Narrow it down", description: "Search and filter dashboard caregivers.", href: "/care-seeker-dashboard/find-caregivers" },
    { title: "Save favourites", description: "Compare your saved profiles.", href: "/care-seeker-dashboard/saved-caregivers" },
    { title: "Start a conversation", description: "Open a conversation and save a reply.", href: "/care-seeker-dashboard/messages" },
  ] },
  { id: "post-care", title: "Post a care requirement", description: "Describe the support you need, then review caregiver responses.", steps: [
    { title: "Create", description: "Enter care needs, times and budget.", href: "/care-seeker-dashboard/care-requirements/create" },
    { title: "Manage", description: "Review or edit your requirements.", href: "/care-seeker-dashboard/care-requirements" },
    { title: "Track responses", description: "Open a request from the list.", href: "/care-seeker-dashboard/my-requests" },
    { title: "Compare candidates", description: "View profiles and shortlist caregivers.", href: "/care-seeker-dashboard/my-requests/dementia-care/responses" },
  ] },
  { id: "manage-care", title: "Manage your care journey", description: "Keep your information up to date and manage ongoing support.", steps: [
    { title: "Complete your profile", description: "Add your personal and care information.", href: "/care-seeker-dashboard/my-profile" },
    { title: "Review arrangements", description: "Select a care arrangement to see details.", href: "/care-seeker-dashboard/care-arrangements" },
    { title: "Read feedback", description: "Explore ratings and care experiences.", href: "/care-seeker-dashboard/reviews-ratings" },
    { title: "Manage preferences", description: "Save local account preferences.", href: "/care-seeker-dashboard/settings" },
  ] },
];

export const siteDialogs = [
  { title: "Caregiver profile", parent: "Find Caregivers", href: "/care-seeker-dashboard/find-caregivers", action: "Choose View Profile on a caregiver card." },
  { title: "Close requirement", parent: "My Care Requirements", href: "/care-seeker-dashboard/care-requirements", action: "Choose Close Requirement, then confirm or cancel." },
  { title: "Reply to a message", parent: "Messages", href: "/care-seeker-dashboard/messages", action: "Choose Reply to open the conversation and composer." },
  { title: "Manage arrangement", parent: "Care Arrangements", href: "/care-seeker-dashboard/care-arrangements", action: "Select an arrangement, then choose Manage Arrangement." },
  { title: "Account security", parent: "Settings", href: "/care-seeker-dashboard/settings", action: "Choose Enable or Delete My Account to open the relevant preview." },
  { title: "Registration forms", parent: "Pricing", href: "/pricing", action: "Choose the registration action for your care role." },
];
