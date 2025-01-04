'use client';

import React from 'react';
import { Mail, Twitter, Globe } from 'lucide-react';
import CyberpunkPerlin from './CyberpunkPerlin';
import CyberpunkLorenz from './CyberpunkLorenz';

const CyberpunkContact = () => {
  const contactItems = [
    { icon: <Mail className="w-5 h-5" />, label: 'メール', value: 'snowclipsed@gmail.com' },
    { icon: <Twitter className="w-5 h-5" />, label: 'Twitter', value: '@snowclipsed', link: 'https://x.com/snowclipsed' },
    { icon: <Globe className="w-5 h-5" />, label: 'Website', value: 'snowclipsed.xyz' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Perlin Noise Visualization */}
      <div className="border transition-colors duration-100 dark:border-white border-black dark:bg-black bg-white">
        <CyberpunkPerlin />
      </div>

      {/* Contact Items */}
      <div className="space-y-4">
        {contactItems.map((item, index) => (
          <div 
            key={item.label}
            className="border transition-colors duration-100 dark:border-white border-black p-4 relative group cursor-pointer"
            style={{ 
              transform: `translateX(${index * 5}px)`,
              zIndex: contactItems.length - index 
            }}
          >
            {/* Icon with Glitch Effect */}
            <div className="relative inline-block">
              <div className="opacity-80 absolute -left-0.5 -top-0.5 text-red-500 pointer-events-none 
                group-hover:translate-x-1 transition-transform duration-100">
                {item.icon}
              </div>
              <div className="opacity-80 absolute -left-0.5 top-0.5 text-blue-500 pointer-events-none 
                group-hover:-translate-x-1 transition-transform duration-100">
                {item.icon}
              </div>
              {item.icon}
            </div>

            <div className="ml-4 inline-block">
              <p className="text-sm opacity-70 group-hover:opacity-100 transition-opacity duration-100">
                {item.label}
              </p>
              {item.link ? (
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-red-500 transition-colors duration-100"
                >
                  {item.value}
                </a>
              ) : (
                <p className="group-hover:text-blue-500 transition-colors duration-100">
                  {item.value}
                </p>
              )}
            </div>

            {/* Hover Border Animation */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-current to-transparent" />
              <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-current to-transparent" />
              <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-current to-transparent" />
              <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-current to-transparent" />
            </div>
          </div>
        ))}
      </div>

      {/* Optional: Additional Information Section */}
      <div className="border transition-colors duration-100 dark:border-white border-black p-4 mt-8">
        <h2 className="text-xl mb-4 flex items-center gap-2">
          <span className="text-blue-400 mr-2">▶</span>
          コミュニケーション / COMMUNICATION
        </h2>
        <p className="opacity-80 font-mono">
          Feel free to reach out for collaboration, research discussions, 
          or just to chat about machine learning and technology. I'm always 
          interested in connecting with fellow researchers and developers.
        </p>
      </div>
    </div>
  );
};

export default CyberpunkContact;