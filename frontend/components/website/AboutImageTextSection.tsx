import Image from "next/image";

type Props = {
  title: "Mission" | "Story";
  image: string;
  imageAlt: string;
  paragraphs: string[];
  imageOnRight?: boolean;
};

export default function AboutImageTextSection({ title, image, imageAlt, paragraphs, imageOnRight = false }: Props) {
  return (
    <section id={`our-${title.toLowerCase()}`} className="bg-white py-[85px] max-md:py-[60px]">
      <div className="mx-auto grid w-[calc(100%-60px)] max-w-[1100px] grid-cols-2 items-center gap-6 max-md:w-[calc(100%-30px)] max-md:grid-cols-1 max-md:gap-8">
        <div className={`relative h-[520px] overflow-hidden rounded-[10px] max-sm:h-[300px] ${imageOnRight ? "md:order-2" : ""}`}>
          <Image src={image} alt={imageAlt} fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover" />
        </div>
        <div className={`min-w-0 ${imageOnRight ? "md:order-1" : ""}`}>
          <h2 className="mb-5 font-commissioner text-[40px] font-bold leading-[1.15] tracking-[-1px] text-[#101929] max-sm:text-[28px]">
            Our <span className="text-[#ff2f68]">{title}</span>
          </h2>
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="mb-4 font-nunito text-[18px] font-medium leading-[1.7] text-[#46505e] last:mb-0 max-sm:text-[16px]">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
