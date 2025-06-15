import React from 'react';

const TrustedCompanies = () => {
  const companies = [
    { name: 'Google', logo: 'https://images.pexels.com/photos/270700/pexels-photo-270700.jpeg?auto=compress&cs=tinysrgb&w=120&h=60' },
    { name: 'Microsoft', logo: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=120&h=60' },
    { name: 'Airbnb', logo: 'https://images.pexels.com/photos/6963944/pexels-photo-6963944.jpeg?auto=compress&cs=tinysrgb&w=120&h=60' },
    { name: 'HubSpot', logo: 'https://images.pexels.com/photos/270700/pexels-photo-270700.jpeg?auto=compress&cs=tinysrgb&w=120&h=60' },
    { name: 'Walmart', logo: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=120&h=60' },
    { name: 'FedEx', logo: 'https://images.pexels.com/photos/6963944/pexels-photo-6963944.jpeg?auto=compress&cs=tinysrgb&w=120&h=60' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60 hover:opacity-80 transition-opacity">
          {companies.map((company, index) => (
            <div key={index} className="flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                {company.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedCompanies;