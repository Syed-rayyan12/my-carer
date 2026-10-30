export type DocumentStatus = "Pending" | "Approved" | "Rejected";
export type VerificationRecord = { id: string; name: string; initials: string; location: string; document: string; submitted: string; status: DocumentStatus; reason?: string };
export const initialVerificationRecords: VerificationRecord[] = [
  { id: "sarah-mitchell-dbs", name: "Sarah Mitchell", initials: "SM", location: "London", document: "DBS Certificate", submitted: "3 Sep 2026", status: "Pending" },
  { id: "sarah-smith-qualification", name: "Sarah Smith", initials: "SS", location: "Bristol", document: "Qualification Certificate", submitted: "2 Sep 2026", status: "Pending" },
  { id: "olivia-bennett-id", name: "Olivia Bennett", initials: "OB", location: "Nottingham", document: "ID Proof", submitted: "2 Sep 2026", status: "Pending" },
  { id: "james-carter-dbs", name: "James Carter", initials: "JC", location: "Sheffield", document: "DBS Certificate", submitted: "1 Sep 2026", status: "Pending" },
  { id: "grace-okafor-dbs", name: "Grace Okafor", initials: "GO", location: "London", document: "DBS Certificate", submitted: "31 Aug 2026", status: "Approved" },
  { id: "daniel-hughes-id", name: "Daniel Hughes", initials: "DH", location: "Manchester", document: "ID Proof", submitted: "30 Aug 2026", status: "Approved" },
  { id: "emily-clarke-id", name: "Emily Clarke", initials: "EC", location: "Liverpool", document: "ID Proof", submitted: "29 Aug 2026", status: "Rejected", reason: "Please upload a clear, readable copy of your ID." },
];
export function isVerificationRecords(value: unknown): value is VerificationRecord[] {
  return Array.isArray(value) && value.every(item => item && typeof item === "object" && ["id", "name", "initials", "location", "document", "submitted"].every(key => typeof item[key] === "string") && ["Pending", "Approved", "Rejected"].includes(item.status) && (item.reason === undefined || typeof item.reason === "string"));
}
