import React, { useState } from 'react';
import { Trash2, AlertCircle } from 'lucide-react';

export default function ProductCard({ 
  product, 
  categories, 
  onDeleteProduct,
  onToggleStock,
  isAdmin,
  isSelected,
  onSelect,
  t,
  translateCategory
}) {
  const translate = t || ((k) => k);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);

  // Find category name from categories list
  const category = categories.find(cat => cat.id === product.category_id);
  const categoryName = category ? category.name : 'Uncategorized';

  const handleDeleteClick = async (e) => {
    e.stopPropagation();
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      setTimeout(() => setDeleteConfirm(false), 3000);
      return;
    }

    setDeleteLoading(true);
    try {
      await onDeleteProduct(product.id);
    } catch (err) {
      console.error("Delete failed", err);
      setDeleteLoading(false);
      setDeleteConfirm(false);
    }
  };

  const handleToggleClick = async (e) => {
    e.stopPropagation();
    if (!isAdmin || toggleLoading) return;

    setToggleLoading(true);
    try {
      await onToggleStock(product.id);
    } catch (err) {
      console.error("Stock toggle failed", err);
    } finally {
      setToggleLoading(false);
    }
  };

  return (
    <div 
      onClick={() => onSelect && onSelect(product)}
      className={`flex flex-col h-full rounded-2xl p-5 border transition-all duration-300 cursor-pointer relative group select-none ${
        isSelected 
          ? 'border-[#ff4e17] bg-bg-card shadow-lg shadow-[#ff4e17]/10' 
          : 'border-border-card hover:border-[#ff4e17] bg-bg-card hover:bg-bg-card/70'
      }`}
    >
      
      {/* 1. Telemetry Serial Header */}
      <div className="flex items-center justify-between gap-3 mb-3 font-mono-system text-[10px]">
        <div className="text-text-muted/60">
          <span className="text-[#ff4e17] font-bold mr-1">//</span>
          ID: 0{product.id}
        </div>
        
        {/* Availability Badge */}
        {isAdmin ? (
          <button
            onClick={handleToggleClick}
            disabled={toggleLoading}
            className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border cursor-pointer hover:scale-105 active:scale-95 transition-all ${
              product.in_stock 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
            title={translate('toggleStockTooltip')}
          >
            {product.in_stock ? translate('inStock') : translate('outStock')}
          </button>
        ) : (
          <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
            product.in_stock 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}>
            {product.in_stock ? translate('inStock') : translate('outStock')}
          </span>
        )}
      </div>

      {/* 2. Sector Category Badge */}
      <div className="mb-2">
        <span className="font-mono-system text-[9px] font-bold text-[#ff4e17] bg-[#ff4e17]/10 px-2.5 py-0.5 rounded-full border border-[#ff4e17]/20 uppercase tracking-wider">
          {translate('sector')}: {translateCategory ? translateCategory(categoryName) : categoryName}
        </span>
      </div>

      {/* 3. Product Name */}
      <h3 className="font-display text-lg font-bold uppercase tracking-tight text-text-main group-hover:text-[#ff4e17] transition-colors mb-2.5 leading-tight">
        {product.name}
      </h3>

      {/* 4. Description */}
      <p className="text-xs text-text-muted line-clamp-3 mb-4 leading-relaxed flex-grow">
        {product.description || `Fresh and high-quality ${product.name.toLowerCase()} allocated to sector ${categoryName.toLowerCase()}.`}
      </p>

      {/* 5. Footer (Price & Actions) */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border-card font-mono-system">
        <div>
          <span className="text-[8px] font-bold text-text-muted/50 uppercase tracking-widest block leading-none mb-1">
            {translate('estValue')}
          </span>
          <span className="text-xs font-bold text-text-main uppercase tracking-wide">
            {product.default_price || "Market Price"}
          </span>
        </div>

        {/* Delete Trigger Button (Only visible for Admins) */}
        {isAdmin && (
          <button
            onClick={handleDeleteClick}
            disabled={deleteLoading}
            className={`p-2 rounded-full border transition-all flex items-center justify-center shrink-0 cursor-pointer ${
              deleteConfirm
                ? 'bg-rose-600 border-rose-600 text-white animate-pulse'
                : 'border-border-card hover:border-rose-500 text-text-muted/50 hover:text-rose-455 hover:bg-rose-500/5'
            }`}
            title={deleteConfirm ? translate('confirmRemoval') : translate('deleteTooltip')}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Delete Confirmation Alert */}
      {deleteConfirm && isAdmin && (
        <div className="absolute inset-x-0 bottom-0 bg-rose-600 text-white text-[9px] py-1.5 px-3 font-bold text-center tracking-wider uppercase font-mono-system rounded-b-2xl">
          {translate('confirmRemoval')}
        </div>
      )}
    </div>
  );
}
