import type { ReactNode } from "react";
import { CareJobsProvider } from "@/components/admin/care-jobs/CareJobsContext";

export default function Layout({ children }: { children: ReactNode }) { return <CareJobsProvider>{children}</CareJobsProvider>; }
