import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#2a2a2a] bg-[#1a1a1a] py-6 text-center text-xs text-gray-500">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 gap-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-300">DSA OS</span>
          <span>•</span>
          <span>100% Static & Client-Side Practice Platform</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/mohdshamii/DSAos"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition-colors"
          >
            GitHub Repository
          </a>
          <span>•</span>
          <span>250 MNC Placement Problems</span>
        </div>
      </div>
    </footer>
  );
};
