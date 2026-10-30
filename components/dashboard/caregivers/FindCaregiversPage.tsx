"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Filter, Search, UsersRound } from "lucide-react";
import CaregiverProfileModal, { demoCaregiverProfile } from "@/components/website/CaregiverProfileModal";
import { useDashboard } from "../DashboardContext";
import CaregiverFilters from "./CaregiverFilters";
import CaregiverResultCard from "./CaregiverResultCard";
import { defaultCaregiverFilters, directoryCaregivers, filterCaregivers, type DirectoryCaregiver } from "./caregiverDirectoryData";
import { directoryCaregiverProfile } from "./directoryCaregiverProfile";
import DashboardPageHeader from "../DashboardPageHeader";

export default function FindCaregiversPage() {
  const { saved, toggleSaved } = useDashboard();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(defaultCaregiverFilters);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [selected, setSelected] = useState<DirectoryCaregiver | null>(null);
  const reduceMotion = useReducedMotion();
  const results = filterCaregivers(directoryCaregivers, query, filters);

  function resetFilters() { setFilters(defaultCaregiverFilters); }

  return (
    <main className="mx-auto max-w-[1530px] px-8 pt-2 pb-5 max-[1250px]:px-6 max-[640px]:px-4">
      <DashboardPageHeader title="Find Your Caregiver" description="Search and compare caregivers who match your care needs." />
      <div className="mb-6 flex items-center gap-2.5 rounded-[11px] border border-[#d9d9d9] bg-white px-4 py-3.5 max-[500px]:flex-wrap">
        <label className="flex min-h-10 min-w-0 flex-1 items-center gap-2.5 rounded-md border border-[#d9d9d9] px-4 focus-within:border-[#ff2f68]" htmlFor="find-caregiver-search"><Search size={18} className="shrink-0 text-[#ff2f68]" /><input id="find-caregiver-search" className="h-10 w-full min-w-0 bg-transparent font-nunito text-base text-[#343434] outline-none placeholder:text-[#525252]" type="search" placeholder="Search by name..." value={query} onChange={event => setQuery(event.target.value)} /></label>
        <button type="button" aria-expanded={filtersVisible} aria-controls="caregiver-filters" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-[#ff2f68] px-5 font-nunito text-base text-black" onClick={() => setFiltersVisible(current => !current)}><Filter size={18} className="text-[#ff2f68]" />Filters</button>
      </div>
      <div className={`grid items-start gap-5 ${filtersVisible ? "grid-cols-[260px_minmax(0,1fr)] max-[1100px]:grid-cols-1" : "grid-cols-1"}`}>
        {filtersVisible && <aside aria-label="Caregiver filters"><CaregiverFilters filters={filters} onChange={setFilters} onApply={() => document.getElementById("caregiver-results-title")?.scrollIntoView({ behavior: reduceMotion ? "instant" : "smooth", block: "start" })} onReset={resetFilters} /></aside>}
        <section className="min-w-0" aria-labelledby="caregiver-results-title">
          <h2 id="caregiver-results-title" className="mb-4 font-commissioner text-[30px] leading-tight font-bold text-[#202925] max-[640px]:text-2xl" aria-live="polite">{String(results.length).padStart(2, "0")} Caregivers Found</h2>
          <motion.div layout={!reduceMotion} className="relative grid grid-cols-2 items-stretch gap-4 max-[700px]:grid-cols-1" transition={{ layout: { type: "spring", stiffness: 350, damping: 32 } }}>
            <AnimatePresence initial={false} mode="popLayout">
              {results.map((caregiver, index) => (
                <motion.div
                  key={caregiver.id}
                  layout={reduceMotion ? false : "position"}
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 14, scale: reduceMotion ? 1 : 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: reduceMotion ? 0 : 0.22, delay: reduceMotion ? 0 : Math.min(index, 5) * 0.025 } }}
                  exit={{ opacity: 0, y: reduceMotion ? 0 : -6, scale: reduceMotion ? 1 : 0.97, transition: { duration: reduceMotion ? 0 : 0.14 } }}
                  transition={{ layout: { type: "spring", stiffness: 350, damping: 32 } }}
                  className="h-full min-w-0"
                >
                  <CaregiverResultCard caregiver={caregiver} saved={saved.includes(caregiver.name)} onViewProfile={() => setSelected(caregiver)} onToggleSave={() => toggleSaved(caregiver.name)} />
                </motion.div>
              ))}
              {results.length === 0 && <motion.div key="empty-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.15 }} className="col-span-full rounded-2xl border border-[#e5e2dc] bg-white px-6 py-12 text-center"><UsersRound size={35} className="mx-auto mb-4 text-[#ff2f68]" /><h3 className="font-jakarta text-lg font-semibold text-[#202925]">No caregivers match your search</h3><p className="mt-2 font-nunito text-sm text-[#667085]">Try a different name or change your filters.</p><button type="button" className="mt-5 rounded-lg bg-[#ff2f68] px-5 py-2.5 font-nunito text-sm text-white" onClick={() => { resetFilters(); setQuery(""); }}>Clear search and filters</button></motion.div>}
            </AnimatePresence>
          </motion.div>
        </section>
      </div>
      <CaregiverProfileModal open={selected !== null} onClose={() => setSelected(null)} profile={selected ? directoryCaregiverProfile(selected) : demoCaregiverProfile} saved={selected ? saved.includes(selected.name) : false} onFavouriteChange={(isSaved, profile) => { if (saved.includes(profile.name) !== isSaved) toggleSaved(profile.name); }} />
    </main>
  );
}
