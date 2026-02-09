
import React, { useState, useMemo } from 'react';
import { Item, ItemStatus } from '../types';
import ItemCard from './ItemCard';
import { SearchIcon } from './IconComponents';

interface AdminDashboardProps {
  pendingItems: Item[];
  approvedItems: Item[];
  onUpdateStatus: (id: string, status: ItemStatus) => void;
  onDelete: (id: string) => void;
  onEdit: (item: Item) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ pendingItems, approvedItems, onUpdateStatus, onDelete, onEdit }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filterItems = (items: Item[]) => {
      if (!searchQuery) return items;
      const lowercasedQuery = searchQuery.toLowerCase();
      return items.filter(
          item =>
              item.name.toLowerCase().includes(lowercasedQuery) ||
              item.description.toLowerCase().includes(lowercasedQuery) ||
              item.location.toLowerCase().includes(lowercasedQuery)
      );
  };
  
  const filteredPendingItems = useMemo(() => filterItems(pendingItems), [pendingItems, searchQuery]);
  const filteredApprovedItems = useMemo(() => filterItems(approvedItems), [approvedItems, searchQuery]);

  return (
    <div className="space-y-12">
      <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
        <h2 className="text-2xl font-bold mb-4 text-slate-800">Admin Controls</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search all submissions by keyword..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-2 text-cyan-600">Pending Submissions ({filteredPendingItems.length})</h3>
        <p className="text-slate-500 mb-6">Review these items to approve or reject them.</p>
        {filteredPendingItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPendingItems.map(item => (
              <ItemCard 
                key={item.id} 
                item={item} 
                isAdminView={true} 
                onUpdateStatus={onUpdateStatus}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </div>
        ) : (
          <p className="text-slate-500 p-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">No matching pending submissions.</p>
        )}
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-2 text-rose-600">Manage Approved Items ({filteredApprovedItems.length})</h3>
        <p className="text-slate-500 mb-6">View and manage items currently visible on the public feed.</p>
        {filteredApprovedItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApprovedItems.map(item => (
              <ItemCard 
                key={item.id} 
                item={item} 
                isAdminView={true} 
                onUpdateStatus={onUpdateStatus}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </div>
        ) : (
          <p className="text-slate-500 p-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">No matching approved items.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
