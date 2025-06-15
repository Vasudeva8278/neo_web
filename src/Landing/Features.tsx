import React from 'react';
import { FaBolt, FaInfinity } from 'react-icons/fa';

const Features = () => {
  return (
    <div>
      {/* Business Growth Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Get Your Business To Grow Fast
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sed ut vestibulum eget purus ornare. Risus elit et fringilla habitant ut facilisi.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-gray-400 text-sm">wr.app</span>
                  </div>
                  
                  <div className="grid grid-cols-6 gap-2 mb-4">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div key={i} className="aspect-square bg-gradient-to-br from-red-400 to-pink-500 rounded-lg"></div>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                    <span className="font-medium text-gray-700">Wanda Gordon</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center mb-6">
                <FaBolt className="w-8 h-8 text-indigo-600 mr-3" />
                <span className="text-indigo-600 font-semibold uppercase tracking-wide">NO LIMITS</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Unlimited Ideas For Your Projects
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim 
                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea 
                commodo consequat. Duis aute irure dolor in reprehenderit in voluptate 
                velit esse cillum dolore eu fugiat nulla pariatur.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Feature Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center mb-6">
                <FaInfinity className="w-8 h-8 text-purple-600 mr-3" />
                <span className="text-purple-600 font-semibold uppercase tracking-wide">ENDLESS POSSIBILITIES</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Create Stunning Designs Effortlessly
              </h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Transform your creative vision into reality with our powerful design tools. 
                Whether you're creating social media posts, business presentations, or 
                marketing materials, our platform provides everything you need to make 
                professional designs in minutes.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  <span className="text-gray-700">Drag & Drop Interface</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span className="text-gray-700">Premium Templates</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  <span className="text-gray-700">Team Collaboration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span className="text-gray-700">Cloud Storage</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className={`aspect-square rounded-xl bg-gradient-to-br ${
                      i % 3 === 0 ? 'from-blue-400 to-indigo-500' :
                      i % 3 === 1 ? 'from-purple-400 to-pink-500' :
                      'from-green-400 to-teal-500'
                    }`}></div>
                  ))}
                </div>
                <div className="text-center">
                  <h4 className="font-bold text-gray-900 mb-2">Design Library</h4>
                  <p className="text-gray-600 text-sm">1,000+ Premium Templates</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;