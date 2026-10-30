import { Fragment } from "react";

function inline(text: string) {
  return text.split(/(\*\*[^*]+\*\*|_[^_]+_|\[[^\]]+\]\(https?:\/\/[^\s)]+\))/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("_") && part.endsWith("_")) return <em key={index}>{part.slice(1, -1)}</em>;
    const link = /^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/.exec(part);
    return link ? <a key={index} href={link[2]} target="_blank" rel="noreferrer" className="text-[#ff2f68] underline">{link[1]}</a> : <Fragment key={index}>{part}</Fragment>;
  });
}
export default function BlogArticleBody({ content }: { content: string }) { return <div className="space-y-3 text-sm leading-6 text-[#61706c]">{content.split("\n").map((line, index) => line.startsWith("## ") ? <h3 key={index} className="pt-2 text-lg font-bold text-[#182522]">{inline(line.slice(3))}</h3> : line.startsWith("> ") ? <blockquote key={index} className="border-l-2 border-[#ff2f68] pl-4 italic">{inline(line.slice(2))}</blockquote> : line.startsWith("- ") ? <p key={index} className="pl-3">• {inline(line.slice(2))}</p> : line ? <p key={index}>{inline(line)}</p> : <br key={index} />)}</div>; }
