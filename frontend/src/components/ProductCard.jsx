import React, { useState } from 'react';

export default function ProductCard({ 
  product, 
  categories, 
  onToggleStock,
  isAdmin,
  isSelected,
  onSelect,
  t,
  translateCategory
}) {
  const translate = t || ((k) => k);
  const [toggleLoading, setToggleLoading] = useState(false);

  // Find category name from categories list
  const category = categories.find(cat => cat.id === product.category_id);
  const categoryName = category ? category.name : 'Uncategorized';

  // Delete option has been removed

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
          ? 'border-[#bd00ff] bg-bg-card shadow-lg shadow-[#bd00ff]/10' 
          : 'border-border-card hover:border-[#bd00ff] bg-bg-card hover:bg-bg-card/70'
      }`}
    >
      
      {/* 1. Telemetry Serial Header */}
      <div className="flex items-center justify-between gap-3 mb-3 font-mono-system text-[10px]">
        <div className="text-text-muted/60">
          <span className="text-[#bd00ff] font-bold mr-1">//</span>
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
        <span className="font-mono-system text-[9px] font-bold text-[#bd00ff] bg-[#bd00ff]/10 px-2.5 py-0.5 rounded-full border border-[#bd00ff]/20 uppercase tracking-wider">
          {translate('sector')}: {translateCategory ? translateCategory(categoryName) : categoryName}
        </span>
      </div>

      {/* 3. Product Name */}
      <h3 className="font-display text-lg font-bold uppercase tracking-tight text-text-main group-hover:text-[#bd00ff] transition-colors mb-2.5 leading-tight">
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

      </div>
    </div>
  );
}
