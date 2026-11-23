import { ArrowRight } from "lucide-react";
export default function NewsletterSection() {
  return (<section className="relative min-h-[245px] flex items-center justify-center p-[55px_20px] bg-[#ff2f68]">

    
    <div className="relative z-[2] w-full text-center">

      <h2 className="m-[0_0_9px] text-[#fff] font-commissioner text-[54px] font-bold max-[520px]:text-[29px]">
        Stay Connected With My Carer
       
      </h2>

      <p className="m-[0_auto_22px] text-[rgba(255,_255,_255,_0.95)] text-[18px] font-medium max-[520px]:text-[15px]">
        Get helpful advice, useful resources and the latest updates
        from My Carer delivered straight to your inbox.
      </p>

      <form className="max-[520px]:w-[100%] w-[460px] max-w-[100%] gap-2 m-[0_auto] p-[8px] flex items-center max-[480px]:flex-col max-[480px]:items-stretch bg-[#fff] rounded-[10px]">

        <input className="[flex:1] max-[480px]:flex-none min-w-[0] h-[42px] p-[0_13px] border-1 border-gray-500/40 [outline:none] rounded-[8px] text-[#101929] text-[16px] placeholder:text-[#a2a7ae] max-[520px]:text-[16px]" type="email" placeholder="Enter your Email" aria-label="Email address" />

        <button className="h-[44px] p-[0_18px] flex items-center justify-center gap-[6px] border-0 rounded-[8px] bg-[#ff2f68] text-[#fff] text-[16px] font-medium" type="submit">
          Subscribe Now
          <ArrowRight size={18} />
        </button>

      </form>

    </div>

  </section>);
}
