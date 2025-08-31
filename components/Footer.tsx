import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#121317] border-t border-[#27272A]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-sm text-[#A1A1AA]">
            &copy; {new Date().getFullYear()} Salmin Habibu Seif. All Rights Reserved.
          </p>
          {/* Social links can be added back here if provided */}
        </div>
      </div>
    </footer>
  );
};