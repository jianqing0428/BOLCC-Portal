import React, { useState, useEffect, useMemo } from 'react';
import PageHeader from './PageHeader';
import { useLocalization } from '../hooks/useLocalization';
import { SermonSubPage, Language } from '../types';
import Editable from './Editable';
import { useAdmin } from '../hooks/useAdmin';

// This is the content from the old SermonArchive.tsx
const RecentSermonsContent: React.FC = () => {
  const { t, language } = useLocalization();
  const { sermons: allSermons } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredSermons = useMemo(() => {
    let sermons = allSermons;

    // Filter by search term
    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      sermons = sermons.filter(sermon => {
        const title = language === Language.EN ? sermon.title.en : sermon.title.zh;
        const speaker = language === Language.EN ? sermon.speaker.en : sermon.speaker.zh;
        return (
          title.toLowerCase().includes(lowercasedFilter) ||
          speaker.toLowerCase().includes(lowercasedFilter) ||
          sermon.date.includes(lowercasedFilter)
        );
      });
    }

    // Filter by date range
    if (startDate) {
        sermons = sermons.filter(sermon => sermon.date >= startDate);
    }
    if (endDate) {
        sermons = sermons.filter(sermon => sermon.date <= endDate);
    }

    return sermons;
  }, [allSermons, searchTerm, startDate, endDate, language]);

  return (
    <>
      <Editable
        as="h2"
        contentKey="sermonsPage.recentSermonsTitle"
        className="text-3xl font-extrabold text-gray-900 mb-6 text-center"
      />
      <div className="mb-12 max-w-4xl mx-auto bg-gray-50 p-6 rounded-lg shadow-inner">
          <div className="flex justify-center mb-4">
              <input
                type="text"
                placeholder={t('sermonArchive.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-lg p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                aria-label="Search sermons"
              />
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-gray-700">
            <span>Filter by date:</span>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
              aria-label="Start date"
            />
            <span>to</span>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
              aria-label="End date"
            />
          </div>
        </div>
        <div className="max-w-4xl mx-auto text-left">
          {filteredSermons.length > 0 ? (
            <ul className="space-y-4">
              {filteredSermons.map((sermon) => (
                <li key={sermon.id} className="p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{language === Language.EN ? sermon.title.en : sermon.title.zh}</h3>
                    <p className="text-gray-600 mt-1">{language === Language.EN ? sermon.speaker.en : sermon.speaker.zh} &bull; {sermon.date}</p>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <a href={`#/sermons/${sermon.id}`} className="text-sm font-semibold text-blue-600 hover:text-blue-800 bg-blue-100 px-4 py-2 rounded-full transition-colors">
                      {t('sermonArchive.watch')}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mt-8 text-center">{t('sermonArchive.noResults')}</p>
          )}
        </div>
    </>
  );
}


interface SermonsPageProps {
  activeSubPage: SermonSubPage;
}

const SermonsPage: React.FC<SermonsPageProps> = ({ activeSubPage: initialSubPage }) => {
  const { t } = useLocalization();
  const [activeTab, setActiveTab] = useState<SermonSubPage>(initialSubPage);

  useEffect(() => {
     const handleHashChange = () => {
        const hash = window.location.hash;
        const subPage = (hash.split('/')[2] || 'sunday-worship') as SermonSubPage;
        setActiveTab(subPage);
    };
    window.addEventListener('hashchange', handleHashChange);
    // Set initial state from hash
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  const navItems: { key: SermonSubPage; textKey: string }[] = [
    { key: 'sunday-worship', textKey: 'sermonsPage.navSundayWorship' },
    { key: 'recent-sermons', textKey: 'sermonsPage.navRecentSermons' },
    { key: 'live-stream', textKey: 'sermonsPage.navLiveStream' },
  ];

  const contentMap: Record<SermonSubPage, { titleKey: string; contentKey: string } | null > = {
    'sunday-worship': { titleKey: 'sermonsPage.sundayWorshipTitle', contentKey: 'sermonsPage.sundayWorshipContent' },
    'recent-sermons': null, // This will be handled specially
    'live-stream': { titleKey: 'sermonsPage.liveStreamTitle', contentKey: 'sermonsPage.liveStreamContent' },
  };

  const currentContent = contentMap[activeTab];
  
  const renderContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => {
      if (paragraph.startsWith('### ')) {
        return <h3 key={index} className="text-2xl font-bold text-gray-800 mt-8 mb-4">{paragraph.substring(4)}</h3>;
      }
      return <p key={index} className="text-gray-600 leading-relaxed mb-4">{paragraph}</p>;
    });
  };

  return (
    <div>
      <PageHeader
        title={t('sermonsPage.pageTitle')}
        subtitle={t('sermonsPage.pageSubtitle')}
      />
      
      <div className="sticky top-[88px] bg-gray-800 text-white z-40 shadow-md">
        <nav className="container mx-auto px-6">
          <ul className="flex justify-center items-center -mb-px space-x-4 sm:space-x-8 overflow-x-auto">
            {navItems.map((item) => (
              <li key={item.key}>
                <a
                  href={`#/sermons/${item.key}`}
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
      
      <div className="container mx-auto max-w-4xl px-6 py-16">
        {activeTab === 'recent-sermons' ? (
          <RecentSermonsContent />
        ) : currentContent ? (
          <>
            <Editable
              as="h2"
              contentKey={currentContent.titleKey}
              className="text-3xl font-extrabold text-gray-900 mb-6"
            />
            <div className="prose prose-lg max-w-none">
              <Editable
                as="div"
                contentKey={currentContent.contentKey}
                isTextarea={true}
                render={text => <>{renderContent(text)}</>}
              />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default SermonsPage;