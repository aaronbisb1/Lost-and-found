
import React, { useState, useEffect } from 'react';
import { Item, ItemType } from '../types';

interface EditItemModalProps {
  item: Item;
  onUpdate: (item: Item) => void;
  onClose: () => void;
}

const EditItemModal: React.FC<EditItemModalProps> = ({ item, onUpdate, onClose }) => {
  const [formData, setFormData] = useState<Item>(item);

  useEffect(() => {
    setFormData(item);
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };
  
  const inputStyles = "w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all";
  const labelStyles = "block mb-2 text-sm font-semibold text-slate-600";

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white p-8 rounded-xl border border-slate-200 shadow-lg max-w-2xl w-full relative"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">Edit Item</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
              <label htmlFor="name" className={labelStyles}>Item Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={inputStyles} required />
          </div>
          <div>
              <label htmlFor="description" className={labelStyles}>Description</label>
              <textarea id="description" name="description" value={formData.description} onChange={handleChange} className={inputStyles} required rows={3}></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <label htmlFor="location" className={labelStyles}>Location</label>
                  <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} className={inputStyles} required />
              </div>
              <div>
                  <label htmlFor="date" className={labelStyles}>Date</label>
                  <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} className={inputStyles} required />
              </div>
          </div>
          <div>
            <label htmlFor="type" className={labelStyles}>Item Type</label>
            <select id="type" name="type" value={formData.type} onChange={handleChange} className={inputStyles}>
                <option value={ItemType.FOUND}>Found</option>
                <option value={ItemType.LOST}>Lost</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors">
                Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md hover:bg-cyan-600 transition-colors shadow-sm">
                Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItemModal;
