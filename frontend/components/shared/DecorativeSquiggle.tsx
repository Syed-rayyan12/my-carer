export default function DecorativeSquiggle({ dark = false, className = "" }: {
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={`absolute w-[38px] font-georgia text-[30px] leading-[0.48] -rotate-[15deg] opacity-90 ${dark ? "text-[#101929]" : "text-[#ff2f68]"} ${className}`} aria-hidden="true">
      ∿<br />∿<br />∿
    </div>
  );
}
