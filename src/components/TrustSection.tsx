'use client';

export default function TrustSection() {
  const trustPoints = [
    {
      icon: '✓',
      title: 'Follows Official Guidelines',
      desc: 'Based on US Department of State passport photo requirements',
    },
    {
      icon: '🤖',
      title: 'AI-Powered Processing',
      desc: 'Automatic face detection, cropping, and alignment',
    },
    {
      icon: '⚡',
      title: 'Instant Results',
      desc: 'No manual editing, no waiting for appointments',
    },
    {
      icon: '🔒',
      title: '100% Secure & Private',
      desc: 'Photos processed in your browser, never uploaded to servers',
    },
  ];

  return (
    <section className="py-16 border-t border-gray-100">
      <div className="max-w-[640px] mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="font-extrabold text-2xl mb-3 tracking-[-0.5px]">
            Why You Can Trust Us
          </h2>
          <p className="text-gray-500 text-[15px]">
            Professional passport photos without the hassle
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {trustPoints.map((point, i) => (
            <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                {point.icon}
              </div>
              <div>
                <p className="font-semibold text-[14px] mb-0.5">{point.title}</p>
                <p className="text-[12px] text-gray-500 leading-relaxed">{point.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 社会证明 */}
        <div className="mt-10 p-6 bg-emerald-50 rounded-2xl text-center">
          <div className="flex justify-center gap-8 mb-4">
            <div>
              <p className="font-extrabold text-2xl text-emerald-600">500+</p>
              <p className="text-[12px] text-gray-500">Photos Generated</p>
            </div>
            <div>
              <p className="font-extrabold text-2xl text-emerald-600">10,000+</p>
              <p className="text-[12px] text-gray-500">Happy Users</p>
            </div>
            <div>
              <p className="font-extrabold text-2xl text-emerald-600">4.8★</p>
              <p className="text-[12px] text-gray-500">User Rating</p>
            </div>
          </div>
          <p className="text-[13px] text-gray-600">
            &ldquo;So easy! Got my passport photo in 30 seconds. Used it for my renewal and it was accepted.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
