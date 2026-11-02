"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePersistentDashboardState } from "@/components/dashboard/usePersistentDashboardState";
import { initialCaregiverProfile, isCaregiverProfile, type CaregiverProfile } from "./profile/caregiverProfileData";
import { initialCaregiverApplications, isCaregiverApplications, withdrawCaregiverApplication, type CaregiverApplication } from "./caregiverDashboardData";
import { initialCaregiverAvailability, isCaregiverAvailability, type CaregiverAvailability } from "./preview/availabilityData";
import { initialCaregiverDocuments, isCaregiverDocuments, replaceVerificationDocument, type CaregiverVerificationDocument } from "./verification/verificationData";
import { initialCaregiverServices, isCaregiverServices, saveCareService, toggleCareService, removeCareService, type CaregiverCareService } from "./services/careServicesData";
import { initialCaregiverTimeOff, isCaregiverTimeOff, validateTimeOff, type CaregiverTimeOff } from "./availability/timeOffData";
import { initialCaregiverConversations, isCaregiverConversations, replyToConversation, type CaregiverConversation } from "./messages/caregiverMessagesData";
import { initialCaregiverNotifications, isCaregiverNotifications, readCaregiverNotifications, removeCaregiverNotification } from "./notifications/notificationsData";

const initialSavedJobs: string[] = ["dementia-manchester"];
function isSavedJobs(value: unknown): value is string[] { return Array.isArray(value) && value.every(item => typeof item === "string"); }
function useCaregiverState() {
  const [search, setSearch] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const { value: savedJobs, setValue: setSavedJobs, ready, storageError } = usePersistentDashboardState("my-carer-caregiver-saved-jobs", initialSavedJobs, isSavedJobs);
  const profileState = usePersistentDashboardState("my-carer-caregiver-profile", initialCaregiverProfile, isCaregiverProfile);
  const applicationState = usePersistentDashboardState("my-carer-caregiver-applications", initialCaregiverApplications, isCaregiverApplications);
  const availabilityState = usePersistentDashboardState("my-carer-caregiver-availability", initialCaregiverAvailability, isCaregiverAvailability);
  const documentState = usePersistentDashboardState("my-carer-caregiver-verification", initialCaregiverDocuments, isCaregiverDocuments);
  const serviceState = usePersistentDashboardState("my-carer-caregiver-services", initialCaregiverServices, isCaregiverServices);
  const timeOffState = usePersistentDashboardState("my-carer-caregiver-time-off", initialCaregiverTimeOff, isCaregiverTimeOff);
  const conversationState = usePersistentDashboardState("my-carer-caregiver-conversations", initialCaregiverConversations, isCaregiverConversations);
  const notificationState = usePersistentDashboardState("my-carer-caregiver-notifications", initialCaregiverNotifications, isCaregiverNotifications);
  useEffect(() => { const close = (event: KeyboardEvent) => { if (event.key === "Escape") setMobileMenu(false); }; document.addEventListener("keydown", close); return () => document.removeEventListener("keydown", close); }, []);
  function toggleSavedJob(id: string) { if (ready) setSavedJobs(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]); }
  function updateProfile(update: (profile: CaregiverProfile) => CaregiverProfile) { if (profileState.ready) profileState.setValue(update); }
  function addApplication(application: CaregiverApplication) { if (applicationState.ready && isCaregiverApplications([application])) applicationState.setValue(current => current.some(item => item.jobId === application.jobId && item.status !== "Withdrawn") ? current : [application, ...current]); }
  function updateAvailability(value: CaregiverAvailability) { if (availabilityState.ready && isCaregiverAvailability(value)) availabilityState.setValue(value); }
  function updateVerificationDocument(document: CaregiverVerificationDocument) { if (documentState.ready) documentState.setValue(current => replaceVerificationDocument(current, document)); }
  function updateCareService(service: CaregiverCareService) { if (serviceState.ready) serviceState.setValue(current => saveCareService(current, service)); }
  function toggleService(id: string) { if (serviceState.ready) serviceState.setValue(current => toggleCareService(current, id)); }
  function removeService(id: string) { if (serviceState.ready) serviceState.setValue(current => removeCareService(current, id)); }
  function addTimeOff(item: CaregiverTimeOff) { if (timeOffState.ready) timeOffState.setValue(current => validateTimeOff(item.start, item.end, current) || current.some(record => record.id === item.id) ? current : [...current, item].sort((a, b) => a.start.localeCompare(b.start))); }
  function removeTimeOff(id: string) { if (timeOffState.ready) timeOffState.setValue(current => current.filter(item => item.id !== id)); }
  function withdrawApplication(id: string) { if (applicationState.ready) applicationState.setValue(current => withdrawCaregiverApplication(current, id)); }
  function updateConversation(conversation: CaregiverConversation) { if (conversationState.ready && isCaregiverConversations([conversation])) conversationState.setValue(current => current.map(item => item.id === conversation.id ? conversation : item)); }
  function saveReply(id: string, reply: string) { if (conversationState.ready) conversationState.setValue(current => replyToConversation(current, id, reply)); }
  function startConversation(name: string, subject: string) { const existing = conversationState.value.find(item => item.name === name && item.subject === subject); if (existing) return existing.id; const id = crypto.randomUUID(); if (conversationState.ready) conversationState.setValue(current => [...current, { id, name, initials: name.split(" ").map(part => part[0]).slice(0, 2).join(""), subject, message: "", status: "New", replies: [], draft: "", unread: false, time: "Just now" }]); return id; }
  function markNotificationRead(id: string) { if (notificationState.ready) notificationState.setValue(current => readCaregiverNotifications(current, id)); }
  function markAllNotificationsRead() { if (notificationState.ready) notificationState.setValue(current => readCaregiverNotifications(current)); }
  function removeNotification(id: string) { if (notificationState.ready) notificationState.setValue(current => removeCaregiverNotification(current, id)); }
  return { search, setSearch, mobileMenu, setMobileMenu, savedJobs, toggleSavedJob, ready: ready && profileState.ready && applicationState.ready && availabilityState.ready && documentState.ready && serviceState.ready && timeOffState.ready && conversationState.ready && notificationState.ready, storageError: storageError || profileState.storageError || applicationState.storageError || availabilityState.storageError || documentState.storageError || serviceState.storageError || timeOffState.storageError || conversationState.storageError || notificationState.storageError, profile: profileState.value, updateProfile, applications: applicationState.value, addApplication, availability: availabilityState.value, updateAvailability, documents: documentState.value, updateVerificationDocument, services: serviceState.value, updateCareService, toggleService, removeService, timeOff: timeOffState.value, addTimeOff, removeTimeOff, withdrawApplication, conversations: conversationState.value, updateConversation, saveReply, startConversation, notifications: notificationState.value, markNotificationRead, markAllNotificationsRead, removeNotification };
}
const CaregiverContext = createContext<ReturnType<typeof useCaregiverState> | null>(null);
export function CaregiverDashboardProvider({ children }: { children: ReactNode }) { const value = useCaregiverState(); return <CaregiverContext.Provider value={value}>{children}</CaregiverContext.Provider>; }
export function useCaregiverDashboard() { const value = useContext(CaregiverContext); if (!value) throw new Error("CaregiverDashboardProvider is required"); return value; }
