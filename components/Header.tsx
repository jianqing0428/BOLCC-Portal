
import React, { useState, useEffect } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { Language } from '../types';
import { MenuIcon, CloseIcon, LogoIcon } from './icons/Icons';

interface HeaderProps {
  isTransparent: boolean;
}

const Header: React.FC<HeaderProps> = ({ isTransparent }) => {
  const { language, toggleLanguage, t } = useLocalization();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(!isTransparent);

  useEffect(() => {
    if (!isTransparent) {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isTransparent]);

  const navLinks = [
    { href: '#/', key: 'header.navHome' },
    { href: '#events', key: 'header.navEvents' },
    { href: '#/sermons', key: 'header.navSermons' },
    { href: '#support', key: 'header.navGiving' },
    { href: '#about', key: 'header.navAbout' },
    { href: '#contact', key: 'header.navContact' },
  ];
  
  const headerClasses = isScrolled
    ? 'bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm transition-all duration-300'
    : 'bg-transparent absolute top-5 z-50 w-full transition-all duration-300';
  
  const logoClasses = isScrolled ? 'text-gray-800 hover:text-blue-600' : 'text-white hover:text-gray-200';
  const navLinkClasses = isScrolled ? 'text-gray-600 hover:text-blue-600' : 'text-white hover:text-gray-200';
  const mobileIconColor = isScrolled ? 'text-gray-800' : 'text-white';


  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#/" className={`flex items-center gap-3 transition-colors ${logoClasses}`}>
          <LogoIcon className="h-8 w-8" />
          <span className="text-2xl font-bold">{t('header.logo')}</span>
        </a>
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map(link => (
            <a key={link.key} href={link.href} className={`transition-colors font-bold ${navLinkClasses}`}>
              {t(link.key)}
            </a>
          ))}
        </nav>
        <div className="hidden md:flex items-center space-x-4">
          <button onClick={toggleLanguage} className={`text-sm font-semibold transition-colors w-16 text-center ${navLinkClasses}`}>
            {language === Language.EN ? '中文' : 'English'}
          </button>
          <a href="#contact" className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-all text-sm font-semibold">
            {t('header.newHere')}
          </a>
        </div>
        <div className={`md:hidden ${mobileIconColor}`}>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-full left-0 w-full">
          <nav className="flex flex-col items-center space-y-4 p-6">
            {navLinks.map(link => (
              <a key={link.key} href={link.href} onClick={() => setIsMenuOpen(false)} className="text-gray-600 hover:text-blue-600 transition-colors py-2 text-lg font-bold">
                {t(link.key)}
              </a>
            ))}
            <a href="#contact" onClick={() => setIsMenuOpen(false)} className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-all font-semibold mt-4">
              {t('header.newHere')}
            </a>
            <button onClick={() => { toggleLanguage(); setIsMenuOpen(false); }} className="text-lg font-semibold text-gray-600 hover:text-blue-600 transition-colors py-2 mt-2">
              {language === Language.EN ? '中文' : 'English'}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;