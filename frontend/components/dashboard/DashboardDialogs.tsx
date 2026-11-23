"use client";
import {useState} from 'react';
import {useDashboard} from './DashboardContext';
import CaregiverProfileModal from '@/components/website/CaregiverProfileModal';
import {directoryCaregiverProfile} from './caregivers/directoryCaregiverProfile';
import CaregiverMessageModal from './caregivers/CaregiverMessageModal';
import type {DirectoryCaregiver} from './caregivers/caregiverDirectoryData';
export default function DashboardDialogs(){const {selected,setSelected,caregivers,saved,setCaregiverSaved}=useDashboard();const [recipient,setRecipient]=useState<DirectoryCaregiver|null>(null);const person=selected===null?null:caregivers[selected];return <>{person&&<CaregiverProfileModal open onClose={()=>setSelected(null)} profile={directoryCaregiverProfile(person)} saved={saved.includes(person.id)} onFavouriteChange={value=>{void setCaregiverSaved(person.id,value);}} onContact={()=>{setSelected(null);setRecipient(person);}}/>}<CaregiverMessageModal caregiver={recipient} onClose={()=>setRecipient(null)}/></>;}
