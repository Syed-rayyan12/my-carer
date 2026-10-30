"use client";

import Link from "next/link";

export default function ProfileLogoutDropdown({ onStaySignedIn, onLogout }: { onStaySignedIn: () => void; onLogout: () => void }) {
  return (
    <div id="profile-logout-dropdown" role="dialog" aria-labelledby="profile-logout-heading" aria-describedby="profile-logout-description" className="absolute top-full right-0 z-50 mt-3 w-[184px] rounded-lg bg-white p-3 shadow-[0_6px_24px_#00000030]">
      <h2 id="profile-logout-heading" className="font-nunito text-xs leading-4 font-extrabold text-black">Log Out Of My Carer?</h2>
      <p id="profile-logout-description" className="mt-1 font-nunito text-xs leading-4 font-normal text-[#8b8b8b]">You will need to sign in again to manage this account.</p>
      <div className="mt-4 flex flex-col gap-1.5">
        <button type="button" autoFocus className="flex min-h-[26px] w-full items-center justify-center rounded-[5px] border border-[#ff2f68] bg-white px-2 py-1 font-nunito text-[10px] leading-4 font-normal text-[#ff2f68] hover:bg-[#fff5f8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff2f68]" onClick={onStaySignedIn}>Stay Signed In</button>
        <Link href="/" className="flex min-h-[26px] w-full items-center justify-center rounded-[5px] bg-[#eb1034] px-2 py-1 font-nunito text-[10px] leading-4 font-normal text-white hover:bg-[#cf0e2d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#eb1034]" onClick={onLogout}>Logout</Link>
      </div>
    </div>
  );
}
