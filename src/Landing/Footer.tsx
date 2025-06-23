"use client";
import React from 'react';
import { Youtube, Twitter, Instagram, Linkedin, Facebook } from 'lucide-react';
import { FaApple } from 'react-icons/fa';

export default function Footer() {
  const footerData = {
    categories: [
      "User Interface",
      "User Experience",
      "Digital Media",
      "Lifestyle",
      "Programming",
      "Animation"
    ],
    product: [
      "Pricing",
      "Overview",
      "Browse",
      "Accessibility",
      "Five"
    ],
    solutions: [
      "Brainstorming",
      "Ideation",
      "Wireframing",
      "Research"
    ],
    resources: [
      "Help Center",
      "Blog",
      "Tutorials"
    ],
    support: [
      "Contact Us",
      "Developers",
      "Documentation",
      "Integrations",
      "Reports",
      "Webinar"
    ],
    company: [
      "About",
      "Press",
      "Events",
      "Careers"
    ]
  };

  const socialIcons = [
    { icon: Youtube, label: "YouTube" },
    { icon: Facebook, label: "Facebook" },
    { icon: Twitter, label: "Twitter" },
    { icon: Instagram, label: "Instagram" },
    { icon: Linkedin, label: "LinkedIn" }
  ];

  const bottomLinks = [
    "Terms",
    "Privacy",
    "Contact"
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className=" px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">

          {/* Categories */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Categories
            </h3>
            <ul className="space-y-3">
              {footerData.categories.map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Product */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              {footerData.product.map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Solutions
            </h3>
            <ul className="space-y-3">
              {footerData.solutions.map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {footerData.resources.map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              {footerData.support.map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {footerData.company.map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex  md:flex-row md:items-center md:justify-between space-y-6 md:space-y-0">

            {/* Copyright */}
            <div className="text-sm text-gray-500">
              © 2023 Wrapp. All rights reserved
            </div>

            {/* Bottom Links */}
            <div className="flex items-center space-x-6">
              {bottomLinks.map((link, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  {link}
                </a>
              ))}
            </div>

            {/* Social Icons and App Store */}
            <div className="flex items-center space-x-4">
              {/* Social Icons */}
              <div className="flex items-center space-x-3">
                {socialIcons.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={index}
                      href="#"
                      className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      aria-label={social.label}
                    >
                      <IconComponent className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>

              {/* App Store Button */}
              <a
                href="#"
                className="inline-flex items-center bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6  rounded-sm flex items-center justify-center">
                    {/* <div className="w-4 h-4 bg-black rounded-sm"></div> */}
                     <FaApple className="w-6 h-6" />
                  </div>
                  <div className="text-xs">
                    <div className="text-gray-300 text-[5px] leading-none">Available on the</div>
                    <div className="font-semibold text-sm leading-none">App Store</div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}