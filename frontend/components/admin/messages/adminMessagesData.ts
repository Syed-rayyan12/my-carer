export type AdminMessage = { id: string; name: string; initials: string; subject: string; message: string; status: "New" | "Replied" | "Archived"; replies: string[]; draft: string };
export const initialAdminMessages: AdminMessage[] = [
  { id: "sarah-account", name: "Sarah Mitchell", initials: "SM", subject: "Account Issue", message: "Great, thank you. Will I get an email once it is approved?", status: "New", replies: [], draft: "" },
  { id: "john-job", name: "John Brown", initials: "JB", subject: "Job listing not visible", message: "I posted a job for a dementia caregiver this morning but I cannot see it on the site.", status: "New", replies: [], draft: "" },
  { id: "helen-billing", name: "Helen Carter", initials: "HC", subject: "Billing question", message: "I was charged for Premium twice this month. Could you check please?", status: "New", replies: [], draft: "" },
  { id: "daniel-rate", name: "Daniel Hughes", initials: "DH", subject: "Update hourly rate", message: "You can update it from Profile → Rates. Let us know if you need a hand!", status: "New", replies: [], draft: "" },
];
