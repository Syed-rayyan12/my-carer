import Link from "next/link";

export type LegalBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "link"; label: string; href: string; description?: string };

export type LegalSection = { title: string; blocks: LegalBlock[] };

export default function LegalDocument({ intro, sections }: { intro?: string[]; sections: LegalSection[] }) {
  return (
    <article className="mx-auto w-[min(1100px,calc(100%-60px))] py-[42px] font-nunito text-[13px] leading-[1.75] text-[#555] max-[600px]:w-[calc(100%-30px)] max-[600px]:py-7">
      {intro?.map((text) => <p key={text} className="mb-3">{text}</p>)}
      {sections.map((section) => (
        <section key={section.title} className="mb-5">
          <h2 className="mb-1 font-nunito text-[13px] font-semibold leading-[1.75] text-[#555]">{section.title}</h2>
          {section.blocks.map((block, index) => {
            if (block.type === "list") return <ul key={index} className="mb-3 list-disc space-y-0.5 pl-6">{block.items.map((item) => <li key={item}>{item}</li>)}</ul>;
            if (block.type === "link") return <p key={index} className="mb-3"><Link className="text-[#ff2d6f] hover:underline" href={block.href}>{block.label}</Link>{block.description && <span className="block">{block.description}</span>}</p>;
            return <p key={index} className="mb-3">{block.text}</p>;
          })}
        </section>
      ))}
    </article>
  );
}
