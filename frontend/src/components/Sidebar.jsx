import React, { useState } from 'react';
import { Filter, PlusCircle, CheckSquare, Square, RefreshCw, XCircle, ChevronDown, ChevronUp, ShoppingBag, FolderOpen, ArrowLeft, ShieldCheck, ShieldAlert, Sparkles, Check } from 'lucide-react';

export default function Sidebar({
  categories,
  selectedCategoryIds,
  setSelectedCategoryIds,
  products = [],
  selectedBrands = [],
  onToggleBrand,
  onSubmitProduct,
  formSubmitLoading,
  isAdmin,
  onExit,
  isOpen, // Mobile toggle state
  onClose, // Mobile toggle close handler
  t,
  translateCategory,
  focusedProduct,
  onAddBrandOption,
  brandAddState = {},
  lang
}) {
  const translate = t || ((k) => k);
  const [categorySearch, setCategorySearch] = useState('');
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [brandsExpanded, setBrandsExpanded] = useState(true);
  const [formExpanded, setFormExpanded] = useState(false);
  const [addBrandExpanded, setAddBrandExpanded] = useState(false);

  // New Product Form State
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [defaultPrice, setDefaultPrice] = useState('Market Price');
  const [inStock, setInStock] = useState(true);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // Brand add state from parent
  const {
    newBrandName = '', setNewBrandName,
    newBrandPrice = 'Market Price', setNewBrandPrice,
    newBrandInStock = true, setNewBrandInStock,
    brandAddSuccess = false, setBrandAddSuccess,
    brandAddError = '', setBrandAddError,
    brandAddLoading = false, setBrandAddLoading
  } = brandAddState;

  // Filter categories based on search input
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const handleToggleCategory = (id) => {
    if (selectedCategoryIds.includes(id)) {
      setSelectedCategoryIds(selectedCategoryIds.filter(catId => catId !== id));
    } else {
      setSelectedCategoryIds([...selectedCategoryIds, id]);
    }
  };

  const handleSelectAll = () => {
    setSelectedCategoryIds(categories.map(c => c.id));
  };

  const handleClearAll = () => {
    setSelectedCategoryIds([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);

    if (!isAdmin) {
      setFormError(translate('authRequired'));
      return;
    }
    if (!name.trim()) {
      setFormError(translate('nameRequired'));
      return;
    }
    if (!categoryId) {
      setFormError(translate('categoryRequired'));
      return;
    }

    const payload = {
      name: name.trim(),
      category_id: parseInt(categoryId, 10),
      description: description.trim() || null,
      default_price: defaultPrice.trim() || null,
      in_stock: inStock
    };

    try {
      await onSubmitProduct(payload);
      setFormSuccess(true);
      setName('');
      setCategoryId('');
      setDescription('');
      setDefaultPrice('Market Price');
      setInStock(true);
      setTimeout(() => setFormSuccess(false), 3000);
    } catch (err) {
      setFormError(err.response?.data?.detail || 'Failed to add product. Please try again.');
    }
  };

  const handleBrandSubmit = async () => {
    if (!focusedProduct) {
      setBrandAddError && setBrandAddError(lang === 'te' ? 'ముందుగా ఒక ఉత్పత్తిని ఎంచుకోండి.' : 'Select a product first by clicking on it in the grid.');
      return;
    }
    if (!newBrandName.trim()) {
      setBrandAddError && setBrandAddError(lang === 'te' ? 'బ్రాండ్ పేరు తప్పనిసరి.' : 'Brand name is required.');
      return;
    }
    setBrandAddError && setBrandAddError('');
    setBrandAddLoading && setBrandAddLoading(true);
    try {
      await onAddBrandOption(focusedProduct.id, {
        name: newBrandName.trim(),
        price: newBrandPrice.trim() || 'Market Price',
        in_stock: newBrandInStock
      });
      setNewBrandName && setNewBrandName('');
      setNewBrandPrice && setNewBrandPrice('Market Price');
      setNewBrandInStock && setNewBrandInStock(true);
      setBrandAddSuccess && setBrandAddSuccess(true);
      setTimeout(() => setBrandAddSuccess && setBrandAddSuccess(false), 3000);
    } catch (err) {
      setBrandAddError && setBrandAddError(err.response?.data?.detail || 'Failed to add brand option.');
    } finally {
      setBrandAddLoading && setBrandAddLoading(false);
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-bg-sidebar glassmorphism border-r border-border-sidebar text-text-muted p-5 select-none font-sans">
      
      {/* 1. Header Branding */}
      <div className="flex items-center gap-2.5 mb-6 pb-5 border-b border-border-card">
        <div className="font-display font-extrabold text-2xl tracking-tighter text-text-main leading-none">
          {translate('title')}<span className="text-[#bd00ff]">.</span>
        </div>
        <div className="border-l border-border-card pl-2.5 h-4.5">
          <span className="text-[8px] font-mono-system text-[#bd00ff] uppercase tracking-wider block font-bold leading-none mt-1">
            {translate('sidebarTagline')}
          </span>
        </div>
      </div>

      {/* 2. Active Session Badge */}
      <div className="mb-6">
        {isAdmin ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-[#bd00ff]/30 bg-[#bd00ff]/5 text-[#bd00ff] text-[10px] uppercase font-bold tracking-wider font-mono-system">
            <ShieldCheck className="h-4 w-4 text-[#bd00ff] shrink-0 animate-pulse" />
            <span className="truncate">{translate('decryptRoot')}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-border-card bg-bg-card text-text-muted text-[10px] uppercase font-bold tracking-wider font-mono-system">
            <ShieldAlert className="h-4 w-4 text-text-muted/65 shrink-0" />
            <span className="truncate">{translate('decryptGuest')}</span>
          </div>
        )}
      </div>

      {/* 3. Navigation Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-5 pr-1 scrollbar-thin">
        
        {/* Accordion 1: Category Filters */}
        <div className="space-y-3">
          <button
            onClick={() => setFiltersExpanded(!filtersExpanded)}
            className="w-full flex items-center justify-between text-[11px] font-bold uppercase tracking-wider hover:text-[#bd00ff] transition-colors cursor-pointer text-text-main"
          >
            <span className="flex items-center gap-2 font-display text-sm tracking-tight text-text-main normal-case">
              <FolderOpen className="h-4 w-4 text-[#bd00ff]" />
              {translate('sectorsTitle')}
            </span>
            {filtersExpanded ? <ChevronUp className="h-3.5 w-3.5 text-text-muted" /> : <ChevronDown className="h-3.5 w-3.5 text-text-muted" />}
          </button>

          {filtersExpanded && (
            <div className="space-y-3 pt-1">
              <input
                type="text"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                placeholder={translate('filterPlaceholder')}
                className="w-full px-3.5 py-2 border border-border-card rounded-full bg-bg-card text-xs text-text-main placeholder-text-muted/50 focus:outline-none focus:border-[#bd00ff] uppercase font-mono-system tracking-wider"
              />

              <div className="flex gap-2 font-mono-system">
                <button
                  onClick={handleSelectAll}
                  className="flex-1 text-[9px] font-bold py-1.5 px-2.5 border border-border-card rounded-full hover:border-[#bd00ff] bg-bg-card text-text-muted hover:text-text-main transition-all cursor-pointer uppercase tracking-wider"
                >
                  {translate('btnAll')}
                </button>
                <button
                  onClick={handleClearAll}
                  className="flex-1 text-[9px] font-bold py-1.5 px-2.5 border border-border-card rounded-full hover:border-[#bd00ff] bg-bg-card text-text-muted hover:text-text-main transition-all cursor-pointer uppercase tracking-wider"
                >
                  {translate('btnClear')}
                </button>
              </div>

              {/* Scrollable Categories List */}
              <div className="max-h-[220px] overflow-y-auto pr-1 space-y-1 border-t border-border-card pt-2">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat) => {
                    const isChecked = selectedCategoryIds.includes(cat.id);
                    return (
                      <div
                        key={cat.id}
                        onClick={() => handleToggleCategory(cat.id)}
                        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full cursor-pointer transition-all border ${
                          isChecked
                            ? 'bg-gradient-to-r from-[#0052ff] via-[#bd00ff] to-[#00f0ff] border-transparent text-white font-extrabold shadow-sm shadow-[#bd00ff]/20'
                            : 'bg-bg-card/40 border-transparent text-text-muted hover:bg-bg-card hover:text-text-main'
                        }`}
                      >
                        {isChecked ? (
                          <CheckSquare className="h-3.5 w-3.5 shrink-0 text-black font-bold" />
                        ) : (
                          <Square className="h-3.5 w-3.5 shrink-0 text-text-muted/40" />
                        )}
                        <span className="text-[11px] font-mono-system uppercase tracking-wider truncate">
                          {translateCategory ? translateCategory(cat.name) : cat.name}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4 text-[10px] text-text-muted/60 font-mono-system">
                    NO SECTORS MATCHED.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Accordion: Manufacturers */}
        <div className="space-y-3 border-t border-border-card pt-4">
          <button
            type="button"
            onClick={() => setBrandsExpanded(!brandsExpanded)}
            className="w-full flex items-center justify-between text-[11px] font-bold uppercase tracking-wider hover:text-[#bd00ff] transition-colors cursor-pointer text-text-main"
          >
            <span className="flex items-center gap-2 font-display text-sm tracking-tight text-text-main normal-case">
              <Filter className="h-4 w-4 text-[#bd00ff]" />
              MANUFACTURERS
            </span>
            {brandsExpanded ? <ChevronUp className="h-3.5 w-3.5 text-text-muted" /> : <ChevronDown className="h-3.5 w-3.5 text-text-muted" />}
          </button>

          {brandsExpanded && (
            <div className="space-y-2 pt-1 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
              {['Colgate', 'Dove', 'Patanjali', 'Britannia', 'Nestle', 'ITC', 'Parle', 'Amul', 'Tata', 'HUL'].map((brand) => {
                const isChecked = selectedBrands.includes(brand);
                
                // Count products matching the brand (optionally filtering by selected categories)
                let filtered = products;
                if (selectedCategoryIds.length > 0) {
                  filtered = filtered.filter(p => selectedCategoryIds.includes(p.category_id));
                }
                const count = filtered.filter(p => 
                  p.name.toUpperCase().includes(brand.toUpperCase()) || 
                  p.description?.toUpperCase().includes(brand.toUpperCase()) ||
                  (p.brand_options && p.brand_options.some(opt => opt.name.toUpperCase().includes(brand.toUpperCase())))
                ).length;

                return (
                  <div
                    key={brand}
                    onClick={() => onToggleBrand && onToggleBrand(brand)}
                    className="flex items-center justify-between py-1 px-1.5 rounded-lg hover:bg-bg-card/30 cursor-pointer transition-all text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      {isChecked ? (
                        <div className="bg-[#c39b34] text-black rounded w-3.5 h-3.5 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-black leading-none">✓</span>
                        </div>
                      ) : (
                        <div className="border border-text-muted/30 rounded w-3.5 h-3.5 shrink-0" />
                      )}
                      <span className={`font-sans font-bold uppercase tracking-wider text-[11px] ${isChecked ? 'text-text-main font-extrabold' : 'text-text-muted/80'}`}>
                        {brand}
                      </span>
                    </div>
                    <span className="font-mono-system text-[10px] font-semibold text-text-muted/50">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Admin: Add Brand Option to Focused Product */}
          {isAdmin && onAddBrandOption && brandsExpanded && (
            <div className="space-y-2.5 border-t border-border-card pt-3 mt-2">
              <button
                type="button"
                onClick={() => setAddBrandExpanded(!addBrandExpanded)}
                className="w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-wider hover:text-[#bd00ff] transition-colors cursor-pointer text-[#bd00ff]"
              >
                <span className="flex items-center gap-1.5 font-mono-system">
                  <Sparkles className="h-3.5 w-3.5" />
                  {translate('addBrandBtn')}
                </span>
                {addBrandExpanded ? <ChevronUp className="h-3 w-3 text-text-muted" /> : <ChevronDown className="h-3 w-3 text-text-muted" />}
              </button>

              {addBrandExpanded && (
                <div className="space-y-2.5 bg-[#bd00ff]/5 border border-[#bd00ff]/20 rounded-xl p-3">
                  {/* Show which product the brand will be added to */}
                  {focusedProduct ? (
                    <div className="text-[9px] font-mono-system text-text-muted uppercase tracking-wider">
                      {lang === 'te' ? 'ఎంపిక:' : 'ADDING TO:'} <span className="text-[#bd00ff] font-bold">{focusedProduct.name}</span>
                    </div>
                  ) : (
                    <div className="text-[9px] font-mono-system text-rose-400 uppercase tracking-wider font-bold">
                      {lang === 'te' ? 'ముందుగా ఒక ఉత్పత్తిని ఎంచుకోండి' : 'SELECT A PRODUCT FROM THE GRID FIRST'}
                    </div>
                  )}

                  {brandAddError && (
                    <div className="p-2 bg-rose-500/10 border border-rose-500/30 rounded-lg text-[9px] text-rose-400 font-mono-system uppercase tracking-wider font-bold">
                      {brandAddError}
                    </div>
                  )}

                  {brandAddSuccess && (
                    <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-[9px] text-emerald-400 font-mono-system uppercase tracking-wider font-bold flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      {translate('brandSuccessMsg')}
                    </div>
                  )}

                  {/* Brand Name */}
                  <div>
                    <label className="block text-[8px] font-bold text-text-muted uppercase tracking-wider mb-1 font-mono-system">
                      {translate('brandNameLabel')} *
                    </label>
                    <input
                      type="text"
                      value={newBrandName}
                      onChange={(e) => setNewBrandName && setNewBrandName(e.target.value)}
                      placeholder="e.g. Amul Gold"
                      className="w-full px-3 py-1.5 border border-border-card rounded-lg bg-bg-card text-[11px] text-text-main placeholder-text-muted/30 focus:outline-none focus:border-[#bd00ff] font-semibold"
                    />
                  </div>

                  {/* Brand Price */}
                  <div>
                    <label className="block text-[8px] font-bold text-text-muted uppercase tracking-wider mb-1 font-mono-system">
                      {translate('brandPriceLabel')}
                    </label>
                    <input
                      type="text"
                      value={newBrandPrice}
                      onChange={(e) => setNewBrandPrice && setNewBrandPrice(e.target.value)}
                      placeholder="Market Price"
                      className="w-full px-3 py-1.5 border border-border-card rounded-lg bg-bg-card text-[11px] text-text-main placeholder-text-muted/30 focus:outline-none focus:border-[#bd00ff] font-semibold"
                    />
                  </div>

                  {/* Stock Toggle */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-bg-card/45 border border-border-card">
                    <span className="text-[8px] font-bold text-text-muted uppercase tracking-wider font-mono-system">{translate('stockAvailable')}</span>
                    <button
                      type="button"
                      onClick={() => setNewBrandInStock && setNewBrandInStock(!newBrandInStock)}
                      className={`relative inline-flex h-4.5 w-8 items-center rounded-full transition-colors focus:outline-none cursor-pointer border ${
                        newBrandInStock ? 'bg-[#bd00ff] border-transparent' : 'bg-bg-card border-border-card'
                      }`}
                    >
                      <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${newBrandInStock ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleBrandSubmit}
                    disabled={brandAddLoading || !focusedProduct}
                    className="w-full btn-primary flex items-center justify-center gap-1.5 text-[10px] py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {brandAddLoading ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Check className="h-3.5 w-3.5" />
                    )}
                    {brandAddLoading ? (lang === 'te' ? 'జోడిస్తోంది...' : 'ADDING...') : translate('addBrandBtn')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Accordion 2: Admin Operations (Add Product) */}
        {isAdmin && (
          <div className="space-y-3 border-t border-border-card pt-4">
            <button
              onClick={() => setFormExpanded(!formExpanded)}
              className="w-full flex items-center justify-between text-[11px] font-bold uppercase tracking-wider hover:text-text-main transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2 font-display text-sm tracking-tight text-text-main normal-case">
                <PlusCircle className="h-4 w-4 text-[#bd00ff]" />
                {translate('regTitle')}
              </span>
              {formExpanded ? <ChevronUp className="h-3.5 w-3.5 text-text-muted" /> : <ChevronDown className="h-3.5 w-3.5 text-text-muted" />}
            </button>

            {formExpanded && (
              <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
                {formError && (
                  <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-[10px] text-rose-400 flex items-center gap-2 font-mono-system uppercase tracking-wider">
                    <XCircle className="h-4 w-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {formSuccess && (
                  <div className="p-3 bg-[#bd00ff]/10 border border-[#bd00ff]/30 rounded-xl text-[10px] text-[#bd00ff] font-bold font-mono-system uppercase tracking-wider">
                    {translate('regSuccess')}
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="block text-[9px] font-bold text-text-muted uppercase tracking-wider mb-1 font-mono-system">
                    {translate('prodName')}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Basmati Rice"
                    className="w-full px-3.5 py-2 border border-border-card rounded-xl bg-bg-card text-xs text-text-main placeholder-text-muted/30 focus:outline-none focus:border-[#bd00ff] font-semibold"
                    required
                  />
                </div>

                {/* Category Select */}
                <div>
                  <label className="block text-[9px] font-bold text-text-muted uppercase tracking-wider mb-1 font-mono-system">
                    {translate('sectorAlloc')}
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2 border border-border-card rounded-xl bg-bg-card text-xs text-text-main focus:outline-none focus:border-[#bd00ff] font-semibold"
                    required
                  >
                    <option value="" className="text-text-muted bg-bg-card">{translate('selectSector')}</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id} className="bg-bg-card text-text-main">
                        {translateCategory ? translateCategory(cat.name).toUpperCase() : cat.name.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-[9px] font-bold text-text-muted uppercase tracking-wider mb-1 font-mono-system">
                    {translate('priceSpec')}
                  </label>
                  <input
                    type="text"
                    value={defaultPrice}
                    onChange={(e) => setDefaultPrice(e.target.value)}
                    placeholder="Market Price"
                    className="w-full px-3.5 py-2 border border-border-card rounded-xl bg-bg-card text-xs text-text-main placeholder-text-muted/30 focus:outline-none focus:border-[#bd00ff] font-semibold"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[9px] font-bold text-text-muted uppercase tracking-wider mb-1 font-mono-system">
                    {translate('specDetails')}
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Details..."
                    className="w-full px-3.5 py-2 border border-border-card rounded-xl bg-bg-card text-xs text-text-main placeholder-text-muted/30 focus:outline-none focus:border-[#bd00ff] font-semibold"
                    rows="2"
                  />
                </div>

                {/* In Stock */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-bg-card/45 border border-border-card">
                  <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider font-mono-system">{translate('stockAvailable')}</span>
                  <button
                    type="button"
                    onClick={() => setInStock(!inStock)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none cursor-pointer border ${
                      inStock ? 'bg-[#bd00ff] border-transparent' : 'bg-bg-card border-border-card'
                    }`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${inStock ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                  </button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={formSubmitLoading}
                  className="w-full btn-primary flex items-center justify-center gap-1.5"
                >
                  {formSubmitLoading ? translate('btnSaving') : translate('btnRegisterSubmit')}
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* 4. Sidebar Footer Exit Button Removed */}

    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block w-72 h-screen fixed top-0 left-0 z-20">
        {sidebarContent}
      </div>

      {/* Mobile drawer sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Overlay */}
          <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-xs" />
          <div className="fixed top-0 bottom-0 left-0 w-72 animate-slide-in-left">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
