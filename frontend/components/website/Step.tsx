export default function Step({ number, title, text, }: {
    number: string;
    title: string;
    text: string;
}) {
    return (<article  className="max-[520px]:text-center group/style5 relative">

      <div  className="max-[520px]:text-center max-[520px]:m-[0_auto] relative z-[2] w-[42px] h-[42px] flex items-center justify-center border border-[#ff2f68] rounded-[50%] bg-[#fff] text-[#ff2f68] font-commissioner text-[11px] font-bold">
        {number}
      </div>

      <div  className="group-last/style5:hidden max-[520px]:text-center max-[520px]:hidden absolute top-[21px] left-[42px] right-[-25px] h-[1px] bg-[#ffc5d2]"/>

      <h3 className="m-[17px_0_8px] text-[#101929] font-commissioner text-[14px] font-extrabold">{title}</h3>

      <p className="max-w-[220px] m-[0] text-[#626b78] text-[10px] leading-[1.65] max-[520px]:max-w-[100%] max-[520px]:m-[0_auto]">{text}</p>

    </article>);
}
