import React, { useState } from 'react';
import { useAdmin } from '../hooks/useAdmin';
import SermonManager from './SermonManager';
import HeroImageManager from './HeroImageManager';
import { CloseIcon } from './icons/Icons';

const AdminPanel: React.FC = () => {
  const { isAdminMode, logout } = useAdmin();
  const [isSermonManagerOpen, setIsSermonManagerOpen] = useState(false);
  const [isHeroManagerOpen, setIsHeroManagerOpen] = useState(false);

  if (!isAdminMode) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50 flex justify-center items-center shadow-lg">
        <div className="flex items-center gap-4 flex-wrap justify-center">
            <span className="font-bold text-lg">Admin Mode</span>
            <button
                onClick={() => setIsHeroManagerOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
                Manage Hero Images
            </button>
            <button
                onClick={() => setIsSermonManagerOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
                Manage Sermons
            </button>
            <button
                onClick={logout}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
                Exit Admin Mode
            </button>
        </div>
      </div>
      
      {isSermonManagerOpen && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">Sermon Manager</h2>
                    <button onClick={() => setIsSermonManagerOpen(false)} aria-label="Close sermon manager">
                        <CloseIcon />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    <SermonManager />
                </div>
            </div>
        </div>
      )}

      {isHeroManagerOpen && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">Hero Image Manager</h2>
                    <button onClick={() => setIsHeroManagerOpen(false)} aria-label="Close hero image manager">
                        <CloseIcon />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    <HeroImageManager />
                </div>
            </div>
        </div>
      )}
    </>
  );
};

export default AdminPanel;
