import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const templates = [
    {
      id: 1,
      title: 'Black Friday Sale',
      image: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=300&h=200',
      color: 'from-purple-600 to-indigo-600'
    },
    {
      id: 2,
      title: 'Our Business',
      image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=300&h=200',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 3,
      title: 'Enjoy Vacations',
      image: 'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=300&h=200',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      id: 4,
      title: 'Back to School',
      image: 'https://images.pexels.com/photos/289737/pexels-photo-289737.jpeg?auto=compress&cs=tinysrgb&w=300&h=200',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 5,
      title: 'Food Offers',
      image: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=300&h=200',
      color: 'from-red-500 to-yellow-500'
    },
    {
      id: 6,
      title: 'Cyber Monday',
      image: 'https://images.pexels.com/photos/5632379/pexels-photo-5632379.jpeg?auto=compress&cs=tinysrgb&w=300&h=200',
      color: 'from-indigo-600 to-purple-600'
    },
    {
      id: 7,
      title: 'Black Friday',
      image: 'https://images.pexels.com/photos/5632385/pexels-photo-5632385.jpeg?auto=compress&cs=tinysrgb&w=300&h=200',
      color: 'from-gray-700 to-blue-600'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(1, templates.length - 6));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.max(1, templates.length - 6)) % Math.max(1, templates.length - 6));
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
        <div className="relative">
          <div className="flex items-center justify-center mb-8">
            <button
              onClick={prevSlide}
              className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all mr-4 hover:bg-gray-50"
            >
              <FaChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            
            <div className="overflow-hidden max-w-6xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out gap-4"
                style={{ transform: `translateX(-${currentSlide * 280}px)` }}
              >
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="flex-shrink-0 w-64 h-40 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  >
                    <div className={`w-full h-full bg-gradient-to-br ${template.color} flex items-center justify-center relative`}>
                      <div className="absolute inset-0 bg-black/20"></div>
                      <h3 className="text-white font-bold text-lg z-10">{template.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={nextSlide}
              className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all ml-4 hover:bg-gray-50"
            >
              <FaChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;