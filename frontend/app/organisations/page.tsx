import type {Metadata} from 'next';
import WebsitePageShell from '@/components/website/WebsitePageShell';
import OrganisationDirectory from '@/components/platform/OrganisationDirectory';
export const metadata:Metadata={title:'Care Homes & Agencies | My Carer',description:'Browse care homes and care agencies on My Carer.'};
export default function Page(){return <WebsitePageShell activePage="care-homes"><OrganisationDirectory/></WebsitePageShell>;}
