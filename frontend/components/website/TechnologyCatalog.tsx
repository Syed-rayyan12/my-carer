"use client";

import { useState } from "react";
import TechnologyProductModal, { type TechnologyProduct } from "./TechnologyProductModal";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const products = [
  { title: "Smart Medication", image: "/images/image 2 (4).png", description: "Keep medication routines clear and simple with connected dispensers and helpful reminders for everyday care." },
  { title: "Safety & Monitoring", image: "/images/Group 1160459038.png", description: "Support safer care at home with practical monitoring tools and connected alerts for families and professionals." },
  { title: "Mobility & Comfort", image: "/images/image 2 (11).png", description: "Discover equipment that supports comfortable movement and helps people stay independent for longer." },
  { title: "Voice-Activated Home Assistant", image: "/images/image 2 (12).png", description: "Make everyday tasks easier with hands-free reminders, calls and simple voice-controlled home support." },
  { title: "Fall Detection Watch", image: "/images/image 2 (13).png", description: "Wearable technology can help monitor activity and quickly alert someone when extra support may be needed." },
];

const productDetails: Record<string, string> = {
  "Smart Medication": "Explore medication dispensers and reminder systems that help organise daily routines. A supplier can explain available reminder settings, setup options and how the equipment fits an existing care plan.",
  "Safety & Monitoring": "Explore home monitoring equipment and connected alerts designed to support everyday care. Ask the supplier about installation, connectivity, notification settings and ongoing support.",
  "Mobility & Comfort": "Explore practical equipment for everyday movement and comfort at home. The supplier can discuss sizing, suitability, setup and maintenance for the individual user's needs.",
  "Voice-Activated Home Assistant": "Explore hands-free reminders, voice-controlled routines and connected home features. Ask the supplier about compatible devices, installation and accessibility options.",
  "Fall Detection Watch": "Explore wearable support with activity monitoring and alert features. The supplier can explain device connectivity, charging, emergency contacts and the limits of available detection features.",
};

export default function TechnologyCatalog() {
  const [selected, setSelected] = useState<TechnologyProduct | null>(null);
  function openProduct(product: (typeof products)[number]) {
    setSelected({ ...product, details: productDetails[product.title], supplier: {
      name: "Care Technology Supplies", location: "Manchester, United Kingdom", hours: "Monday to Friday, 9:00 AM ? 5:00 PM",
      phone: "+44 7700 900876", email: "products@example.com",
    } });
  }
  return (
    <section className="bg-white py-[55px] max-[600px]:py-8">
      <div className="mx-auto grid w-[min(1180px,calc(100%-60px))] grid-cols-3 gap-5 max-[850px]:grid-cols-2 max-[560px]:grid-cols-1 max-[560px]:w-[min(430px,calc(100%-30px))]">
        {products.map((product) => (
          <article key={product.title} className="overflow-hidden rounded-[12px] bg-white p-3 shadow-[0_7px_24px_rgba(16,25,41,.14)]">
            <div className="relative h-[220px] overflow-hidden rounded-[8px] bg-[#f3f4f6] max-[560px]:h-[245px]"><Image src={product.image} alt={product.title} fill sizes="(max-width: 560px) 90vw, (max-width: 850px) 45vw, 30vw" className="object-cover" /></div>
            <div className="px-1 pb-1 pt-3"><h2 className="font-commissioner text-[20px] font-bold leading-tight text-[#101929]">{product.title}</h2><p className="mb-3 mt-2 min-h-[59px] font-nunito font-medium text-[18px] leading-[1.5] text-[#667085]">{product.description}</p><button type="button" onClick={() => openProduct(product)} className="inline-flex min-h-[40px] items-center gap-2 rounded-[6px] bg-[#ff2f68] px-4 text-[14px] font-normal text-white transition-colors hover:bg-[#e92359]">View Product <ArrowRight size={14} /></button></div>
          </article>
        ))}
      </div>
      {selected && <TechnologyProductModal product={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
 