
import React from 'react';
import { Item, ItemStatus, ItemType } from '../types';
import { CheckIcon, XCircleIcon, TrashIcon, PencilIcon } from './IconComponents';

interface ItemCardProps {
  item: Item;
  isAdminView?: boolean;
  onUpdateStatus?: (id: string, status: ItemStatus) => void;
  onDelete?: (id: string) => void;
  onEdit?: (item: Item) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, isAdminView = false, onUpdateStatus, onDelete, onEdit }) => {
  const isLost = item.type === ItemType.LOST;
  const isPending = item.status === ItemStatus.PENDING;

  const cardBorderColor = isLost ? 'border-t-rose-500' : 'border-t-cyan-500';
  const tagBgColor = isLost ? 'bg-rose-100 text-rose-700' : 'bg-cyan-100 text-cyan-700';
  
  return (
    <div className={`bg-white border-t-4 ${cardBorderColor} rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group`}>
      {item.imageUrl && (
        <div className="w-full h-48 overflow-hidden bg-slate-200">
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
      )}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-slate-800">{item.name}</h3>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${tagBgColor} capitalize`}>
            {item.type}
          </span>
        </div>
        <p className="text-slate-600 mb-4 text-sm h-16 overflow-hidden">{item.description}</p>
        
        <div className="text-sm space-y-2 text-slate-500 border-t border-slate-200 pt-3">
          <p><strong className="font-semibold text-slate-700">Location:</strong> {item.location}</p>
          <p><strong className="font-semibold text-slate-700">Date:</strong> {item.date}</p>
        </div>

        {isAdminView && onUpdateStatus && onDelete && onEdit && (
          <div className="mt-4 pt-4 border-t border-slate-200 flex justify-end flex-wrap gap-2">
            {isPending ? (
               <>
                <button onClick={() => onUpdateStatus(item.id, ItemStatus.APPROVED)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-green-700 bg-green-100 rounded-md hover:bg-green-200 transition-colors">
                  <CheckIcon className="w-4 h-4" /> Approve
                </button>
                <button onClick={() => onUpdateStatus(item.id, ItemStatus.REJECTED)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-amber-700 bg-amber-100 rounded-md hover:bg-amber-200 transition-colors">
                  <XCircleIcon className="w-4 h-4" /> Reject
                </button>
               </>
            ) : (
                <button onClick={() => onEdit(item)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors">
                  <PencilIcon className="w-4 h-4" /> Edit
                </button>
            )}
             <button onClick={() => onDelete(item.id)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors">
                <TrashIcon className="w-4 h-4" /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemCard;
