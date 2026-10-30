"use client";

import { useState } from "react";
import ProfileForm from "./ProfileForm";
import ProfileProgress from "./ProfileProgress";

export default function MyProfilePage() {
  const [completion, setCompletion] = useState(85);

  return (
    <main className="mx-auto flex max-w-[1530px] flex-col gap-6 px-8 pt-2 pb-4 max-[1250px]:px-6 max-[640px]:px-4">
      <section className="rounded-[11px] border border-[#d9d9d9] bg-white px-5 py-[18px]">
        <h1 className="mb-1 font-commissioner text-[42px] leading-[1.3] font-bold tracking-tight text-black max-[640px]:text-[32px]">My Profile</h1>
        <p className="font-nunito text-base font-normal text-[#363636]">Keep your information up to date so caregivers can better understand your needs and preferences.</p>
      </section>
      <ProfileProgress completion={completion} />
      <ProfileForm onCompletionChange={setCompletion} />
    </main>
  );
}
