import React from 'react';
import { Mail, Twitter, Globe, Github} from 'lucide-react';
import CyberpunkPerlin from './CyberpunkPerlin';

const CyberpunkContact = () => {
  const contactItems = [
    { icon: <Mail className="w-5 h-5" />, label: 'メール', value: 'snowclipsed@gmail.com' },
    { icon: <Twitter className="w-5 h-5" />, label: 'ツイッター', value: '@snowclipsed', link: 'https://x.com/snowclipsed' },
    { icon: <Globe className="w-5 h-5" />, label: 'ウェブサイト', value: 'snowclipsed.xyz' },
    { icon: <Github className="w-5 h-5" />, label: 'ギットハブ', value: 'snowclipsed', link: 'https://github.com/snowclipsed' }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Dimensional Flow Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">ディメンショナル・フロー / DIMENSIONAL FLOW</h2>
        </div>
        <div className="border transition-colors duration-100 dark:border-white border-black">
          <CyberpunkPerlin />
        </div>
      </div>

      {/* Contact Header */}
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold">コンタクト / CONTACT</h2>
      </div>

      {/* Contact Grid - Clean Version */}
      <div className="space-y-4">
        {contactItems.map((item) => (
          <div 
            key={item.label}
            className="border transition-colors duration-100 dark:border-white border-black p-6 relative group hover:bg-black/5 dark:hover:bg-white/5"
          >
            <div className="flex items-center gap-6">
              <div className="w-5 flex-shrink-0">
                {item.icon}
              </div>

              <div className="flex flex-col">
                <p className="text-sm opacity-70 mb-1">{item.label}</p>
                {item.link ? (
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-blue-500 transition-colors duration-100 font-mono"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="font-mono">
                    {item.value}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* About Section */}
      <div className="border transition-colors duration-100 dark:border-white border-black">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">リサーチ＆コラボレーション / RESEARCH & COLLABORATION</h2>
          <p className="font-mono opacity-80">
            Feel free to reach out for collaboration, research discussions, 
            or just to chat about machine learning and technology. I&apos;m always 
            interested in connecting with fellow researchers and developers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CyberpunkContact;