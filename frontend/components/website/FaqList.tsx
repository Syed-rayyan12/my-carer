const questions = [
  "Is VAT included in the prices?",
  "What are the contract terms?",
  "How does the 12-month rolling contract work?",
  "What payment methods do you accept?",
  "How does the free 3-month trial work?",
  "When will I be charged?",
  "How does the 12-month rolling contract work?",
  "What payment methods do you accept?",
  "Is VAT included in the prices?",
  "What are the contract terms?",
];

const sampleAnswer = "This answer is sample copy for the page design. Please contact the My Carer team for current information about plans and services.";

export default function FaqList() {
  return (
    <section className="mx-auto w-[min(1100px,calc(100%-60px))] py-[52px] max-[600px]:w-[calc(100%-30px)] max-[600px]:py-8">
      <div className="rounded-[9px] bg-[#f4f4f4] p-[26px] max-[600px]:p-4">
        <h2 className="mb-[22px] font-commissioner text-[40px] font-extrabold leading-tight tracking-[-1.2px] text-black max-[600px]:text-[30px]">
          General <span className="text-[#ff2f68]">Questions</span>
        </h2>
        <div className="space-y-[14px]">
          {questions.map((question, index) => (
            <details key={`${question}-${index}`} open={index === 0} className="group rounded-[9px] bg-white px-5 py-[17px] text-[#343434] open:pb-[20px] max-[600px]:px-4">
              <summary className="[&::-webkit-details-marker]:hidden flex cursor-pointer list-none items-center justify-between gap-4 font-nunito text-[16px] font-medium max-[600px]:text-[14px]">
                {question}
                <span aria-hidden="true" className="shrink-0 font-nunito text-[23px] font-light leading-none text-[#ff2f68] group-open:hidden">+</span>
                <span aria-hidden="true" className="hidden shrink-0 font-nunito text-[23px] font-light leading-none text-[#ff2f68] group-open:inline">−</span>
              </summary>
              <p className="mt-[17px] pr-8 font-nunito text-[13px] leading-[1.8] text-[#666]">{sampleAnswer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
