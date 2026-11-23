"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Clock3, Mail, MapPin, Phone, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

export type TechnologyProduct = {
  title: string; image: string; description: string; details: string;
  gallery?: { src: string; alt: string; detail?: boolean }[];
  supplier: { name: string; location: string; hours: string; phone: string; email: string };
};
export type ProductEnquiry = { name: string; email: string; phone: string; message: string };

export default function TechnologyProductModal({ product, onClose, onEnquiry }: {
  product: TechnologyProduct;
  onClose: () => void;
  onEnquiry?: (enquiry: ProductEnquiry, product: TechnologyProduct) => Promise<void> | void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const id = useId();
  const [activeImage, setActiveImage] = useState(0);
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  // Two demo views of the product photo until supplier gallery images are provided.
  const gallery = product.gallery?.length ? product.gallery : [
    { src: product.image, alt: product.title, detail: false },
    { src: product.image, alt: `${product.title} detail view`, detail: true },
  ];
  const image = gallery[activeImage % gallery.length];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!dialog.open) dialog.showModal();
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);

  function slide(direction: number) {
    setActiveImage((index) => (index + direction + gallery.length) % gallery.length);
  }

  return (
    <dialog ref={dialogRef} aria-labelledby={`${id}-title`} onClose={onClose}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) event.currentTarget.close();
      }}
      className="fixed inset-0 m-auto max-h-[90dvh] max-[480px]:max-h-[94dvh] w-[calc(100%-32px)] max-w-[860px] overflow-y-auto rounded-[14px] border-0 bg-white p-0 font-nunito text-[14px] font-medium text-[#101929] shadow-2xl backdrop:bg-[#101929]/60">
      <header className="flex items-center justify-between gap-4 border-b border-[#e3e5e8] px-7 py-5 max-[600px]:px-4">
        <h2 id={`${id}-title`} className="font-commissioner text-[26px] font-bold leading-tight max-[600px]:text-[22px]">{product.title}</h2>
        <button type="button" aria-label="Close product details" onClick={() => dialogRef.current?.close()} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-[#fff1f4] focus-visible:outline-2 focus-visible:outline-[#ff2f68]"><X size={23} /></button>
      </header>
      <div className="space-y-5 p-7 max-[600px]:p-4">
        <section aria-label="Product gallery" className="grid grid-cols-[minmax(0,1fr)_100px] gap-4 max-[480px]:grid-cols-[minmax(0,1fr)_70px] max-[480px]:gap-2">
          <div className="relative h-[340px] overflow-hidden rounded-[12px] bg-[#f3f4f6] max-[600px]:h-[250px]" onKeyDown={(event) => {
            if (event.key === "ArrowLeft") { event.preventDefault(); slide(-1); }
            if (event.key === "ArrowRight") { event.preventDefault(); slide(1); }
          }} tabIndex={0} role="group" aria-label="Product image slider">
            <Image src={image.src} alt={image.alt} fill sizes="(max-width: 600px) 70vw, 660px" className={`object-cover transition-transform duration-300 motion-reduce:transition-none ${image.detail ? "scale-125" : "scale-100"}`} />
            <button type="button" aria-label="Previous product image" onClick={() => slide(-1)} className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#ff2f68] bg-white text-black shadow-sm hover:bg-[#fff1f4] focus-visible:outline-2 focus-visible:outline-[#ff2f68]"><ChevronLeft size={22} /></button>
            <button type="button" aria-label="Next product image" onClick={() => slide(1)} className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#ff2f68] bg-white text-black shadow-sm hover:bg-[#fff1f4] focus-visible:outline-2 focus-visible:outline-[#ff2f68]"><ChevronRight size={22} /></button>
            <span aria-live="polite" className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-3 py-1 text-[12px]">{activeImage + 1} / {gallery.length}</span>
          </div>
          <div className="flex flex-col gap-3">{gallery.map((item, index) => (
            <button key={`${item.src}-${index}`} type="button" aria-label={`Show product image ${index + 1}`} aria-pressed={activeImage === index} onClick={() => setActiveImage(index)} className={`relative h-[95px] w-full overflow-hidden rounded-[12px] border-[3px] bg-[#f3f4f6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff2f68] max-[480px]:h-[70px] ${activeImage === index ? "border-[#ff2f68]" : "border-transparent"}`}>
              <Image src={item.src} alt={item.alt} fill sizes="100px" className={`object-cover ${item.detail ? "scale-125" : "scale-100"}`} />
            </button>
          ))}</div>
        </section>
        <section className="rounded-[12px] border border-[#ff2f68]/20 bg-[#fff1f4] p-5 max-[480px]:p-4">
          <h3 className="mb-3 font-commissioner text-[22px] font-semibold text-[#d91c54]">{product.title}</h3>
          <p className="leading-[1.8] text-[#626b78]">{product.description}</p><p className="mt-3 leading-[1.8] text-[#626b78]">{product.details}</p>
        </section>
        <section className="rounded-[12px] border border-[#ff2f68]/20 bg-[#fff1f4] p-5 max-[480px]:p-4">
          <h3 className="mb-1 font-commissioner text-[22px] font-semibold text-[#d91c54]">Supplier Contact Information</h3><p className="mb-4 font-commissioner text-[16px] font-semibold">{product.supplier.name}</p>
          <ul className="space-y-3 text-[#626b78]">
            <li className="flex items-start gap-3"><MapPin size={19} className="mt-0.5 shrink-0 text-[#ff2f68]" />{product.supplier.location}</li>
            <li className="flex items-start gap-3"><Clock3 size={19} className="mt-0.5 shrink-0 text-[#ff2f68]" />{product.supplier.hours}</li>
            <li><a href={`tel:${product.supplier.phone.replace(/\s/g, "")}`} className="flex items-center gap-3"><Phone size={19} className="shrink-0 text-[#ff2f68]" />{product.supplier.phone}</a></li>
            <li><a href={`mailto:${product.supplier.email}`} className="flex min-w-0 items-center gap-3"><Mail size={19} className="shrink-0 text-[#ff2f68]" /><span className="break-all">{product.supplier.email}</span></a></li>
          </ul>
        </section>
        <section className="rounded-[12px] border border-[#ff2f68]/20 bg-[#fff1f4] p-5 max-[480px]:p-4">
          <h3 className="mb-4 font-commissioner text-[22px] font-semibold text-[#d91c54]">Send Enquiry</h3>
          <form className="grid grid-cols-2 gap-4" onSubmit={async (event) => {
            event.preventDefault();
            if (!onEnquiry) { setStatus("Enquiry sending is not connected yet. Your message has not been sent."); return; }
            const form = event.currentTarget;
            const data = new FormData(form);
            setSending(true); setStatus("");
            try {
              await onEnquiry({ name: String(data.get("name")), email: String(data.get("email")), phone: String(data.get("phone")), message: String(data.get("message")) }, product);
              setStatus("Your enquiry has been sent."); form.reset();
            } catch { setStatus("Your enquiry could not be sent. Please try again."); }
            finally { setSending(false); }
          }}>
            {[
              { name: "name", label: "Your Name", type: "text", autoComplete: "name" },
              { name: "email", label: "Your Email", type: "email", autoComplete: "email" },
              { name: "phone", label: "Your Phone", type: "tel", autoComplete: "tel" },
            ].map((field) => <div key={field.name} className={`flex min-w-0 flex-col gap-2 ${field.name === "phone" ? "col-span-2" : ""}`}>
              <label htmlFor={`${id}-${field.name}`} className="font-nunito text-[14px] font-medium">{field.label} <span className="text-red-600" aria-hidden="true">*</span></label>
              <input id={`${id}-${field.name}`} name={field.name} type={field.type} autoComplete={field.autoComplete} required placeholder={field.label} className="h-11 min-w-0 w-full rounded-[6px] border border-[#d9dde3] bg-white px-3 font-nunito text-[14px] max-[600px]:text-[16px] font-medium outline-none placeholder:text-[#98a0ab] focus:border-[#ff2f68] focus:ring-2 focus:ring-[#ff2f68]/15" />
            </div>)}
            <div className="col-span-2 flex flex-col gap-2"><label htmlFor={`${id}-message`} className="font-nunito text-[14px] font-medium">Message <span className="text-red-600" aria-hidden="true">*</span></label><textarea id={`${id}-message`} name="message" required rows={5} placeholder="Write your enquiry here" className="min-h-[140px] w-full resize-y rounded-[6px] border border-[#d9dde3] bg-white px-3 py-3 font-nunito text-[14px] max-[600px]:text-[16px] font-medium outline-none placeholder:text-[#98a0ab] focus:border-[#ff2f68] focus:ring-2 focus:ring-[#ff2f68]/15" /></div>
            <button type="submit" disabled={sending} className="col-span-2 inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-[7px] bg-[#ff2f68] px-6 font-nunito text-[14px] font-medium text-white hover:bg-[#e92359] disabled:opacity-60"><Mail size={18} />{sending ? "Sending…" : "Send Enquiry"}</button>
            {status && <p role="status" className="col-span-2 text-[#626b78]">{status}</p>}
          </form>
        </section>
      </div>
    </dialog>
  );
}
