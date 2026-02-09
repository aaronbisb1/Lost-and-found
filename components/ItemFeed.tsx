
import React from 'react';
import { Item, Filter, ItemType } from '../types';
import ItemCard from './ItemCard';
import { SearchIcon } from './IconComponents';

interface ItemFeedProps {
  items: Item[];
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
}

const FilterControls: React.FC<{ filter: Filter, setFilter: React.Dispatch<React.SetStateAction<Filter>> }> = ({ filter, setFilter }) => {
    const commonInputStyles = "bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors duration-300";

    return (
        <div className="bg-white/80 p-4 rounded-xl border border-slate-200 mb-8 sticky top-[81px] z-40 backdrop-blur-sm shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                
                {/* Search by Keyword */}
                <div className="relative lg:col-span-2">
                    <input
                        type="text"
                        placeholder="Search by keyword (e.g. 'bottle', 'hoodie')..."
                        value={filter.searchQuery}
                        onChange={e => setFilter(f => ({ ...f, searchQuery: e.target.value }))}
                        className={`${commonInputStyles} w-full pl-10 pr-4 py-2 text-slate-800`}
                    />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                </div>
                
                {/* Type Filter */}
                <div className="flex gap-2 p-1 bg-slate-100 rounded-lg border border-slate-200">
                    <FilterButton active={filter.type === 'all'} onClick={() => setFilter(f => ({...f, type: 'all'}))}>All</FilterButton>
                    <FilterButton active={filter.type === ItemType.FOUND} onClick={() => setFilter(f => ({...f, type: ItemType.FOUND}))}>Found</FilterButton>
                    <FilterButton active={filter.type === ItemType.LOST} onClick={() => setFilter(f => ({...f, type: ItemType.LOST}))}>Lost</FilterButton>
                </div>

                {/* Date Sort */}
                <div>
                    <select
                        value={filter.dateSort}
                        onChange={e => setFilter(f => ({ ...f, dateSort: e.target.value as 'newest' | 'oldest' }))}
                        className={`${commonInputStyles} w-full px-4 py-2 appearance-none text-slate-800`}
                    >
                        <option value="newest">Sort by Newest</option>
                        <option value="oldest">Sort by Oldest</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

const FilterButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`w-full py-1.5 rounded-md transition-all duration-300 text-sm font-semibold ${
            active ? 'bg-cyan-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
        }`}
    >
        {children}
    </button>
);


const ItemFeed: React.FC<ItemFeedProps> = ({ items, filter, setFilter }) => {
  return (
    <div>
        <h2 className="text-4xl font-bold text-center mb-4 text-slate-800">Lost & Found Feed</h2>
        <p className="text-center text-slate-500 mb-8 max-w-2xl mx-auto">Browse items that have been reported. Use the filters below to narrow your search.</p>
        <FilterControls filter={filter} setFilter={setFilter} />
        {items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => <ItemCard key={item.id} item={item} />)}
            </div>
        ) : (
            <div className="text-center py-20 bg-white rounded-lg border border-dashed border-slate-300">
                <h3 className="text-xl font-semibold text-slate-700">No items found</h3>
                <p className="text-slate-500 mt-2">Try adjusting your search or filters.</p>
            </div>
        )}
    </div>
  );
};

export default ItemFeed;
