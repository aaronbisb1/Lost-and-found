import React from 'react';
import { Item, ItemStatus, ItemType } from '../types';

interface MyItemsProps {
  items: Item[];
}

const MyItems: React.FC<MyItemsProps> = ({ items }) => {
  const getStatusChip = (status: ItemStatus) => {
    switch (status) {
      case ItemStatus.APPROVED:
        return <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">Approved</span>;
      case ItemStatus.PENDING:
        return <span className="px-2 py-1 text-xs font-medium text-amber-700 bg-amber-100 rounded-full">Pending Review</span>;
      case ItemStatus.REJECTED:
        return <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">Rejected</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium text-slate-700 bg-slate-100 rounded-full">Unknown</span>;
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-2 text-slate-800">My Submissions</h2>
      <p className="text-slate-500 mb-8">Here is a history of all the items you have submitted.</p>
      
      <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
        <ul className="divide-y divide-slate-200">
          {items.length > 0 ? items.map(item => (
            <li key={item.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-4">
                {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-md object-cover bg-slate-200" />}
                <div>
                  <h3 className="font-semibold text-slate-800">{item.name}</h3>
                  <p className="text-sm text-slate-500">{item.location} - {item.date}</p>
                </div>
              </div>
              <div>
                {getStatusChip(item.status)}
              </div>
            </li>
          )) : (
            <li className="p-8 text-center text-slate-500">You haven't submitted any items yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MyItems;