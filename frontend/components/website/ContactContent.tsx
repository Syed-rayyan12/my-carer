import { Clock3, Mail, MapPin, Phone } from "lucide-react";

const contactDetails = [
  { label: "Phone", value: "01482 688508", icon: Phone, href: "tel:01482688508" },
  { label: "Email", value: "hello@my-carer.co.uk", icon: Mail, href: "mailto:hello@my-carer.co.uk" },
  { label: "Address", value: "Shawbriggs, Barrow Road", icon: MapPin },
  { label: "Business Hours", value: "Monday–Saturday: 9am–6pm", icon: Clock3 },
];

const fieldClass = "mt-2 h-[44px] w-full rounded-[8px] border border-[#d9d9d9] bg-white px-3 font-nunito text-[16px] text-[#101929] outline-none placeholder:text-[#777] focus:border-[#ff2f68]";

export default function ContactContent() {
  return (
    <section className="mx-auto w-[min(1100px,calc(100%-60px))] py-[45px] max-[600px]:w-[calc(100%-30px)] max-[600px]:py-7">
      <div className="mb-[28px] grid grid-cols-4 gap-[20px] max-[800px]:grid-cols-2 max-[520px]:grid-cols-1">
        {contactDetails.map(({ label, value, icon: Icon, href }) => (
          <article key={label} className="min-h-[145px] rounded-[10px] border border-[#d7d7d7] p-[22px]">
            <span className="mb-[14px] flex h-[44px] w-[44px] items-center justify-center rounded-[8px] bg-[#ff2f68] text-white"><Icon size={23} strokeWidth={2} /></span>
            <h2 className="mb-[6px] font-commissioner text-[18px] font-bold text-[#101929]">{label}</h2>
            {href ? <a className="break-words font-nunito text-[14px] text-[#5e626a] hover:text-[#ff2f68]" href={href}>{value}</a> : <p className="font-nunito text-[13px] text-[#5e626a]">{value}</p>}
          </article>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-[18px] max-[760px]:grid-cols-1">
        <section className="rounded-[10px] border border-[#ff2f68] p-[22px] max-[520px]:p-4">
          <h2 className="mb-1 font-commissioner text-[32px] font-bold leading-tight text-[#101929] max-[520px]:text-[27px]">Send Us a Message</h2>
          <p className="mb-[20px] font-nunito text-[13px] leading-relaxed text-[#626b78]">Fill out the form below and we’ll get back to you as soon as possible.</p>
          <form className="space-y-[14px]">
            <div className="grid grid-cols-2 gap-3 max-[430px]:grid-cols-1">
              <label className="font-nunito text-[12px] text-[#555]">First Name<input className={fieldClass} placeholder="First Name" /></label>
              <label className="font-nunito text-[12px] text-[#555]">Last Name<input className={fieldClass} placeholder="Last Name" /></label>
              <label className="font-nunito text-[12px] text-[#555]">Email<input type="email" className={fieldClass} placeholder="Enter Your Email" /></label>
              <label className="font-nunito text-[12px] text-[#555]">Phone Number<input type="tel" className={fieldClass} placeholder="Enter Your Phone Number" /></label>
            </div>
            <label className="block font-nunito text-[12px] text-[#555]">I Am A:
              <select defaultValue="" className={`${fieldClass} appearance-none`}><option value="" disabled>Select Role</option><option>Care Seeker</option><option>Caregiver</option><option>Care Agency</option><option>Other</option></select>
            </label>
            <label className="block font-nunito text-[12px] text-[#555]">Subject<input className={fieldClass} placeholder="How Can We Help?" /></label>
            <label className="block font-nunito text-[12px] text-[#555]">Message<textarea className="mt-2 min-h-[105px] w-full resize-y rounded-[8px] border border-[#d9d9d9] bg-white px-3 py-3 font-nunito text-[13px] text-[#101929] outline-none placeholder:text-[#777] focus:border-[#ff2f68]" placeholder="Tell Us More About Your Enquiry..." /></label>
            <button type="button" className="h-[43px] w-full rounded-[7px] bg-[#ff2f68] font-nunito text-[13px] font-semibold text-white transition-colors hover:bg-[#e92359]">Send Message</button>
          </form>
        </section>
        <img src="/images/about-story.png" alt="Caregiver supporting an older woman" className="h-full min-h-[590px] w-full rounded-[10px] object-cover max-[760px]:min-h-0 max-[760px]:h-[320px]" />
      </div>
    </section>
  );
}
