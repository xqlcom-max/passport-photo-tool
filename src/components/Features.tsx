export default function Features() {
  const features = [
    {
      icon: '🇺🇸',
      color: 'bg-blue-50',
      name: 'US Passport Compliant',
      desc: 'Meets all US State Department requirements: 2x2 inches, proper head size, eye position, and white background.',
    },
    {
      icon: '⚡',
      color: 'bg-emerald-50',
      name: 'Smart Crop & Resize',
      desc: 'AI-powered face detection automatically crops and positions your head correctly.',
    },
    {
      icon: '⏱️',
      color: 'bg-amber-50',
      name: 'Instant Results',
      desc: 'No waiting, no appointments. Upload and download in seconds.',
    },
    {
      icon: '💰',
      color: 'bg-green-50',
      name: 'Save Money',
      desc: 'Drugstore photos cost $15+. Here, the basic version is free.',
    },
  ];

  return (
    <section className="py-16 border-t border-gray-100">
      <div className="max-w-[640px] mx-auto px-6">
        <h2 className="font-extrabold text-2xl text-center mb-10 tracking-[-0.5px]">Why Passport Photo Tool?</h2>
        <div className="grid grid-cols-2 gap-4">
          {features.map((f, i) => (
            <div key={i} className="p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-xl ${f.color}`}>
                {f.icon}
              </div>
              <p className="font-semibold text-[15px] mb-1">{f.name}</p>
              <p className="text-[13px] text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
