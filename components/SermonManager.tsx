
import React, { useState } from 'react';
import { useAdmin } from '../hooks/useAdmin';
import { produce } from 'immer';
import type { Sermon } from '../context/AdminContext';

const resizeImage = (file: File, maxWidth: number, maxHeight: number, quality: number = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      if (!event.target?.result) {
        return reject(new Error("FileReader did not return a result."));
      }
      img.src = event.target.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not get canvas context'));
        }
        ctx.drawImage(img, 0, 0, width, height);
        
        resolve(canvas.toDataURL('image/jpeg', quality)); 
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

const emptySermon: Omit<Sermon, 'id'> = {
  title: { en: '', zh: '' },
  speaker: { en: '', zh: '' },
  date: '',
  series: { en: '', zh: '' },
  passage: { en: '', zh: '' },
  youtubeId: '',
  imageUrl: ''
};

const SermonManager: React.FC = () => {
  const { sermons, setSermons } = useAdmin();
  const [isAdding, setIsAdding] = useState(false);
  const [editingSermonId, setEditingSermonId] = useState<number | null>(null);
  const [sermonData, setSermonData] = useState<Omit<Sermon, 'id'>>(emptySermon);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, lang?: 'en' | 'zh', field?: 'title' | 'speaker' | 'series' | 'passage') => {
    const { name, value } = e.target;
    if (lang && field) {
        setSermonData(produce(draft => {
            draft[field][lang] = value;
        }));
    } else {
        setSermonData(produce(draft => {
            (draft as any)[name] = value;
        }));
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const resizedDataUrl = await resizeImage(file, 800, 800);
        setSermonData(produce(draft => {
          draft.imageUrl = resizedDataUrl;
        }));
      } catch (error) {
        console.error("Image processing failed", error);
        alert("Failed to process image. Please try a different one.");
      }
    }
  };

  const handleSave = () => {
    if (isAdding) {
      const newSermon: Sermon = {
        id: Date.now(), // Simple unique ID
        ...sermonData
      };
      setSermons(prevSermons => [...prevSermons, newSermon].sort((a,b) => b.date.localeCompare(a.date)));
    } else if (editingSermonId !== null) {
      setSermons(prevSermons =>
        prevSermons.map(s => (s.id === editingSermonId ? { id: editingSermonId, ...sermonData } : s)).sort((a,b) => b.date.localeCompare(a.date))
      );
    }
    resetForm();
  };

  const handleEdit = (sermon: Sermon) => {
    setEditingSermonId(sermon.id);
    setSermonData(sermon);
    setIsAdding(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this sermon?')) {
        setSermons(prevSermons => prevSermons.filter(s => s.id !== id));
    }
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingSermonId(null);
    setSermonData(emptySermon);
  };
  
  const FormFields = () => (
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg mb-4 bg-gray-50">
        <input type="text" placeholder="Title (English)" value={sermonData.title.en} onChange={(e) => handleInputChange(e, 'en', 'title')} className="p-2 border rounded" />
        <input type="text" placeholder="標題 (中文)" value={sermonData.title.zh} onChange={(e) => handleInputChange(e, 'zh', 'title')} className="p-2 border rounded" />
        <input type="text" placeholder="Speaker (English)" value={sermonData.speaker.en} onChange={(e) => handleInputChange(e, 'en', 'speaker')} className="p-2 border rounded" />
        <input type="text" placeholder="講員 (中文)" value={sermonData.speaker.zh} onChange={(e) => handleInputChange(e, 'zh', 'speaker')} className="p-2 border rounded" />
        <input type="text" placeholder="Series (English)" value={sermonData.series.en} onChange={(e) => handleInputChange(e, 'en', 'series')} className="p-2 border rounded" />
        <input type="text" placeholder="系列 (中文)" value={sermonData.series.zh} onChange={(e) => handleInputChange(e, 'zh', 'series')} className="p-2 border rounded" />
        <input type="text" placeholder="Passage (English)" value={sermonData.passage.en} onChange={(e) => handleInputChange(e, 'en', 'passage')} className="p-2 border rounded" />
        <input type="text" placeholder="經文 (中文)" value={sermonData.passage.zh} onChange={(e) => handleInputChange(e, 'zh', 'passage')} className="p-2 border rounded" />
        <input type="date" name="date" placeholder="Date" value={sermonData.date} onChange={handleInputChange} className="p-2 border rounded" />
        <input type="text" name="youtubeId" placeholder="YouTube Video ID (e.g. dQw4w9WgXcQ)" value={sermonData.youtubeId} onChange={handleInputChange} className="p-2 border rounded" />

        <div className="md:col-span-2">
          <label htmlFor="sermonImage" className="block text-sm font-medium text-gray-700 mb-1">Sermon Image (Optional)</label>
          <input id="sermonImage" type="file" accept="image/*" onChange={handleImageChange} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
        </div>
        {sermonData.imageUrl && <img src={sermonData.imageUrl} alt="Preview" className="mt-2 h-20 w-auto rounded-md shadow-sm object-cover" />}
        
        <div className="md:col-span-2 flex justify-end gap-2 mt-2">
            <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Save</button>
            <button onClick={resetForm} className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
        </div>
     </div>
  );

  return (
    <div>
      {isAdding || editingSermonId !== null ? <FormFields /> : (
         <button onClick={() => { setIsAdding(true); setEditingSermonId(null); setSermonData(emptySermon) }} className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600">Add New Sermon</button>
      )}

      <ul className="space-y-2">
        {sermons.map(sermon => (
          <li key={sermon.id} className="p-3 bg-white border rounded-md flex justify-between items-center gap-4">
            {sermon.imageUrl && <img src={sermon.imageUrl} alt={sermon.title.en} className="w-16 h-16 object-cover rounded-md" />}
            <div className="flex-grow">
              <p className="font-bold">{sermon.title.en} / {sermon.title.zh}</p>
              <p className="text-sm text-gray-600">{sermon.speaker.en} / {sermon.speaker.zh} - {sermon.date}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => handleEdit(sermon)} className="text-sm bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500">Edit</button>
              <button onClick={() => handleDelete(sermon.id)} className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SermonManager;