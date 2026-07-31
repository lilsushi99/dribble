interface ManifestoSectionProps {
  onOpenBookCall?: () => void;
}

export default function ManifestoSection({ onOpenBookCall }: ManifestoSectionProps) {
  const principles = [
    {
      num: '01',
      title: 'Architectural Craft',
      body: 'Every digital structure is constructed with physical weight and tactile precision. We reject throwaway design trends in favor of enduring form.',
    },
    {
      num: '02',
      title: 'Sequential Storytelling',
      body: 'Interaction is a dialogue. We design motion as sequential keyframes that guide attention naturally through space and time.',
    },
    {
      num: '03',
      title: 'Uncompromised Performance',
      body: 'Speed is an aesthetic parameter. Code is optimized to render with zero latency, fluid frame rates, and zero clutter.',
    },
  ];

  return (
    <section
      id="section-blog"
      className="card-section relative w-full min-h-screen py-24 px-6 sm:px-16 bg-[#050505] rounded-[28px] sm:rounded-[36px] overflow-hidden border border-white/10 shadow-2xl flex flex-col justify-between"
    >
      {/* Main Header */}
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h2 className="font-outfit text-3xl sm:text-5xl md:text-6xl font-light text-[#f3f3f3] tracking-tight leading-tight">
          We construct timeless digital artifacts for an uncompromising era.
        </h2>
        <p className="font-inter text-base sm:text-lg text-[#9a9a9e] max-w-2xl mx-auto font-normal leading-relaxed">
          Operating as an elite design and engineering laboratory, KINETIC collaborates exclusively with founders and brands seeking monumental distinction.
        </p>
      </div>

      {/* Studio Principles Grid */}
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8 my-16">
        {principles.map((item) => (
          <div
            key={item.num}
            className="p-8 sm:p-10 rounded-2xl bg-[#0a0a0c] border border-white/10 flex flex-col justify-between space-y-6 hover:border-white/25 transition-colors duration-300 shadow-xl"
          >
            <span className="font-inter text-xs text-[#c5a880] tracking-widest font-medium">
              {item.num}
            </span>
            <div className="space-y-3">
              <h3 className="font-outfit text-2xl text-[#f3f3f3] font-light">
                {item.title}
              </h3>
              <p className="font-inter text-sm text-[#9a9a9e] leading-relaxed">
                {item.body}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA Banner */}
      <div className="max-w-3xl mx-auto w-full text-center border-t border-white/10 pt-12">
        <p className="font-inter text-sm text-[#9a9a9e] mb-6">
          Ready to transform your brand architecture into an enduring statement?
        </p>
        <button
          onClick={onOpenBookCall}
          className="bg-[#2b5c8f] hover:bg-[#234c77] text-white rounded-full px-8 py-3.5 text-sm font-medium tracking-wide transition-all duration-300 active:scale-98 cursor-pointer shadow-xl shadow-[#2b5c8f]/20"
        >
          Initiate Inquiry
        </button>
      </div>
    </section>
  );
}
