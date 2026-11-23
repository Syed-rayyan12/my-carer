CREATE TYPE "AccountCategory" AS ENUM ('CAREGIVER','CARE_SEEKER','CARE_AGENCY','LOCAL_AUTHORITY');
ALTER TABLE "User" ADD COLUMN "accountCategory" "AccountCategory";
UPDATE "User" SET "accountCategory" = "role"::text::"AccountCategory" WHERE "role" IN ('CAREGIVER','CARE_SEEKER');
CREATE TABLE "PricingPlan" (
 "id" VARCHAR(40) NOT NULL PRIMARY KEY,
 "title" VARCHAR(80) NOT NULL,
 "subtitle" VARCHAR(200) NOT NULL,
 "pricePence" INTEGER NOT NULL CHECK ("pricePence" >= 0),
 "currency" VARCHAR(3) NOT NULL DEFAULT 'GBP',
 "interval" VARCHAR(20) NOT NULL DEFAULT 'month',
 "defaultRole" "Role" NOT NULL,
 "features" JSONB NOT NULL,
 "displayOrder" INTEGER NOT NULL DEFAULT 0,
 "active" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "PricingPlan" ("id","title","subtitle","pricePence","defaultRole","features","displayOrder") VALUES
('CAREGIVER','Caregiver','For Individual Caregivers Advertising Their Services',299,'CAREGIVER'::"Role",'["Create professional profile","Showcase qualifications and experience","Upload DBS/CRB verification","Set your hourly rates","Define travel radius","Add references and testimonials","Receive enquiries from clients","Browse care seeker postings","Apply to care agency jobs","Cancel anytime - no commitment"]'::jsonb,0),
('CARE_SEEKER','Care Seeker','For Individuals With Funding Seeking Care',199,'CARE_SEEKER'::"Role",'["Post your care requirements","Specify budget and funding type","Browse qualified caregivers","Direct contact with caregivers","Define care tasks needed","Set visit schedules","Filter by qualifications","Receive caregiver applications","Cancel anytime - no commitment"]'::jsonb,1),
('CARE_AGENCY','Care Agency','For Private Care Agencies Recruiting Caregivers',8900,'CARE_SEEKER'::"Role",'["Post unlimited care positions","Access to caregiver database","Detailed job postings","Specify client requirements","Set hourly rates and schedules","Receive applications directly","Agency branding on listings","Analytics and reporting","12-month rolling contract","90 days notice to cancel"]'::jsonb,2),
('LOCAL_AUTHORITY','Local Authority','For Councils And Local Government Care Services',11000,'CARE_SEEKER'::"Role",'["Create professional profile","Showcase qualifications and experience","Upload DBS/CRB verification","Set your hourly rates","Define travel radius","Add references and testimonials","Receive enquiries from clients","Browse care seeker postings","Apply to care agency jobs","Cancel anytime - no commitment"]'::jsonb,3);
ALTER TABLE "Membership" ADD COLUMN "planId" VARCHAR(40) NOT NULL DEFAULT 'CARE_SEEKER', ADD COLUMN "pricePence" INTEGER NOT NULL DEFAULT 199;
UPDATE "Membership" m SET "planId" = u."role"::text, "pricePence" = CASE WHEN u."role" = 'CAREGIVER' THEN 299 ELSE 199 END FROM "User" u WHERE m."userId" = u.id AND u."role" IN ('CAREGIVER','CARE_SEEKER');
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_planId_fkey" FOREIGN KEY ("planId") REFERENCES "PricingPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
