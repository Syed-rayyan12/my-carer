"use client";
import {useEffect,useRef,useState} from 'react';
import {useAuth} from '@/components/auth/AuthBoundary';
export function usePersistentDashboardState<T>(baseStorageKey:string,initialValue:T,validate:(value:unknown)=>value is T){
 const auth=useAuth();const storageKey=`${auth?.user.id??'preview'}:${baseStorageKey}`;
 const config=useRef({initialValue,validate});const [value,setValue]=useState(initialValue);const [loadedKey,setLoadedKey]=useState<string|null>(null);const [storageError,setStorageError]=useState(false);
 // Callers may pass inline defaults or validators. Updating them must not reload storage.
 useEffect(()=>{config.current={initialValue,validate};},[initialValue,validate]);
 // Synchronize the account-specific value with the browser's external storage.
 // eslint-disable-next-line react-hooks/set-state-in-effect
 useEffect(()=>{let restored=config.current.initialValue;setStorageError(false);try{const stored=localStorage.getItem(storageKey);if(stored){const parsed:unknown=JSON.parse(stored);if(config.current.validate(parsed))restored=parsed;}}catch{setStorageError(true);}setValue(restored);setLoadedKey(storageKey);},[storageKey]);
 // Storage failures must be visible to the caller after the browser write.
 // eslint-disable-next-line react-hooks/set-state-in-effect
 useEffect(()=>{if(loadedKey!==storageKey)return;try{localStorage.setItem(storageKey,JSON.stringify(value));}catch{setStorageError(true);}},[storageKey,value,loadedKey]);
 return {value,setValue,ready:loadedKey===storageKey,storageError};
}
