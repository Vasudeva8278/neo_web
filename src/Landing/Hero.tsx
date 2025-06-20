
import React, { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const Hero = () => {


  const templates = [
    {
      id: 1,
      content: (
        <div className="w-60 h-64 bg-gradient-to-br from-purple-700 to-purple-900 rounded-2xl shadow-2xl p-4 flex flex-col justify-center items-center text-center">
          <h3 className="text-white font-black text-lg">BLACK</h3>
          <h3 className="text-white font-black text-lg">FRIDAY</h3>
          <h3 className="text-white font-black text-lg">SALE</h3>
          <div className="mt-2 text-yellow-400 text-sm font-bold">UP TO 70% OFF</div>
        </div>
      ),
    },
    {
      id: 2,
      content: (
        <div className="w-60 h-64 bg-yellow-400 rounded-2xl shadow-2xl p-4 flex flex-col justify-center items-center text-center">
          <div className="w-16 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3">
            <span className="text-white text-xs font-bold">LOGO</span>
          </div>
          <h3 className="text-white font-black text-xl">OUR</h3>
          <h3 className="text-white font-black text-xl">BUSINESS</h3>
        </div>
      ),
    },
    {
      id: 3,
      content: (
        <div className="w-60 h-64 bg-gradient-to-br from-gray-500 to-neutral-700 rounded-2xl shadow-2xl p-4 flex flex-col justify-center items-center text-center">
          <span className="text-blue-900 text-xs font-bold mb-2">TRAVEL</span>
          <h3 className="text-blue-900 font-black text-lg">Enjoy Your</h3>
          <h3 className="text-blue-900 font-black text-lg">Vacation</h3>
          <h3 className="text-blue-900 font-black text-lg">With Us</h3>
        </div>
      ),
    },
    {
      id: 4,
      content: (
        <div className="w-60 h-64 bg-gradient-to-br from-purple-800 via-purple-900 to-indigo-900 rounded-2xl shadow-2xl p-4 flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-4">
            <span className="text-purple-900 text-2xl font-bold">🎓</span>
          </div>
          <h3 className="text-yellow-400 font-black text-xl">BACK</h3>
          <h3 className="text-yellow-400 font-black text-xl">TO</h3>
          <h3 className="text-yellow-400 font-black text-xl">SCHOOL</h3>
        </div>
      ),
    },
    {
      id: 5,
      content: (
        <div className="w-60 h-64 bg-red-500 rounded-2xl shadow-2xl p-4 flex flex-col justify-center items-center text-center">
          <h3 className="text-white font-black text-lg mb-2">GET UP TO</h3>
          <h3 className="text-yellow-300 font-black text-4xl mb-2">60%</h3>
          <h3 className="text-white font-black text-lg">OFF</h3>
        </div>
      ),
    },
    {
      id: 6,
      content: (
        <div className="w-60 h-64 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-2xl shadow-2xl p-4 flex flex-col justify-center items-center text-center">
          <div className="text-yellow-400 text-xs font-bold mb-2">SPECIAL OFFER</div>
          <h3 className="text-white font-black text-xl">CRYPTO</h3>
          <h3 className="text-yellow-300 font-black text-2xl">MONDAY</h3>
          <div className="mt-2 text-white text-sm font-bold">35% OFF</div>
        </div>
      ),
    },
    {
      id: 7,
      content: (
        <div className="w-60 h-64 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 rounded-2xl shadow-2xl p-4 flex flex-col justify-center items-center text-center">
          <h3 className="text-white font-black text-sm mb-1">BLACK FRIDAY</h3>
          <h3 className="text-white font-black text-sm mb-2">SALE</h3>
          <h3 className="text-yellow-300 font-black text-lg mb-1">UP TO</h3>
          <h3 className="text-yellow-300 font-black text-xl">50% OFF</h3>
        </div>
      ),
    },
    {
      id: 8,
      content: (
        <div className="w-60 h-64 bg-gradient-to-br from-slate-600 to-slate-800 rounded-2xl shadow-2xl p-4 flex flex-col justify-center items-center text-center">
          <div className="w-16 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3">
            <span className="text-white text-xs font-bold">LOGO</span>
          </div>
          <h3 className="text-white font-black text-xl">OUR</h3>
          <h3 className="text-white font-black text-xl">BUSINESS</h3>
        </div>
      ),
    },
  ];

  const visibleCount = 6;
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide + visibleCount < templates.length) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };
  return (
    <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Transform Your Imagination Into Beautiful Designs In{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 italic">
              Just a Few Clicks.
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
          </p>
          <button className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
            Start Creating Template
          </button>
        </div>

        {/* Template Showcase */}
        <section className="py-16 px-6 relative ">
          <div className="relative h-50 flex items-center justify-center">
            <div className="overflow-hidden px-10">
              <div
                className="flex gap-6 transition-transform duration-500"
                style={{
                  transform: `translateX(-${currentSlide * (15.5)}rem)` // 15.5rem includes card width + gap
                }}
              >
                {templates.map((template) => (
                  <div key={template.id} className="flex-shrink-0">
                    {template.content}
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-white group z-50"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600 group-hover:text-blue-600" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-white group z-50"
            >
              <ChevronRight className="h-6 w-6 text-gray-600 group-hover:text-blue-600" />
            </button>
          </div>
        </section>
      </div>
    </section>
  );
};

export default Hero;