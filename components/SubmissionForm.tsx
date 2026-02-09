
import React, { useState } from 'react';
import { Item, ItemType } from '../types';

interface SubmissionFormProps {
  onSubmit: (item: Omit<Item, 'id' | 'status' | 'userId'>) => void;
}

const SubmissionForm: React.FC<SubmissionFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<ItemType>(ItemType.FOUND);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | undefined>(undefined);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setImageData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !location || !date) {
        alert('Please fill out all required fields.');
        return;
    }
    onSubmit({ name, description, location, date, type, imageUrl: imageData });
  };
  
  const inputStyles = "w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all";
  const labelStyles = "block mb-2 text-sm font-semibold text-slate-600";

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl border border-slate-200 shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-2 text-slate-800">Report an Item</h2>
        <p className="text-center text-slate-500 mb-8">Your submission will be reviewed by an administrator before being published.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className={labelStyles}>Item Type</label>
                <div className="flex gap-2 p-1 bg-slate-100 rounded-lg border border-slate-200">
                    <button type="button" onClick={() => setType(ItemType.FOUND)} className={`w-1/2 py-2 rounded-md transition-colors text-sm font-semibold ${type === ItemType.FOUND ? 'bg-cyan-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}>
                        I Found Something
                    </button>
                    <button type="button" onClick={() => setType(ItemType.LOST)} className={`w-1/2 py-2 rounded-md transition-colors text-sm font-semibold ${type === ItemType.LOST ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}>
                        I Lost Something
                    </button>
                </div>
            </div>
            <div>
                <label htmlFor="name" className={labelStyles}>Item Name</label>
                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className={inputStyles} placeholder="e.g., Blue Water Bottle" required />
            </div>
            <div>
                <label htmlFor="description" className={labelStyles}>Description</label>
                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} className={inputStyles} placeholder="Provide details like brand, color, or identifying marks." required rows={3}></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="location" className={labelStyles}>Location</label>
                    <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} className={inputStyles} placeholder="e.g., Library" required />
                </div>
                <div>
                    <label htmlFor="date" className={labelStyles}>Date</label>
                    <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className={inputStyles} required />
                </div>
            </div>
             <div>
                <label className={labelStyles}>Upload Image (Optional)</label>
                <div className="mt-2 flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-contain p-2" />
                        ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-4 text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/></svg>
                                <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-slate-500">PNG, JPG, or GIF</p>
                            </div>
                        )}
                        <input id="dropzone-file" type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                    </label>
                </div> 
            </div>
            <button type="submit" className="w-full bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-600 transition-colors duration-300 shadow-sm">
                Submit for Review
            </button>
        </form>
    </div>
  );
};

export default SubmissionForm;
