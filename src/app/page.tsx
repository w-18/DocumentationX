"use client";

import useTypingEffect from "@/hooks/useTypingEffect";

export default function Home() {
  const subtext1 = useTypingEffect(`Transform your technical content into professional documentation with our intuitive builder. Perfect for developers, teams, and companies who value clarity and style.`, 250)
  return (
    <div className="min-h-screen text-white">
      <div className="container mx-auto px-4 py-20 2xl:py-32">
        <div className="max-w-7xl mx-auto text-center"> {/* Increased max-width */}
          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 lg:mb-10 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Build Stunning Documentation
            <br />
            <span className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl">Without the Headache</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl lg:text-3xl xl:text-3xl text-gray-300 mb-12 lg:mb-20 max-w-4xl xl:max-w-5xl mx-auto">
            {subtext1}
          </p>

          {/* Key Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 xl:mb-24 xl:gap-12">
            {[
              {icon: '🚀', title: 'User-friendly setup', text: 'Lorem ipsum odor amet, consectetuer adipiscing elit.'},
              {icon: '🎨', title: 'Notes & warnings', text: 'Lorem ipsum odor amet, consectetuer adipiscing elit.'},
              {icon: '🤑', title: 'Coems', text: 'Real-Time coems transformation'},
              {icon: '📤', title: 'Instant Publishing', text: 'Lorem ipsum odor amet, consectetuer adipiscing elit.'},
            ].map((feature, index) => (
              <div key={index} className="p-6 lg:p-8 xl:p-10 bg-white/10 rounded-xl xl:rounded-2xl backdrop-blur-sm hover:bg-white/20 transition-all">
                <div className="text-4xl lg:text-5xl mb-4 xl:mb-6">{feature.icon}</div>
                <h3 className="text-xl lg:text-2xl xl:text-2xl font-semibold mb-2 xl:mb-4">{feature.title}</h3>
                <p className="text-gray-300 lg:text-lg xl:text-xl">{feature.text}</p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20 xl:mb-28">
            <button 
              onClick={() => {}}
              className="px-8 py-4 lg:px-12 lg:py-5 xl:px-14 xl:py-6 bg-blue-600 hover:bg-blue-700 text-lg lg:text-xl xl:text-2xl font-semibold rounded-xl xl:rounded-2xl transition-all transform hover:scale-105"
            >
              Start Building Free
            </button>
            <button className="px-8 py-4 lg:px-12 lg:py-5 xl:px-14 xl:py-6 border border-white/20 hover:border-white/40 text-lg lg:text-xl xl:text-2xl font-semibold rounded-xl xl:rounded-2xl transition-all">
              Watch Demo Video
            </button>
          </div>

          {/* Preview Section */}
          <div className="rounded-2xl xl:rounded-3xl p-8 xl:p-12 shadow-2xl mx-auto max-w-6xl 2xl:max-w-7xl">
            <div className="mockup-window bg-gray-900">
              <div className="flex justify-center px-4 py-16 lg:py-20 xl:py-24 bg-gray-800">
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl xl:text-5xl mb-4 xl:mb-6">📚 Live Preview</div>
                  <p className="text-gray-400 lg:text-lg xl:text-xl">Interactive documentation example</p>
                  <div className="mt-4 h-48 md:h-64 lg:h-80 w-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white/80 lg:text-xl xl:text-2xl">Note: This will be made soon.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}