export function whatsappContactUrl(phone: string, name: string) {
  const value = phone.trim();
  if (!value || !/^[+\d\s().-]+$/.test(value)) return null;
  let number = value.replace(/\D/g, "");
  if (number.startsWith("00")) number = number.slice(2);
  else if (!value.startsWith("+") && number.startsWith("0")) number = `44${number.slice(1)}`;
  if (!/^[1-9]\d{6,14}$/.test(number)) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(`Hi ${name || "there"}, I'd like to discuss your care services.`)}`;
}

export default function WhatsAppContactButton({ phone, name }: { phone: string; name: string }) {
  const url = whatsappContactUrl(phone, name);
  const icon = <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-7"><path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.3-4.8a8.5 8.5 0 1 1 16.2-4Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><path d="m8.2 7.4 1.2-.1 1.1 2.6-.9 1.1a8.2 8.2 0 0 0 3.5 3.2l1-1.1 2.6 1.2-.2 1.4c-.2.8-1 1.1-1.7 1.1-3.6-.2-7.7-4-8-7.6 0-.8.6-1.6 1.4-1.8Z" fill="currentColor" /></svg>;
  const content = <><span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#25d366] text-white shadow-sm">{icon}</span><span className="min-w-0 text-left"><span className="block text-sm font-bold text-[#075e54]">Contact on WhatsApp</span><span className="mt-1 block text-xs text-[#47756a]">{url ? "Chat with " + (name || "the caregiver") : "Provider phone number not added yet"}</span></span><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="ml-auto size-5 shrink-0 text-[#128c4a]"><path d="M7 17 17 7M7 7h10v10" strokeLinecap="round" strokeLinejoin="round" /></svg></>;
  const className = "flex w-full items-center gap-3 rounded-xl border border-[#b8e8cb] bg-[#effcf3] p-4 transition-colors hover:bg-[#e2f8e9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#128c4a]";
  return <div className="px-6 pb-5">{url ? <a href={url} target="_blank" rel="noopener noreferrer" className={className}>{content}</a> : <><button type="button" disabled className={className}>{content}</button><p className="mt-2 text-xs leading-5 text-[#667085]">Add the provider WhatsApp phone number in My Profile to enable chat.</p></>}</div>;
}
