
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function WebsiteFooter() {
    return (<footer  className="max-[900px]:pt-[55px] max-[600px]:p-[50px_0_20px] w-full p-[70px_0_22px] bg-[#101929] text-[#ffffff] font-nunito break-words">

  <div  className="max-[1200px]:w-[calc(100%_-_60px)] max-[1200px]:gap-x-[40px] max-[1200px]:pb-[80px] max-[900px]:grid-cols-[1.5fr_1fr_1fr] max-[900px]:gap-y-[45px] max-[900px]:pb-[60px] max-[600px]:w-[calc(100%_-_40px)] max-[600px]:grid-cols-[1fr_1fr] max-[600px]:gap-x-[25px] max-[600px]:gap-y-[40px] max-[600px]:pb-[45px] max-[420px]:grid-cols-[1fr] max-[1050px]:w-[calc(100%_-_40px)] max-[1050px]:gap-[35px] max-[768px]:grid-cols-[1fr_1fr] max-[520px]:w-[calc(100%_-_30px)] max-[520px]:grid-cols-[1fr] w-[min(1240px,_calc(100%_-_80px))] m-[0_auto] grid grid-cols-[1.7fr_1fr_1fr_1.25fr] gap-x-[70px] pb-[110px]">

    {/* BRAND */}
    <div  className="max-[900px]:col-span-full max-[600px]:col-span-full max-[420px]:col-auto max-[768px]:col-span-full pt-[0]">

      <div  className="max-[600px]:w-[145px] w-[160px] mb-[18px] p-[0] bg-[transparent]">
        <img className="block w-[160px] h-[auto] object-contain max-[600px]:w-[145px]" src="/footer_logo.png" alt="My Carer"/>
      </div>

      <p className="max-w-[335px] m-[0_0_18px] text-[#ffffff] font-nunito text-[16px] font-normal leading-[1.8] max-[900px]:max-w-[400px] max-[600px]:text-[14px] max-[600px]:leading-[1.7]">
        Connecting compassionate caregivers with
        those who need care across the UK.
      </p>

      <div  className="flex items-center gap-[9px] mt-[10px]">

  <a className="w-[34px] h-[34px] flex items-center justify-center border border-[#ff2f68] rounded-[50%] text-[#ffffff] bg-[transparent] [transition:all_0.25s_ease] hover:bg-[#ff2f68] hover:text-[#ffffff] hover:transform-[translateY(-2px)] max-[600px]:w-[32px] max-[600px]:h-[32px]" href="#" aria-label="Facebook">
    <svg className="w-[17px] h-[17px] block max-[600px]:w-[16px] max-[600px]:h-[16px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M14 8h3V4h-3c-3.31 0-5 1.69-5 5v3H6v4h3v8h4v-8h3l1-4h-4V9c0-.67.33-1 1-1z"/>
    </svg>
  </a>

  <a className="w-[34px] h-[34px] flex items-center justify-center border border-[#ff2f68] rounded-[50%] text-[#ffffff] bg-[transparent] [transition:all_0.25s_ease] hover:bg-[#ff2f68] hover:text-[#ffffff] hover:transform-[translateY(-2px)] max-[600px]:w-[32px] max-[600px]:h-[32px]" href="#" aria-label="X">
    <svg className="w-[17px] h-[17px] block max-[600px]:w-[16px] max-[600px]:h-[16px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2H21.5l-7.11 8.128L22.75 22h-6.6l-5.17-6.76L5.06 22H1.8l7.6-8.686L1.25 2h6.77l4.67 6.17L18.244 2Zm-1.15 17.89h1.8L7.02 4.02H5.09l12.004 15.87Z"/>
    </svg>
  </a>

  <a className="w-[34px] h-[34px] flex items-center justify-center border border-[#ff2f68] rounded-[50%] text-[#ffffff] bg-[transparent] [transition:all_0.25s_ease] hover:bg-[#ff2f68] hover:text-[#ffffff] hover:transform-[translateY(-2px)] max-[600px]:w-[32px] max-[600px]:h-[32px]" href="#" aria-label="YouTube">
    <svg className="w-[17px] h-[17px] block max-[600px]:w-[16px] max-[600px]:h-[16px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.12C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.4.58A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.12c1.86.58 9.4.58 9.4.58s7.54 0 9.4-.58a3 3 0 0 0 2.1-2.12A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.5v-7l6.3 3.5-6.3 3.5Z"/>
    </svg>
  </a>

  <a className="w-[34px] h-[34px] flex items-center justify-center border border-[#ff2f68] rounded-[50%] text-[#ffffff] bg-[transparent] [transition:all_0.25s_ease] hover:bg-[#ff2f68] hover:text-[#ffffff] hover:transform-[translateY(-2px)] max-[600px]:w-[32px] max-[600px]:h-[32px]" href="#" aria-label="Instagram">
    <svg className="w-[17px] h-[17px] block max-[600px]:w-[16px] max-[600px]:h-[16px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5"/>

      <circle cx="12" cy="12" r="4"/>

      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  </a>

    </div>

    </div>


    {/* QUICK LINKS */}
    <div  className="pt-[4px]">

      <h3 className="m-[0_0_24px] text-[#ffffff] font-commissioner text-[22px] font-bold leading-[1.2] max-[900px]:text-[20px] max-[600px]:mb-[18px] max-[600px]:text-[18px] max-[420px]:text-[19px]">Quick Links</h3>

      <Link className="mb-3 flex items-start gap-2 font-nunito text-[16px] font-normal leading-[1.55] text-white transition-colors hover:text-[#ff2f68] max-sm:text-[14px]" href="/"><ChevronRight size={16} className="mt-1 shrink-0 text-[#ff2f68]" aria-hidden="true" /><span>Home</span></Link>
      <Link className="mb-3 flex items-start gap-2 font-nunito text-[16px] font-normal leading-[1.55] text-white transition-colors hover:text-[#ff2f68] max-sm:text-[14px]" href="/about"><ChevronRight size={16} className="mt-1 shrink-0 text-[#ff2f68]" aria-hidden="true" /><span>About</span></Link>
      <Link className="mb-3 flex items-start gap-2 font-nunito text-[16px] font-normal leading-[1.55] text-white transition-colors hover:text-[#ff2f68] max-sm:text-[14px]" href="/technology"><ChevronRight size={16} className="mt-1 shrink-0 text-[#ff2f68]" aria-hidden="true" /><span>Care Technology</span></Link>
      <Link className="mb-3 flex items-start gap-2 font-nunito text-[16px] font-normal leading-[1.55] text-white transition-colors hover:text-[#ff2f68] max-sm:text-[14px]" href="/jobs"><ChevronRight size={16} className="mt-1 shrink-0 text-[#ff2f68]" aria-hidden="true" /><span>Job Listing</span></Link>
      <Link className="mb-3 flex items-start gap-2 font-nunito text-[16px] font-normal leading-[1.55] text-white transition-colors hover:text-[#ff2f68] max-sm:text-[14px]" href="/pricing"><ChevronRight size={16} className="mt-1 shrink-0 text-[#ff2f68]" aria-hidden="true" /><span>Pricing</span></Link>
      <Link className="mb-3 flex items-start gap-2 font-nunito text-[16px] font-normal leading-[1.55] text-white transition-colors hover:text-[#ff2f68] max-sm:text-[14px]" href="/contact"><ChevronRight size={16} className="mt-1 shrink-0 text-[#ff2f68]" aria-hidden="true" /><span>Contact Us</span></Link>

    </div>


    {/* RESOURCES */}
    <div  className="pt-[4px]">

      <h3 className="m-[0_0_24px] text-[#ffffff] font-commissioner text-[22px] font-bold leading-[1.2] max-[900px]:text-[20px] max-[600px]:mb-[18px] max-[600px]:text-[18px] max-[420px]:text-[19px]">Resources</h3>

      <Link className="mb-3 flex items-start gap-2 font-nunito text-[16px] font-normal leading-[1.55] text-white transition-colors hover:text-[#ff2f68] max-sm:text-[14px]" href="/faqs"><ChevronRight size={16} className="mt-1 shrink-0 text-[#ff2f68]" aria-hidden="true" /><span>FAQs</span></Link>
      <Link className="mb-3 flex items-start gap-2 font-nunito text-[16px] font-normal leading-[1.55] text-white transition-colors hover:text-[#ff2f68] max-sm:text-[14px]" href="/blogs"><ChevronRight size={16} className="mt-1 shrink-0 text-[#ff2f68]" aria-hidden="true" /><span>News</span></Link>
      <Link className="mb-3 flex items-start gap-2 font-nunito text-[16px] font-normal leading-[1.55] text-white transition-colors hover:text-[#ff2f68] max-sm:text-[14px]" href="/terms"><ChevronRight size={16} className="mt-1 shrink-0 text-[#ff2f68]" aria-hidden="true" /><span>Terms &amp; Conditions</span></Link>
      <Link className="mb-3 flex items-start gap-2 font-nunito text-[16px] font-normal leading-[1.55] text-white transition-colors hover:text-[#ff2f68] max-sm:text-[14px]" href="/privacy-policy"><ChevronRight size={16} className="mt-1 shrink-0 text-[#ff2f68]" aria-hidden="true" /><span>Privacy Policy</span></Link>

    </div>


    {/* GET IN TOUCH */}
    <div  className="max-[600px]:col-span-full max-[420px]:col-auto pt-[4px]">

      <h3 className="m-[0_0_24px] text-[#ffffff] font-commissioner text-[22px] font-bold leading-[1.2] max-[900px]:text-[20px] max-[600px]:mb-[18px] max-[600px]:text-[18px] max-[420px]:text-[19px]">Get in Touch</h3>

      <a className="relative items-start gap-[10px] mb-[18px] text-[#ffffff] font-nunito text-[16px] font-normal leading-[1.55] [transition:color_0.2s_ease] hover:text-[#ff2f68] grid min-w-0 grid-cols-[23px_minmax(0,1fr)] break-words max-[900px]:text-[14px] max-[600px]:mb-[15px] max-[600px]:text-[14px]" href="mailto:hello@my-carer.co.uk">

        <span  className="flex items-start justify-start pt-[2px] text-[#ff2f68]">
          <svg className="w-[21px] h-[21px]" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <rect x="3" y="5" width="18" height="14" rx="2"/>
            <path d="m3 7 9 6 9-6"/>
          </svg>
        </span>

        <span>
          hello@my-carer.co.uk<br />
          support@my-carer.co.uk
        </span>

      </a>


      <a className="relative items-start gap-[10px] mb-[18px] text-[#ffffff] font-nunito text-[16px] font-normal leading-[1.55] [transition:color_0.2s_ease] hover:text-[#ff2f68] grid min-w-0 grid-cols-[23px_minmax(0,1fr)] break-words max-[900px]:text-[14px] max-[600px]:mb-[15px] max-[600px]:text-[14px]" href="#">

        <span  className="flex items-start justify-start pt-[2px] text-[#ff2f68]">
          <svg className="w-[21px] h-[21px]" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/>
            <circle cx="12" cy="10" r="2.5"/>
          </svg>
        </span>

        <span>
          Shawbriggs, Barrow Road<br />
          Goxhill, NorthDN19 7LN
        </span>

      </a>


      <a className="relative items-start gap-[10px] mb-[18px] text-[#ffffff] font-nunito text-[16px] font-normal leading-[1.55] [transition:color_0.2s_ease] hover:text-[#ff2f68] grid min-w-0 grid-cols-[23px_minmax(0,1fr)] break-words max-[900px]:text-[14px] max-[600px]:mb-[15px] max-[600px]:text-[14px]" href="tel:01482688508">

        <span  className="flex items-start justify-start pt-[2px] text-[#ff2f68]">
          <svg className="w-[21px] h-[21px]" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2
              19.79 19.79 0 0 1-8.63-3.07
              19.5 19.5 0 0 1-6-6
              A19.79 19.79 0 0 1 2.12 4.18
              2 2 0 0 1 4.11 2h3
              a2 2 0 0 1 2 1.72
              12.84 12.84 0 0 0 .7 2.81
              2 2 0 0 1-.45 2.11L8.09 9.91
              a16 16 0 0 0 6 6l1.27-1.27
              a2 2 0 0 1 2.11-.45
              12.84 12.84 0 0 0 2.81.7
              A2 2 0 0 1 22 16.92Z"/>
          </svg>
        </span>

        <span>
          01482 688508
        </span>

      </a>

    </div>

  </div>


  {/* FOOTER BOTTOM */}

  <div  className="max-[1200px]:w-[calc(100%_-_60px)] max-[900px]:text-[13px] max-[600px]:w-[calc(100%_-_40px)] max-[600px]:flex-col max-[600px]:items-start max-[600px]:gap-[12px] max-[600px]:text-[12px] max-[1050px]:w-[calc(100%_-_40px)] max-[520px]:w-[calc(100%_-_30px)] max-[520px]:items-start max-[520px]:flex-col max-[520px]:gap-[10px] w-[min(1240px,_calc(100%_-_80px))] m-[0_auto] pt-[18px] border-t-[2px] border-t-[rgba(255,_255,_255,_0.2)] flex items-center justify-between text-[#ffffff] font-nunito text-[15px] leading-[1.5]">

    <div>
      © 2026 <strong className="text-[#ff2f68] font-semibold">My Carer</strong>. All Rights Reserved.
    </div>

    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 max-sm:text-[13px]">
      <Link className="text-[#ffffff] [transition:color_0.2s_ease] hover:text-[#ff2f68]" href="/terms">Terms &amp; Conditions</Link>

      <span className="text-[#ff2f68]">|</span>

      <Link className="text-[#ffffff] [transition:color_0.2s_ease] hover:text-[#ff2f68]" href="/privacy-policy">Privacy Policy</Link>
    </div>

  </div>

    </footer>);
}
