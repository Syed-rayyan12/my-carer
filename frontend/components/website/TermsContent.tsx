import LegalDocument, { type LegalBlock, type LegalSection } from "@/components/website/LegalDocument";

const p = (...texts: string[]): LegalBlock[] => texts.map((text) => ({ type: "paragraph", text }));
const bullets = (...items: string[]): LegalBlock => ({ type: "list", items });

const sections: LegalSection[] = [
  { title: "1. About My Carer", blocks: p(
    "My Carer is an online platform designed to connect people looking for care with caregivers and care professionals.",
    "The platform may also provide access to care-related job opportunities, care technology products and supplier listings.",
    "My Carer is a platform and does not itself provide personal care, nursing, medical treatment or other regulated care services unless expressly stated otherwise.",
    "Care arrangements made between users are generally between the relevant care seeker and caregiver or other service provider."
  ) },
  { title: "2. Definitions", blocks: [
    ...p("In these Terms:"),
    bullets(
      "“My Carer”, “we”, “us” or “our” means My Carer and its platform operator.",
      "“Platform” means the My Carer website, user accounts, profiles, search tools, messaging features and related services.",
      "“User”, “you” or “your” means anyone accessing or using the Platform.",
      "“Caregiver” means an individual or professional offering care or support services through the Platform.",
      "“Care Seeker” means an individual, family or organisation looking for care or support.",
      "“Supplier” means a business or organisation listing care technology or related products through the Platform.",
      "“Content” means information, text, photographs, reviews, profiles, listings and other material submitted to the Platform."
    )
  ] },
  { title: "3. Eligibility", blocks: p(
    "You must provide accurate information when creating an account or using the Platform.",
    "You must be legally capable of entering into an agreement under applicable law.",
    "Where a User is acting on behalf of another person, family, organisation or business, they confirm that they have the necessary authority to do so.",
    "We may request additional information where reasonably necessary to verify an account or comply with legal requirements."
  ) },
  { title: "4. Creating an Account", blocks: [
    ...p("Some Platform features may require you to create an account.", "You agree to:"),
    bullets("Provide accurate and current information.", "Keep your account information up to date.", "Keep your login details confidential.", "Not allow another person to use your account.", "Notify us if you believe your account has been compromised.", "Use the Platform only for lawful purposes."),
    ...p(
      "You are responsible for activity carried out through your account unless you can demonstrate that the activity was unauthorised and that you took reasonable steps to protect your account.",
      "We reserve the right to suspend or restrict accounts where we reasonably believe these Terms have been breached."
    )
  ] },
  { title: "5. Caregiver Profiles", blocks: [
    ...p("Caregivers may create profiles containing information such as:"),
    bullets("Name and profile information", "Experience", "Qualifications", "Specialisations", "Services offered", "Availability", "Rates", "References", "Reviews", "DBS/CRB information where applicable"),
    ...p(
      "Caregivers are responsible for ensuring that the information they provide is accurate, current and not misleading.",
      "Caregivers must not claim qualifications, experience, registrations or certifications that they do not hold.",
      "Where applicable, caregivers should maintain any legally required checks, registrations, qualifications, insurance and permissions necessary to provide their services."
    )
  ] },
  { title: "6. Verification and DBS/CRB Information", blocks: p(
    "Where My Carer offers or displays verification information, this is intended to help Users make informed decisions.",
    "Verification does not constitute an endorsement, guarantee or recommendation of a caregiver.",
    "A verification badge does not mean that My Carer guarantees the quality, suitability, safety or performance of a caregiver.",
    "Users should carry out their own appropriate checks before entering into a care arrangement.",
    "Caregivers remain responsible for ensuring that all information supplied to My Carer is genuine and up to date."
  ) },
  { title: "7. Care Seeker Responsibilities", blocks: [
    ...p("Care Seekers are responsible for providing accurate information about their care requirements.", "When choosing a caregiver, Care Seekers should consider relevant factors including:"),
    bullets("Qualifications", "Experience", "References", "DBS/CRB information where applicable", "Skills and specialisations", "Availability", "Rates", "Suitability for the individual’s specific needs"),
    ...p("Care Seekers should communicate their requirements clearly and make their own decision about whether a caregiver is suitable.")
  ] },
  { title: "8. Care Arrangements", blocks: [
    ...p(
      "My Carer provides a platform for Users to discover and connect with one another.",
      "Unless expressly stated otherwise, My Carer is not a party to the care arrangement between a Care Seeker and a Caregiver.",
      "The parties are responsible for agreeing the details of their own arrangement, including:"
    ),
    bullets("Services", "Working hours", "Rates", "Payment arrangements", "Location", "Duties and responsibilities", "Cancellation arrangements", "Any other relevant terms"),
    ...p("Users should ensure that any arrangement complies with applicable laws and regulations.")
  ] },
  { title: "9. Care Jobs", blocks: [
    ...p("Caregivers and Care Seekers may use the Platform to advertise or discover care opportunities.", "Job listings should contain accurate information about the role, including where relevant:"),
    bullets("Location", "Type of care", "Working hours", "Pay or rate", "Experience requirements", "Qualifications", "Responsibilities", "Other relevant requirements"),
    ...p(
      "My Carer does not guarantee that a job listing will remain available or that an application will result in employment or engagement.",
      "Any employment or service relationship formed following a job listing is between the relevant parties unless otherwise expressly agreed."
    )
  ] },
  { title: "10. Care Technology Listings", blocks: p(
    "My Carer may allow suppliers to list care technology, equipment or related products.",
    "Product information, specifications, prices, availability and other details may be provided by third-party suppliers.",
    "Users should review product information carefully and contact the relevant supplier where further information is required.",
    "Unless expressly stated otherwise, My Carer does not manufacture, supply or guarantee third-party products.",
    "Where a product is purchased directly from a supplier, the relevant supplier’s terms, warranties, delivery conditions and refund policies may also apply."
  ) },
  { title: "11. Product and Service Information", blocks: [
    ...p("Users and Suppliers are responsible for ensuring that information they provide is accurate and not misleading.", "My Carer may remove or amend listings that we reasonably believe:"),
    bullets("Are inaccurate", "Are misleading", "Breach these Terms", "Breach applicable law", "Infringe another person’s rights", "Present a safety concern", "Are otherwise unsuitable for the Platform")
  ] },
  { title: "12. Reviews and Ratings", blocks: [
    ...p("Users may be able to leave reviews or ratings based on their genuine experience.", "Reviews must be:"),
    bullets("Honest", "Relevant", "Based on genuine experience", "Respectful", "Free from discriminatory, abusive or threatening language"),
    ...p("Users must not:"),
    bullets("Post fake reviews", "Create reviews for themselves", "Pay or offer incentives for misleading reviews", "Manipulate ratings", "Impersonate another person", "Use reviews to harass another User"),
    ...p("My Carer may remove reviews that breach these requirements.", "We may request additional information where necessary to investigate suspected fraudulent or misleading reviews.")
  ] },
  { title: "13. User Content", blocks: [
    ...p("By submitting Content to My Carer, you confirm that:"),
    bullets("You own the Content or have permission to use it", "The Content is accurate to the best of your knowledge", "The Content does not infringe another person’s rights", "The Content does not contain unlawful or harmful material"),
    ...p(
      "You grant My Carer a non-exclusive, worldwide, royalty-free licence to use, display, reproduce and distribute your Content as reasonably necessary to operate, promote and improve the Platform.",
      "You remain responsible for your Content.",
      "We may remove Content that breaches these Terms or applicable law."
    )
  ] },
  { title: "14. Prohibited Use", blocks: [
    ...p("You must not use My Carer to:"),
    bullets("Provide false or misleading information", "Impersonate another person", "Create fraudulent accounts", "Upload malicious software", "Attempt to gain unauthorised access to the Platform", "Harass, threaten or abuse another User", "Publish discriminatory or offensive material", "Misuse another person’s personal information", "Scam or defraud other Users", "Promote unlawful activities", "Circumvent Platform security", "Scrape or systematically copy Platform data without permission", "Use the Platform for any unlawful purpose"),
    ...p("We may suspend or terminate accounts involved in prohibited activity.")
  ] },
  { title: "15. Safety and Safeguarding", blocks: p(
    "The safety and wellbeing of people using care services is extremely important.",
    "Users should report suspected abuse, exploitation, fraud, unsafe conduct or other serious concerns to the appropriate authority and, where appropriate, to My Carer.",
    "Where there is an immediate risk of harm, Users should contact the relevant emergency services.",
    "My Carer may take appropriate action where we become aware of serious safety or safeguarding concerns, including restricting or removing an account."
  ) },
  { title: "16. Platform Availability", blocks: [
    ...p("We aim to keep My Carer available and functioning effectively, but we do not guarantee that the Platform will always be:"),
    bullets("Available", "Error-free", "Uninterrupted", "Secure from every possible threat", "Free from technical problems"),
    ...p("We may temporarily suspend access for maintenance, security, updates or other operational reasons.")
  ] },
  { title: "17. Third-Party Links and Services", blocks: p(
    "The Platform may contain links to third-party websites, products or services.",
    "These third parties operate independently from My Carer.",
    "We are not responsible for the content, availability, security, policies or practices of third-party websites or services.",
    "Users should review the relevant third party’s terms and privacy policy before using their services."
  ) },
  { title: "18. Fees and Subscriptions", blocks: [
    ...p(
      "Certain My Carer services may require a subscription or other fee.",
      "Any applicable fees will be displayed before you complete the relevant purchase or subscription.",
      "The pricing structure may vary depending on the type of account or service.",
      "Current pricing may include different plans for Caregivers, Care Seekers, Agencies, Local Authorities or other users.",
      "Example pricing shown on the Platform should only be published once confirmed by My Carer.",
      "Where a subscription applies:"
    ),
    bullets("The applicable price will be shown before purchase", "Payment arrangements will be explained during signup", "Renewal terms will be clearly communicated", "Cancellation options will be made available", "Any applicable taxes or additional charges will be identified where required"),
    ...p("Subscription terms must be read before purchase.")
  ] },
  { title: "19. Cancellation and Renewal", blocks: p(
    "You may cancel a subscription using the cancellation process made available through your account or by contacting My Carer where applicable.",
    "Where a subscription automatically renews, the renewal terms and applicable charges will be made clear before you subscribe.",
    "We will not use terms that unfairly prevent or penalise consumers from cancelling their subscription.",
    "Where consumer cancellation rights apply, nothing in these Terms is intended to remove or restrict those statutory rights.",
    "UK consumer guidance emphasises that subscription renewal and cancellation arrangements should be transparent and give consumers a reasonable opportunity to cancel."
  ) },
  { title: "20. Payments Between Users", blocks: p(
    "Unless expressly stated otherwise, My Carer does not determine or guarantee the payment arrangements between Care Seekers and Caregivers.",
    "Users are responsible for agreeing payment terms and ensuring that their arrangements comply with applicable law.",
    "Where My Carer processes payments for a specific service, the applicable payment terms will be displayed before payment is made."
  ) },
  { title: "21. Taxes and Legal Responsibilities", blocks: p(
    "Users are responsible for understanding and meeting their own tax, employment, insurance and legal obligations.",
    "Caregivers and other service providers are responsible for determining whether they are self-employed, employed or operating through a business and for meeting applicable obligations.",
    "Where required, digital platform operators may have information-gathering and reporting obligations relating to sellers under UK rules."
  ) },
  { title: "22. Intellectual Property", blocks: [
    ...p("All intellectual property rights in the My Carer Platform, including where applicable:"),
    bullets("Branding", "Logos", "Website design", "Graphics", "Software", "Text", "Layouts", "Features", "Original content"),
    ...p("belong to My Carer or its licensors unless otherwise stated.", "You must not copy, reproduce, modify, distribute or commercially exploit My Carer’s intellectual property without written permission.")
  ] },
  { title: "23. Privacy and Personal Information", blocks: [
    ...p(
      "Your use of personal information is explained in our Privacy Policy.",
      "We may collect and process personal information to operate the Platform, create accounts, provide services, communicate with Users, maintain security and meet legal obligations.",
      "Please read our Privacy Policy for further information about how personal data is handled."
    ),
    { type: "link", label: "Privacy Policy →", href: "/privacy-policy" }
  ] },
  { title: "24. Health and Medical Disclaimer", blocks: p(
    "My Carer is not a substitute for medical advice, diagnosis or treatment.",
    "Information provided through the Platform, including articles, caregiver profiles, product listings and other resources, should not be treated as professional medical advice unless expressly provided by an appropriately qualified professional acting within their professional role.",
    "Users should seek appropriate professional advice for medical or health-related decisions."
  ) },
  { title: "25. No Guarantee of Caregiver Suitability", blocks: p(
    "Although My Carer may provide verification information, profiles, reviews and other information, we do not guarantee that a particular caregiver will be suitable for an individual’s needs.",
    "Care Seekers are responsible for making their own assessment and choosing whether to enter into a care arrangement.",
    "Caregivers are responsible for ensuring that they are appropriately qualified, experienced and legally permitted to provide the services they offer."
  ) },
  { title: "26. Limitation of Liability", blocks: [
    ...p("Nothing in these Terms excludes or limits liability where it would be unlawful to do so.", "This includes liability that cannot legally be excluded or limited under applicable law.", "Subject to the above, My Carer will not be responsible for losses arising from:"),
    bullets("Arrangements made directly between Users", "The acts or omissions of a Caregiver or Care Seeker", "The accuracy of information supplied by Users", "Third-party products or services", "Third-party websites", "Events outside our reasonable control"),
    ...p("Nothing in these Terms is intended to exclude or restrict your statutory consumer rights.", "UK consumer law provides statutory protections for consumers, including rights concerning services and unfair contractual terms.")
  ] },
  { title: "27. Indemnity", blocks: p(
    "To the extent permitted by law, you agree to be responsible for losses, claims or reasonable costs arising from your unlawful use of the Platform, your breach of these Terms or your violation of another person’s rights.",
    "This clause does not apply where such responsibility cannot lawfully be imposed."
  ) },
  { title: "28. Suspension and Termination", blocks: [
    ...p("We may suspend, restrict or terminate an account where we reasonably believe that:"),
    bullets("These Terms have been breached", "The account contains fraudulent or misleading information", "The Platform is being used unlawfully", "There is a serious safety or safeguarding concern", "The account presents a security risk", "Continued access could harm other Users or the Platform"),
    ...p("Where appropriate, we will provide information about the reason for the action and any available appeal or review process.")
  ] },
  { title: "29. Changes to These Terms", blocks: [
    ...p("We may update these Terms from time to time to reflect:"),
    bullets("Changes to the Platform", "Changes to our services", "Changes in legal or regulatory requirements", "Security or operational improvements"),
    ...p("Where changes are significant, we will take reasonable steps to notify Users.", "The latest version will be made available on this page with the relevant update date.")
  ] },
  { title: "30. Complaints", blocks: p(
    "If you have a complaint about My Carer, please contact us first so that we can try to resolve the issue.",
    "Contact",
    "Email: hello@my-carer.co.uk",
    "Support: support@my-carer.co.uk",
    "Phone: 01482 688508",
    "Address: Shawbriggs, Barrow Road; Goxhill, North Lincolnshire; DN19 7LN",
    "Please provide enough information for us to understand the issue and, where possible, include relevant account or transaction details."
  ) },
  { title: "31. Governing Law", blocks: p(
    "These Terms are intended to be governed by the laws of England and Wales, unless applicable law requires otherwise.",
    "The courts of England and Wales will have jurisdiction, subject to any mandatory consumer rights that apply to you.",
    "[Client should confirm the correct governing law and jurisdiction before publication.]"
  ) },
  { title: "32. Severability", blocks: p(
    "If any provision of these Terms is found to be unlawful, invalid or unenforceable, that provision will be interpreted or removed to the extent necessary.",
    "The remaining provisions will continue to apply."
  ) },
  { title: "33. Entire Agreement", blocks: p(
    "These Terms, together with the Privacy Policy and any other terms expressly referred to on the Platform, form the agreement governing your use of My Carer, subject to any separate agreement that may apply to a particular service."
  ) },
  { title: "34. Contact Us", blocks: [
    ...p(
      "If you have questions about these Terms or the My Carer Platform, please contact us.",
      "My Carer",
      "Shawbriggs, Barrow Road",
      "Goxhill, North Lincolnshire",
      "DN19 7LN",
      "Email: hello@my-carer.co.uk",
      "Support: support@my-carer.co.uk",
      "Phone: 01482 688508"
    ),
    { type: "link", label: "Back to My Carer →", href: "/" },
    ...p("Related Policies"),
    { type: "link", label: "Privacy Policy →", href: "/privacy-policy", description: "Learn how we collect, use and protect personal information." },
    { type: "link", label: "Cookie Policy →", href: "#", description: "Learn how cookies and similar technologies are used on our website." },
    { type: "link", label: "Contact Us →", href: "/contact", description: "Get in touch with the My Carer team." }
  ] }
];

export default function TermsContent() {
  return <LegalDocument intro={[
    "By accessing or using My Carer, creating an account, listing care services, searching for care, posting a care job or using any other part of the platform, you agree to these Terms & Conditions.",
    "If you do not agree with these terms, please do not use the platform."
  ]} sections={sections} />;
}
