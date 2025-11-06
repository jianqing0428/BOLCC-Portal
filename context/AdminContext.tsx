
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { translations } from '../constants/translations';
import { produce } from 'immer';

// Define the shape of a single sermon
export interface Sermon {
  id: number;
  title: { en: string; zh: string };
  speaker: { en: string; zh: string };
  date: string;
  series: { en: string; zh: string };
  passage: { en: string; zh: string };
  youtubeId: string;
  imageUrl?: string;
}


// Define the context type
interface AdminContextType {
  isAdminMode: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  content: typeof translations;
  updateContent: (path: string, value: string) => void;
  images: { [key: string]: string };
  updateImage: (key: string, dataUrl: string) => void;
  sermons: Sermon[];
  setSermons: React.Dispatch<React.SetStateAction<Sermon[]>>;
  saveChanges: () => void;
}

export const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Helper function to set a value in a nested object
const setNestedValue = (obj: any, path: string, value: string) => {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  let temp = obj;
  for (const key of keys) {
    if (!temp[key]) {
      temp[key] = {};
    }
    temp = temp[key];
  }
  temp[lastKey] = value;
};

// Initial sermon data (used if nothing in localStorage)
const initialSermons: Sermon[] = [
    { id: 1, title: { en: 'Wisdom for Making Plans', zh: '制定計劃的智慧' }, speaker: { en: 'Pastor Andy Yu', zh: '余大器 牧師' }, date: '2025-11-02', series: { en: 'Wisdom from Above', zh: '從上頭來的智慧' }, passage: { en: 'James 4:11-17', zh: '雅各書 4:11-17' }, youtubeId: 'M7lc1UVf-VE', imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2670' },
    { id: 2, title: { en: 'Wisdom for Relationships', zh: '人際關係的智慧' }, speaker: { en: 'Pastor Andy Yu', zh: '余大器 牧師' }, date: '2025-10-26', series: { en: 'Wisdom from Above', zh: '從上頭來的智慧' }, passage: { en: 'James 4:1-10', zh: '雅各書 4:1-10' }, youtubeId: 'dQw4w9WgXcQ', imageUrl: 'https://images.unsplash.com/photo-1519096990358-3c121dec4458?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2670' },
    { id: 3, title: { en: 'Genuine Wisdom vs. Counterfeit Wisdom', zh: '真智慧與假智慧' }, speaker: { en: 'Pastor Andy Yu', zh: '余大器 牧師' }, date: '2025-10-19', series: { en: 'Wisdom from Above', zh: '從上頭來的智慧' }, passage: { en: 'James 4:1-12', zh: '雅各書 4:1-12' }, youtubeId: '3JZ_D3ELwOQ', imageUrl: 'https://plus.unsplash.com/premium_photo-1664006989128-71fc47e7c3d6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2273' },
    { id: 4, title: { en: 'Wise with Our Words', zh: '言語的智慧' }, speaker: { en: 'Pastor Andy Yu', zh: '余大器 牧師' }, date: '2025-10-12', series: { en: 'Wisdom from Above', zh: '從上頭來的智慧' }, passage: { en: 'James 3:1-12', zh: '雅各書 3:1-12' }, youtubeId: 'rokGy0huYEA', imageUrl: 'https://images.unsplash.com/photo-1699422069743-345fdcebbab0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=3132' },
    { id: 5, title: { en: 'Living a Life of Purpose', zh: '活出有目標的生命' }, speaker: { en: 'Guest Speaker Paster Rainbow', zh: '特邀講員Rainbow' }, date: '2024-07-14', series: { en: 'Summer Series', zh: '夏季系列' }, passage: { en: 'Ephesians 2:10', zh: '以弗所書 2:10' }, youtubeId: 'xv-p8_q_f8g', imageUrl: 'https://i.ytimg.com/vi/xv-p8_q_f8g/maxresdefault.jpg' },
];

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [content, setContent] = useState<typeof translations>(translations);
  const [sermons, setSermons] = useState<Sermon[]>(initialSermons);
  const [images, setImages] = useState<{ [key: string]: string }>({});


  // Load from localStorage on initial render
  useEffect(() => {
    try {
      const savedContent = localStorage.getItem('bolcc_content');
      if (savedContent) {
        setContent(JSON.parse(savedContent));
      }
      const savedSermons = localStorage.getItem('bolcc_sermons');
      if (savedSermons) {
        setSermons(JSON.parse(savedSermons));
      }
      const savedImages = localStorage.getItem('bolcc_images');
      if (savedImages) {
        setImages(JSON.parse(savedImages));
      }
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
    }
  }, []);

  const login = (password: string): boolean => {
    // In a real application, this should be handled securely, not hardcoded.
    if (password === 'bolcc2024') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const updateContent = (path: string, value: string) => {
    setContent(
      produce(draft => {
        setNestedValue(draft, path, value);
      })
    );
  };

  const updateImage = (key: string, dataUrl: string) => {
    setImages(
      produce(draft => {
        draft[key] = dataUrl;
      })
    );
  };
  
  const saveChanges = () => {
    try {
      localStorage.setItem('bolcc_content', JSON.stringify(content));
      localStorage.setItem('bolcc_sermons', JSON.stringify(sermons));
      localStorage.setItem('bolcc_images', JSON.stringify(images));
      alert('Changes saved!');
    } catch (error) {
       console.error("Failed to save to localStorage", error);
       if (error instanceof DOMException && error.name === 'QuotaExceededError') {
         alert("Could not save changes. The storage is full. Please remove some large images and try again.");
       } else {
         alert('Failed to save changes.');
       }
    }
  };
  
  // Autosave when content, sermons or images change
  useEffect(() => {
    if (isAuthenticated) {
        try {
            localStorage.setItem('bolcc_content', JSON.stringify(content));
            localStorage.setItem('bolcc_sermons', JSON.stringify(sermons));
            localStorage.setItem('bolcc_images', JSON.stringify(images));
        } catch (error) {
            console.error("Failed to auto-save to localStorage", error);
            if (error instanceof DOMException && error.name === 'QuotaExceededError') {
                alert("Could not save changes. The storage is full. Please remove some large images and try again.");
            }
        }
    }
  }, [content, sermons, images, isAuthenticated]);
  
  const isAdminMode = isAuthenticated;

  return (
    <AdminContext.Provider value={{ isAdminMode, login, logout, content, updateContent, images, updateImage, sermons, setSermons, saveChanges }}>
      {children}
    </AdminContext.Provider>
  );
};