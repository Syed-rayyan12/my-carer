import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

export default function CareCTASection() {
  return (
    <section className="relative flex min-h-[400px] items-center max-[500px]:min-h-[350px] max-[600px]:py-10">
      <div className="absolute inset-0">
        <img
          src="/images/full-section.png"
          alt="A care professional supporting an older woman at home"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="relative z-2 mx-auto w-[calc(100%-60px)] max-w-[1240px] max-[1050px]:w-[calc(100%-40px)] max-[500px]:w-[calc(100%-30px)] max-[500px]:text-center">
        <h2 className="mt-0 mb-2.5 font-commissioner text-[54px] leading-tight font-bold max-[900px]:text-[40px] text-white max-[500px]:text-[30px]">
          Ready To Find The Right Care?
        </h2>
        <p className="mt-0 mb-5 max-w-[620px] font-nunito font-medium text-[18px] leading-[1.7] text-white/95 max-[500px]:text-[15px]">
          Whether you&apos;re looking for care or ready to offer your
          services, My Carer makes it easier to connect with the right
          people.
        </p>

        <div className="flex items-center gap-2 max-[500px]:flex-col max-[500px]:justify-center">
          <Link
            href="/#caregivers"
            className="inline-flex min-h-12 items-center transition-all justify-center gap-2 rounded-[5px] bg-[#ff2f68] px-[25px] text-[16px] font-normal text-white transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-[#e92359]"
          >
            Browse Caregivers
         
          </Link>

          <div className="flex items-center gap-[6px]">
            <div className="flex h-[45px] w-[45px] items-center border border-white justify-center rounded-full bg-[#101929] text-white">
              <Phone size={18} className="text-white" />
            </div>
            <div>
              <span className="text-[14.4px] font-nunito font-medium leading-[1.2] text-white">Call Us</span>
              <strong className="block text-[16px] font-nunito font-bold text-white">123-456-7890</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
