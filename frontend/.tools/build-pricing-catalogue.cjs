const fs = require('node:fs');
const tables = JSON.parse(fs.readFileSync('backend/docs/pricing-source.json', 'utf8').replace(/^\uFEFF/, ''));
const groups = [
  { category: 'CAREGIVER', name: 'Individual carer', prefix: 'CARER', role: 'CAREGIVER', annual: [0, 9900, 19900] },
  { category: 'CARE_HOME', name: 'Care home', prefix: 'HOME', role: 'CARE_SEEKER', annual: [0, 79000, 149000] },
  { category: 'CARE_AGENCY', name: 'Care agency', prefix: 'AGENCY', role: 'CARE_SEEKER', annual: [49000, 129000, 129000, 249000] },
];
const catalogue = tables.flatMap((table, groupIndex) => {
  const g = groups[groupIndex];
  return table.rows[0].slice(1).map((tier, tierIndex) => {
    const price = Math.round(Number(table.rows[1][tierIndex + 1].replace(/[^\d.]/g, '')) * 100);
    let section = '';
    const featureRows = table.rows.slice(3).flatMap(row => {
      if (row.length === 1) { section = row[0]; return []; }
      return [{ section, label: row[0], value: row[tierIndex + 1] }];
    });
    const has = label => { const v = featureRows.find(r => r.label === label)?.value; return Boolean(v && v !== '—'); };
    const number = label => { const v = featureRows.find(r => r.label === label)?.value; return v === 'Unlimited' ? null : Number(v?.match(/\d+/)?.[0] ?? 0); };
    const entitlements = {
      basicProfile: true, bio: g.category !== 'CAREGIVER' || has('Profile photo & bio'),
      specialismsLimit: g.category === 'CAREGIVER' ? number('Specialisms listed') : null,
      qualifications: has('Qualifications & certificates'), availability: has('Availability calendar'),
      featured: has('Featured / top placement') || has('Top search placement') || has('Top-of-search placement'),
      dbs: has('DBS verified badge'), rightToWork: has('Right to work verified'),
      reviewsCollect: g.category === 'CAREGIVER' ? tierIndex > 0 : has('Invite families to review') || has('Collect & display reviews'),
      reviewsRespond: has('Respond to reviews') || has('Respond to reviews publicly'),
      reviewsDispute: has('Flag & dispute reviews'), directMessages: g.category === 'CAREGIVER' ? has('Direct message from families') : price > 0,
      jobAlerts: has('Job alerts (agency roles)'), analytics: has('Profile analytics dashboard') || has('Enquiry & listing analytics') || has('Enquiry lead dashboard'),
      jobLimit: g.category === 'CAREGIVER' ? 0 : number(g.category === 'CARE_HOME' ? 'Job vacancy posts' : 'Job postings'),
      shortlist: has('Candidate shortlisting tool'), candidateFilters: has('Filter applicants by DBS & quals'),
      galleryLimit: number('Photo gallery'), virtualTour: has('Virtual tour embed'),
      serviceDetails: has('Services & specialisms detail'), feeRange: has('Fee range displayed'),
      team: has('Photo gallery & team section'), carousel: has('Homepage carousel placement'),
      multiBranch: has('Multi-branch management'), integrations: has('ATS / CRM integration'), apiAccess: has('API access'),
      monthlyReport: has('Monthly performance report'),
    };
    const id = g.prefix + '_' + tier.toUpperCase().replace('+', '_PLUS');
    return { id, category: g.category, tier, title: `${g.name} ${tier}`, subtitle: g.category === 'CAREGIVER' ? 'For self-employed carers and personal assistants' : g.category === 'CARE_HOME' ? 'For residential, nursing, and specialist care homes' : 'For domiciliary, live-in, and specialist care agencies', pricePence: price, annualPricePence: g.annual[tierIndex], trialMonths: price > 0 ? 6 : 0, currency: 'GBP', interval: 'month', defaultRole: g.role, featureRows, features: featureRows.filter(r => r.value !== '—').map(r => r.value === '✓' ? r.label : `${r.label}: ${r.value}`), entitlements, displayOrder: groupIndex * 10 + tierIndex };
  });
});
const family = { id: 'FAMILY_FREE', category: 'CARE_SEEKER', tier: 'Free', title: 'Care Seeker', subtitle: 'For families seeking care', pricePence: 0, annualPricePence: 0, trialMonths: 0, currency: 'GBP', interval: 'month', defaultRole: 'CARE_SEEKER', featureRows: [], features: ['Find caregivers', 'Post care requirements', 'Contact eligible caregivers'], entitlements: {basicProfile:true,directMessages:true,jobLimit:null,shortlist:true,reviewsCollect:true}, displayOrder: 99 };
fs.writeFileSync('backend/docs/pricing-catalogue.json', JSON.stringify(catalogue, null, 2) + '\n');
const q = v => `'${String(v).replaceAll("'", "''")}'`;
const dir = 'backend/prisma/migrations/20261119000400_document_pricing'; fs.mkdirSync(dir, {recursive:true});
let sql = `ALTER TABLE "PricingPlan" ADD COLUMN "category" VARCHAR(40) NOT NULL DEFAULT 'CARE_SEEKER', ADD COLUMN "tier" VARCHAR(40) NOT NULL DEFAULT '', ADD COLUMN "annualPricePence" INTEGER NOT NULL DEFAULT 0, ADD COLUMN "trialMonths" INTEGER NOT NULL DEFAULT 0, ADD COLUMN "featureRows" JSONB NOT NULL DEFAULT '[]', ADD COLUMN "entitlements" JSONB NOT NULL DEFAULT '{}';
ALTER TABLE "Membership" ADD COLUMN "billingInterval" VARCHAR(10) NOT NULL DEFAULT 'monthly', ADD COLUMN "trialStartedAt" TIMESTAMP(3), ADD COLUMN "trialEndsAt" TIMESTAMP(3);
ALTER TABLE "Review" ADD COLUMN "response" VARCHAR(2000), ADD COLUMN "respondedAt" TIMESTAMP(3), ADD COLUMN "disputeReason" VARCHAR(1000);
UPDATE "PricingPlan" SET "active" = false;
`;
for (const p of [...catalogue, family]) {
  const keys = Object.keys(p); sql += `INSERT INTO "PricingPlan" (${keys.map(k=>'"'+k+'"').join(',')}) VALUES (${keys.map(k=>q(typeof p[k]==='object'?JSON.stringify(p[k]):p[k])).join(',')});\n`;
}
sql += `UPDATE "Membership" SET "planId" = CASE "planId" WHEN 'CAREGIVER' THEN 'CARER_FREE' WHEN 'CARE_AGENCY' THEN 'AGENCY_STARTER' WHEN 'LOCAL_AUTHORITY' THEN 'FAMILY_FREE' ELSE 'FAMILY_FREE' END, "pricePence" = CASE "planId" WHEN 'CARE_AGENCY' THEN 4900 ELSE 0 END WHERE "planId" IN ('CAREGIVER','CARE_SEEKER','CARE_AGENCY','LOCAL_AUTHORITY');
CREATE TABLE "OrganisationProfile" (
 "userId" UUID NOT NULL PRIMARY KEY REFERENCES "User"("id") ON DELETE CASCADE,
 "name" VARCHAR(160) NOT NULL DEFAULT '', "description" VARCHAR(4000) NOT NULL DEFAULT '',
 "address" VARCHAR(300) NOT NULL DEFAULT '', "postcode" VARCHAR(12) NOT NULL DEFAULT '', "phone" VARCHAR(30) NOT NULL DEFAULT '',
 "website" VARCHAR(300) NOT NULL DEFAULT '', "coverage" VARCHAR(1000) NOT NULL DEFAULT '',
 "services" VARCHAR(2000) NOT NULL DEFAULT '', "feeRange" VARCHAR(200) NOT NULL DEFAULT '',
 "gallery" JSONB NOT NULL DEFAULT '[]', "team" VARCHAR(2000) NOT NULL DEFAULT '', "virtualTour" VARCHAR(300) NOT NULL DEFAULT '',
 "branches" JSONB NOT NULL DEFAULT '[]', "cqcReference" VARCHAR(100) NOT NULL DEFAULT '', "cqcRating" VARCHAR(80), "cqcVerifiedAt" TIMESTAMP(3), "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`;
fs.writeFileSync(dir+'/migration.sql', sql);
