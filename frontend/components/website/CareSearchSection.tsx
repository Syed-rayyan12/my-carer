import { ChevronDown, Heart, MapPin, Search } from "lucide-react";

export default function CareSearchSection() {
  return (
    <section  className="max-[768px]:min-h-[auto] max-[768px]:mt-[-40px] max-[768px]:p-[0_15px] relative z-[15] min-h-[95px] mt-[-49px] bg-[transparent]" id="find-care" aria-label="Find a caregiver">
      <div  className="max-[768px]:w-[100%] max-[768px]:grid-cols-[1fr] max-[768px]:p-[16px] w-[min(1100px,_calc(100%_-_60px))] m-[0_auto] p-[6px] grid grid-cols-[1fr_1fr_0.7fr] gap-[12px] bg-[#fff] rounded-[16px] shadow-[0_8px_30px_rgb(16_25_41_/_10%)]">
        <label  className="focus-within:[border-color:#ff2f68] focus-within:[outline:2px_solid_rgb(255_47_104_/_20%)] focus-within:[outline-offset:2px] min-w-[0] min-h-[58px] flex items-center gap-[11px] p-[0_17px] bg-[#f3f4f6] border border-[#e5e7eb] rounded-[16px] text-[#858b95] text-[14px]">
          <MapPin className="shrink-0 text-[#ff2f68]" size={18} aria-hidden="true" />
          <input className="w-full min-w-[0] min-h-[56px] p-[0] border-0 [outline:none] bg-[transparent] text-[#101929] [font:inherit] placeholder:text-[#858b95] placeholder:opacity-[1]"
            type="text"
            name="location"
            aria-label="Postcode, town or city"
            placeholder="Enter postcode, town or city"
          />
        </label>

        <label  className="focus-within:[border-color:#ff2f68] focus-within:[outline:2px_solid_rgb(255_47_104_/_20%)] focus-within:[outline-offset:2px] min-w-[0] min-h-[58px] flex items-center gap-[11px] p-[0_17px] bg-[#f3f4f6] border border-[#e5e7eb] rounded-[16px] text-[#858b95] text-[14px] relative">
          <Heart className="shrink-0 text-[#ff2f68]" size={18} aria-hidden="true" />
          <select className="w-full min-w-[0] min-h-[56px] p-[0] border-0 [outline:none] bg-[transparent] text-[#101929] [font:inherit] appearance-none pr-[26px] cursor-pointer [&:has(option[value='']:checked)]:text-[#858b95]" name="careType" aria-label="Care type" defaultValue="">
            <option className="bg-[#fff] text-[#101929]" value="" disabled>Select Care Type</option>
            <option className="bg-[#fff] text-[#101929]" value="elderly-care">Elderly Care</option>
            <option className="bg-[#fff] text-[#101929]" value="dementia-care">Dementia Care</option>
            <option className="bg-[#fff] text-[#101929]" value="personal-care">Personal Care</option>
            <option className="bg-[#fff] text-[#101929]" value="companionship">Companionship</option>
            <option className="bg-[#fff] text-[#101929]" value="disability-care">Disability Care</option>
          </select>
          <ChevronDown className="shrink-0 text-[#ff2f68] absolute right-[17px] pointer-events-none"   size={18} aria-hidden="true" />
        </label>

        <button  className="hover:bg-[#e92359] min-h-[58px] flex items-center font-normal justify-center gap-[8px] border-0 rounded-[16px] bg-[#ff2f68] text-[#fff] text-[18px] [transition:0.2s_ease]" type="button">
          <Search size={18} aria-hidden="true" />
          Search Caregivers
        </button>
      </div>
    </section>
  );
}
