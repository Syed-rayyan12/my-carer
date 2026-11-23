import { cloneElement, isValidElement, type ReactNode } from "react";
export default function TrustCard({ icon, title, text, variant = "default", }: {
    icon: ReactNode;
    title: string;
    text: string;
    variant?: "default" | "about";
}) {
    return (<article  className={`hover:[border-color:#D5D5D5] hover:transform-[translateY(-6px)] max-[520px]:min-h-[120px] min-h-[135px] p-[20px_17px] flex flex-col items-start gap-[13px] border border-[#e2e4e8] rounded-[20px] bg-[#fff] [transition:0.25s_ease] ${variant === "about" ? "min-h-[158px] flex-col items-start gap-[7px] p-[16px]" : ""}`}>

      <div  className={`w-[43px] h-[43px] shrink-0 flex items-center justify-center rounded-[50%] text-[#ff2f68] bg-[#fff1f4] ${variant === "about" ? "w-[44px] h-[44px]" : ""}`}>
        {isValidElement<{ className?: string }>(icon) ? cloneElement(icon, { className: `${icon.props.className ?? ""} ${variant === "about" ? "w-[45px] h-[45px]" : ""}` }) : icon}
      </div>

      <div>
        
        <h3 className={`text-[#101929] font-commissioner font-bold leading-[1.3] ${variant === "about" ? "text-[13px] m-[0_0_5px]" : "text-[18px] m-[1px_0_6px]"}`}>{title}</h3>
        <p className={`font-nunito m-0 text-[#626b78] leading-[1.55] ${variant === "about" ? "text-[11px]" : "text-[16px]"}`}>{text}</p>
      </div>

    </article>);
}
