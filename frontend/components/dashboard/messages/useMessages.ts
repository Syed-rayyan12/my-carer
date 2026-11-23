"use client";
import {useMemo,useState} from 'react';
import {useDashboard} from '../DashboardContext';
import {personName} from '@/components/platform/LiveWorkspace';
import {directoryPerson} from '../live-data';
import type {Conversation} from './messagesData';
export function useMessages(){const live=useDashboard();const [meta,setMeta]=useState<Record<string,Partial<Conversation>>>({});const [drafts,setDrafts]=useState<Record<string,string>>({});
 const contacts=useMemo(()=>{const all=[...live.caregivers];for(const m of live.snapshot.messages){const p=m.senderId===live.user.id?m.recipient:m.sender;if(!all.some(item=>item.id===p.id))all.push({...directoryPerson({...p,professional:null,verifications:[],reviewsReceived:[]}),specialty:p.role==='ADMIN'?'Administrator':'Caregiver'});}return all;},[live.snapshot,live.caregivers,live.user.id]);
 const conversations:Conversation[]=[...new Set(live.snapshot.messages.map(m=>m.senderId===live.user.id?m.recipientId:m.senderId))].map(id=>({id,caregiverId:id,online:false,unread:false,starred:false,archived:false,...meta[id],draft:drafts[id]??'',messages:live.snapshot.messages.filter(m=>m.senderId===id||m.recipientId===id).map(m=>({id:m.id,body:m.body,sender:m.senderId===live.user.id?'you':'caregiver',createdAt:m.createdAt,delivery:m.senderId===live.user.id?'sent':'received'}))}));
 const updateConversation=(id:string,change:Partial<Conversation>)=>{if(change.draft!==undefined)setDrafts(current=>({...current,[id]:change.draft!}));else setMeta(current=>({...current,[id]:{...current[id],...change}}));};
 const toggleStar=(id:string)=>updateConversation(id,{starred:!conversations.find(item=>item.id===id)?.starred});
 const saveReply=async(id:string)=>{const saved=await live.mutate('platform/messages',{recipientId:id,body:drafts[id]??''},'POST');if(saved)setDrafts(current=>({...current,[id]:''}));return saved;};
 return {conversations,contacts,ready:live.ready,storageError:false,updateConversation,toggleStar,saveReply};}
