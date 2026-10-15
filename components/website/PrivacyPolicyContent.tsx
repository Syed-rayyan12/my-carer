import LegalDocument, { type LegalBlock, type LegalSection } from "@/components/website/LegalDocument";

const p = (...texts: string[]): LegalBlock[] => texts.map((text) => ({ type: "paragraph", text }));
const bullets = (...items: string[]): LegalBlock => ({ type: "list", items });
const sections: LegalSection[] = [
  { title: "1. Who We Are", blocks: p(
    "My Carer operates an online platform that connects people looking for care with caregivers and care professionals.",
    "The platform may also provide care job listings, care technology listings, supplier profiles, resources and related services.",
    "For data protection purposes, the organisation responsible for your personal information is:",
    "My Carer",
    "Shawbriggs, Barrow Road",
    "Goxhill, North Lincolnshire",
    "DN19 7LN",
    "Email: hello@my-carer.co.uk",
    "Support: support@my-carer.co.uk",
    "Phone: 01482 688508",
    "Data Controller: [Insert Legal Company Name]",
    "Company Registration Number: [Insert Number]",
    "Data Protection Contact: [Insert Email Address]"
  ) },
  { title: "2. Information We Collect", blocks: [
    ...p("Depending on how you use My Carer, we may collect different types of information.", "Information You Provide", "When you register or use our services, we may collect:"),
    bullets("Full name", "Email address", "Telephone number", "Address or general location", "Postcode", "Date of birth where required", "Account login information", "Profile photograph", "Profile information", "Professional experience", "Qualifications", "Specialisations", "Availability", "Hourly rates", "References", "Reviews and ratings", "Care requirements", "Job listing information", "Supplier and business information", "Information submitted through contact forms", "Information you provide when communicating with us")
  ] },
  { title: "3. Caregiver Information", blocks: [
    ...p("If you register as a caregiver, your profile may contain professional information such as:"),
    bullets("Experience", "Qualifications", "Training", "Care specialisations", "Services offered", "Availability", "Rates", "References", "Reviews", "DBS/CRB verification information where applicable", "Profile photograph", "General location"),
    ...p("Some information may be displayed publicly or to registered users depending on the Platform’s settings.", "You should only provide information that you are comfortable sharing and that is necessary for your profile.")
  ] },
  { title: "4. Care Seeker Information", blocks: [
    ...p("If you use My Carer to find care, we may collect information about:"),
    bullets("Your preferred location", "Type of care required", "Care preferences", "Availability requirements", "General information about the support required", "Communication preferences", "Information submitted through enquiries or job listings"),
    ...p("Please avoid providing unnecessary medical or highly sensitive information through public profile fields.", "Where information relating to health or other special categories of personal data is required, we will handle it in accordance with applicable data protection law.")
  ] },
  { title: "5. Information We Collect Automatically", blocks: [
    ...p("When you visit our website, we may automatically collect certain technical information, including:"),
    bullets("IP address", "Browser type", "Device type", "Operating system", "Pages visited", "Time spent on pages", "Referring website", "Website interactions", "Approximate location", "Technical and diagnostic information"),
    ...p("This information helps us operate, secure and improve the website.")
  ] },
  { title: "6. Cookies", blocks: [
    ...p("My Carer may use cookies and similar technologies.", "Cookies may be used to:"),
    bullets("Keep the website functioning properly", "Remember preferences", "Keep users signed in", "Understand how visitors use the website", "Improve website performance", "Measure marketing effectiveness", "Provide relevant functionality"),
    ...p("Where required by law, we will request your consent before placing non-essential cookies on your device.", "You can manage cookie preferences through our cookie settings or your browser settings."),
    { type: "link", label: "Cookie Policy →", href: "#" }
  ] },
  { title: "7. How We Use Your Information", blocks: [
    ...p("We may use personal information to:"),
    bullets("Create and manage your account", "Provide access to the Platform", "Display your caregiver or supplier profile", "Help care seekers find suitable caregivers", "Help caregivers discover relevant care opportunities", "Process subscriptions and payments", "Respond to enquiries", "Communicate with you", "Provide customer support", "Verify information where applicable", "Maintain Platform security", "Detect fraud or misuse", "Improve our services", "Analyse Platform usage", "Send service-related communications", "Send marketing communications where permitted", "Comply with legal and regulatory obligations", "Protect the rights, safety and security of our users and business")
  ] },
  { title: "8. Legal Basis for Processing", blocks: [
    ...p("Where UK data protection law applies, we process personal information using appropriate lawful bases.", "These may include:", "Contract", "Where processing is necessary to provide the services you have requested or to manage your account.", "Legitimate Interests", "Where processing is necessary for legitimate business purposes, such as improving the Platform, maintaining security or preventing fraud, while considering your rights and interests.", "Consent", "Where we ask for your consent, such as for certain marketing communications or non-essential cookies.", "You can withdraw consent where processing is based on consent.", "Legal Obligation", "Where we need to process information to comply with a legal or regulatory requirement.")
  ] },
  { title: "9. Special Category Data", blocks: p(
    "Some care-related information may reveal information about a person’s health or other sensitive characteristics.",
    "This type of information may be considered special category data under UK data protection law.",
    "We will only process special category information where there is an appropriate legal basis and additional condition under applicable data protection legislation.",
    "Users should avoid including unnecessary sensitive information in public profiles, reviews, job listings or messages.",
    "Where possible, only provide the minimum information needed to arrange or discuss care."
  ) },
  { title: "10. Public Profiles and User Content", blocks: [
    ...p("Some information submitted to My Carer may be displayed to other users or publicly, depending on the Platform’s functionality and privacy settings.", "This may include:"),
    bullets("Name", "Profile photograph", "General location", "Professional experience", "Qualifications", "Specialisations", "Services", "Availability", "Rates", "Reviews", "References", "Supplier information"),
    ...p("Please consider carefully what information you choose to publish.", "Do not publish another person’s personal information without having the appropriate permission or lawful basis.")
  ] },
  { title: "11. Reviews and References", blocks: p(
    "Reviews and references may be displayed on caregiver profiles.",
    "We may collect information about the person submitting the review or reference in order to maintain the integrity of the Platform and prevent fraudulent activity.",
    "We may remove or restrict reviews where we reasonably believe they are fraudulent, misleading, abusive or otherwise breach our Terms & Conditions."
  ) },
  { title: "12. DBS/CRB and Verification Information", blocks: p(
    "Where caregiver verification is offered, we may collect information relating to DBS/CRB checks or other verification processes.",
    "The type of information collected and displayed will depend on the verification process used by My Carer.",
    "We will only process verification information where there is an appropriate lawful basis and where required, an additional legal condition for processing.",
    "A verification badge does not constitute a guarantee or endorsement of a caregiver."
  ) },
  { title: "13. Job Listings", blocks: [
    ...p("If you post or apply for a care job through My Carer, information connected with the listing or application may be processed.", "This may include:"),
    bullets("Job requirements", "Location", "Care type", "Working hours", "Pay information", "Application information", "Messages", "Relevant profile information"),
    ...p("Information may be shared with the relevant parties to facilitate the opportunity.")
  ] },
  { title: "14. Care Technology Suppliers", blocks: [
    ...p("If you register as a care technology supplier, we may collect:"),
    bullets("Business name", "Contact person’s name", "Business email", "Telephone number", "Business address", "Website", "Product information", "Product images", "Supplier profile information", "Payment and subscription information"),
    ...p("Supplier and product information may be displayed publicly on the Platform.")
  ] },
  { title: "15. Payments", blocks: [
    ...p("Where My Carer offers paid subscriptions or other paid services, payments may be processed by third-party payment providers.", "We may receive information such as:"),
    bullets("Transaction reference", "Payment status", "Subscription type", "Billing information", "Limited payment information"),
    ...p("We do not normally store complete payment card details ourselves where payments are processed securely by a third-party payment provider.", "The relevant payment provider’s privacy policy may also apply.")
  ] },
  { title: "16. Who We Share Information With", blocks: [
    ...p("We may share personal information where necessary with:"),
    bullets("Caregivers", "Care seekers", "Other registered users where relevant", "Service providers", "Payment processors", "Website hosting providers", "IT and software providers", "Email and communication providers", "Analytics providers", "Verification providers", "Professional advisers", "Regulators or authorities where legally required"),
    ...p("We only share information where there is an appropriate reason and lawful basis.", "We do not sell personal information to third parties for their own independent marketing purposes.")
  ] },
  { title: "17. Service Providers", blocks: [
    ...p("We may use trusted third-party service providers to help operate the Platform.", "These providers may support:"),
    bullets("Website hosting", "Cloud storage", "Payments", "Email", "Security", "Analytics", "Customer support", "Identity or verification services", "Website maintenance"),
    ...p("Where appropriate, we require service providers to protect personal information and only process it according to our instructions.")
  ] },
  { title: "18. International Transfers", blocks: p(
    "Some of our service providers may process information outside the UK.",
    "Where personal information is transferred internationally, we will take appropriate steps to ensure that the transfer is carried out in accordance with applicable data protection law.",
    "This may include using appropriate contractual safeguards or relying on an adequacy decision where applicable."
  ) },
  { title: "19. How Long We Keep Your Information", blocks: [
    ...p("We retain personal information only for as long as reasonably necessary for the purposes for which it was collected.", "Retention periods may depend on:"),
    bullets("The type of information", "Why it was collected", "Whether you maintain an account", "Legal requirements", "Accounting requirements", "Dispute resolution", "Fraud prevention", "Regulatory obligations"),
    ...p("When information is no longer required, we will securely delete or anonymise it where appropriate.")
  ] },
  { title: "20. Account Deletion", blocks: [
    ...p("You may request deletion of your My Carer account and personal information.", "Some information may need to be retained where we have a legal obligation or legitimate reason to do so, such as:"),
    bullets("Financial records", "Fraud prevention information", "Legal claims", "Regulatory requirements", "Records required to establish or defend legal rights"),
    ...p("Where information cannot be deleted immediately, we will explain why where appropriate.")
  ] },
  { title: "21. Your Data Protection Rights", blocks: p(
    "Depending on the circumstances and applicable law, you may have rights including:",
    "Right to Access",
    "You can request a copy of personal information we hold about you.",
    "Right to Rectification",
    "You can ask us to correct inaccurate or incomplete information.",
    "Right to Erasure",
    "You may ask us to delete personal information in certain circumstances.",
    "Right to Restrict Processing",
    "You may ask us to restrict how we use your information in certain circumstances.",
    "Right to Object",
    "You may object to certain processing, including some processing based on legitimate interests.",
    "Right to Data Portability",
    "In certain circumstances, you may request your information in a structured, commonly used and machine-readable format.",
    "Rights Relating to Automated Decision-Making",
    "Where applicable, you may have rights relating to automated decision-making and profiling.",
    "These rights are not absolute and may be subject to legal exceptions."
  ) },
  { title: "22. Marketing Communications", blocks: [
    ...p("We may send you service-related communications that are necessary to operate your account.", "Where required, we will ask for consent before sending marketing communications.", "You can unsubscribe from marketing emails at any time by:"),
    bullets("Clicking the unsubscribe link in the email", "Updating your communication preferences", "Contacting us directly"),
    ...p("Unsubscribing from marketing communications will not necessarily stop essential service or account communications.")
  ] },
  { title: "23. Data Security", blocks: [
    ...p("We take reasonable technical and organisational measures to protect personal information against:"),
    bullets("Unauthorised access", "Loss", "Misuse", "Alteration", "Disclosure", "Destruction"),
    ...p("However, no online system can be guaranteed to be completely secure.", "You should use a strong password and keep your account credentials confidential.")
  ] },
  { title: "24. Children’s Privacy", blocks: p(
    "My Carer is not intended to be used by children to create independent accounts unless expressly permitted by the Platform.",
    "If you believe a child has provided personal information to us without appropriate consent, please contact us so we can investigate and take appropriate action."
  ) },
  { title: "25. Third-Party Websites", blocks: p(
    "Our website may contain links to third-party websites and services.",
    "We are not responsible for the privacy practices, content or security of third-party websites.",
    "You should review their privacy policies before providing personal information."
  ) },
  { title: "26. Changes to This Privacy Policy", blocks: [
    ...p("We may update this Privacy Policy from time to time.", "Changes may be made to reflect:"),
    bullets("Changes to our services", "Changes in technology", "Changes in legal requirements", "Changes in how we process personal information", "Improvements to our privacy practices"),
    ...p("The latest version will always be published on this page.", "Where required, we will notify you of significant changes.")
  ] },
  { title: "27. Complaints", blocks: p(
    "If you have concerns about how we handle your personal information, please contact us first.",
    "My Carer",
    "Shawbriggs, Barrow Road",
    "Goxhill, North Lincolnshire",
    "DN19 7LN",
    "Email: privacy@my-carer.co.uk",
    "Support: support@my-carer.co.uk",
    "Phone: 01482 688508",
    "We will investigate your concern and try to resolve it."
  ) },
  { title: "28. Information Commissioner’s Office", blocks: [
    ...p("If you are unhappy with how we have handled your personal information, you may also have the right to complain to the Information Commissioner’s Office (ICO), the UK’s independent data protection regulator.", "You can find information about your rights and how to make a complaint on the ICO website."),
    { type: "link", label: "ICO →", href: "https://ico.org.uk" }
  ] },
  { title: "29. Contact Us About Privacy", blocks: [
    ...p(
      "If you have any questions about this Privacy Policy or how My Carer handles personal information, please contact our privacy team.",
      "Email: privacy@my-carer.co.uk",
      "My Carer",
      "Shawbriggs, Barrow Road",
      "Goxhill, North Lincolnshire",
      "DN19 7LN",
      "Phone: 01482 688508",
      "Related Policies"
    ),
    { type: "link", label: "Terms & Conditions →", href: "/terms", description: "Read the rules governing use of the My Carer Platform." },
    { type: "link", label: "Cookie Policy →", href: "#", description: "Learn how cookies and similar technologies are used." },
    { type: "link", label: "Contact Us →", href: "/contact", description: "Get in touch with the My Carer team." }
  ] }
];

export default function PrivacyPolicyContent() {
  return <LegalDocument sections={sections} />;
}
