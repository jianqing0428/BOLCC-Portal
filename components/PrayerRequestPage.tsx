
import React, { useState, useEffect } from 'react';
import PageHeader from './PageHeader';
import { useLocalization } from '../hooks/useLocalization';
import { PrayerRequestSubPage } from '../types';
import Editable from './Editable';

const PrayerRequestForm = () => {
  const { t } = useLocalization();
  
  return (
    <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-lg max-w-4xl mx-auto border border-gray-100">
      <Editable as="h2" contentKey="prayerRequestPage.formTitle" className="text-3xl font-bold text-gray-900 mb-2" />
      <Editable as="p" contentKey="prayerRequestPage.formSubtitle" className="text-gray-600 mb-8" />
      
      <form action="#" method="POST" className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="first-name" className="sr-only">{t('prayerRequestPage.firstName')}</label>
            <input type="text" name="first-name" id="first-name" placeholder={t('prayerRequestPage.firstName')} className="w-full bg-gray-100 border-gray-200 rounded-lg p-4 text-sm focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="last-name" className="sr-only">{t('prayerRequestPage.lastName')}</label>
            <input type="text" name="last-name" id="last-name" placeholder={t('prayerRequestPage.lastName')} className="w-full bg-gray-100 border-gray-200 rounded-lg p-4 text-sm focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="sr-only">{t('prayerRequestPage.emailAddress')}</label>
            <input type="email" name="email" id="email" placeholder={t('prayerRequestPage.emailAddress')} className="w-full bg-gray-100 border-gray-200 rounded-lg p-4 text-sm focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="phone" className="sr-only">{t('prayerRequestPage.phoneNumber')}</label>
            <input type="tel" name="phone" id="phone" placeholder={t('prayerRequestPage.phoneNumber')} className="w-full bg-gray-100 border-gray-200 rounded-lg p-4 text-sm focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
        <div>
          <label htmlFor="message" className="sr-only">{t('prayerRequestPage.message')}</label>
          <textarea name="message" id="message" rows={6} placeholder={t('prayerRequestPage.message')} className="w-full bg-gray-100 border-gray-200 rounded-lg p-4 text-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>
        <div>
          <button type="submit" className="w-full sm:w-auto bg-gray-900 text-white font-bold py-4 px-8 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900">
            {t('prayerRequestPage.submit')}
          </button>
        </div>
      </form>
    </div>
  );
};


interface PrayerRequestPageProps {
  activeSubPage: PrayerRequestSubPage;
}

const PrayerRequestPage: React.FC<PrayerRequestPageProps> = ({ activeSubPage: initialSubPage }) => {
  const { t } = useLocalization();
  const [activeTab, setActiveTab] = useState<PrayerRequestSubPage>(initialSubPage);

  useEffect(() => {
     const handleHashChange = () => {
        const hash = window.location.hash;
        const subPage = (hash.split('/')[2] || 'submit-request') as PrayerRequestSubPage;
        setActiveTab(subPage);
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  const navItems: { key: PrayerRequestSubPage; textKey: string }[] = [
    { key: 'submit-request', textKey: 'prayerRequestPage.navSubmitRequest' },
  ];

  return (
    <div className="bg-gray-50">
      <PageHeader
        title={t('prayerRequestPage.pageTitle')}
        subtitle={t('prayerRequestPage.pageSubtitle')}
      />
      
      <div className="sticky top-[88px] bg-gray-800 text-white z-40 shadow-md">
        <nav className="container mx-auto px-6">
          <ul className="flex justify-center items-center -mb-px space-x-4 sm:space-x-8 overflow-x-auto">
            {navItems.map((item) => (
              <li key={item.key}>
                <a
                  href={`#/prayer-request/${item.key}`}
                  className={`whitespace-nowrap inline-block text-sm sm:text-base font-semibold py-4 border-b-2 transition-colors duration-300 ${
                    activeTab === item.key
                      ? 'border-white text-white'
                      : 'border-transparent text-gray-400 hover:text-white hover:border-gray-300'
                  }`}
                >
                  {t(item.textKey)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      <div className="container mx-auto px-6 py-16">
        <PrayerRequestForm />
      </div>
    </div>
  );
};

export default PrayerRequestPage;