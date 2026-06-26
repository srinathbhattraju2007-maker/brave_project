import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBasket, RefreshCw, AlertTriangle, Check, CircleAlert, Sparkles, Filter, ShieldCheck, X, ShoppingBag, LockKeyhole, ArrowRight, Sun, Moon, HelpCircle, FolderOpen, ShieldAlert } from 'lucide-react';

import BrandedHeader from './components/BrandedHeader';
import Sidebar from './components/Sidebar';
import ProductCard from './components/ProductCard';

const API_BASE = 'http://127.0.0.1:8000';

const TRANSLATIONS = {
  en: {
    // Portal
    title: "NAGA PAVAN MERCHANDISE",
    tagline: "General Merchants",
    welcome: "Welcome to our digital store dashboard. Select your access portal below to browse our inventory items or manage operations.",
    guestTitle: "// Guest Showcase View",
    guestDesc: "Explore our complete retail inventory. Search items, filter by categories, and review price tags and stock availability in real time. No sign-in required.",
    guestButton: "Enter Guest Showcase",
    guestSelect: "Select Guest Portal",
    adminTitle: "// Store Administrator",
    adminDesc: "Unlock full operational tools. Insert new product entries, delete existing showcase files, and toggle catalog stock parameters in real time.",
    adminPlaceholder: "ENTER ADMIN PASSWORD",
    adminButton: "Unlock",
    forgotPass: "forgot password? solve riddle key",
    address: "📍 MAIN BAZAR, NEAR TEMPLE STREET",
    timings: "⏰ ACTIVE DAILY: 07:00 - 22:00 IST",

    // Riddle
    riddleTitle: "// VAULT DECRYPTION GRID RIDDLE",
    riddleCriteria: "SOLVE SECURITY CRITERIA TO DECRYPT AUTH:",
    riddleText: '"Take off my skin and I won\'t cry, but you will! What grocery item am I?"',
    riddlePlaceholder: "ENTER DECRYPTION DEVIATION...",
    riddleDecrypt: "DECRYPT SYSTEM",
    riddleAbort: "ABORT CONSOLE",
    riddleSuccess: "DECRYPTION SUCCESS: ROLE = ADMIN_OP",
    riddleCredText: "THE SECRET ACCESS CREDENTIAL IS:",
    riddleProceed: "PROCEED TO PORTALS",
    riddleError: "Incorrect decryption coordinates. Security reset triggered.",

    // Header
    searchPlaceholder: "SEARCH SECTOR INVENTORY...",
    stability: "SYS STABILITY:",
    rootOp: "ROOT_OP",
    guestOp: "GUEST_OP",
    merchantCoords: "MERCHANT COORDINATES",
    activeHours: "ACTIVE HOURS: 07:00 - 22:00 IST",

    // Sidebar
    sectorsTitle: "Choose Active Sectors",
    filterPlaceholder: "FILTER SECTORS...",
    btnAll: "ALL",
    btnClear: "CLEAR",
    decryptRoot: "DECRYPTION: ROOT PRIVILEGE",
    decryptGuest: "DECRYPTION: PUBLIC ACCESS",
    sidebarTagline: "SECTOR INVENTORY CONSOLE",
    regTitle: "Register Product",
    prodName: "PRODUCT NAME *",
    sectorAlloc: "SECTOR ALLOCATION *",
    priceSpec: "UNIT PRICE SPEC",
    specDetails: "SPECIFICATION DETAILS",
    stockAvailable: "STOCK AVAILABLE",
    btnRegister: "REGISTER PRODUCT",
    exitDecryptor: "EXIT DECRYPTOR",

    // Catalog
    heroTitle: "// FOCUSED COMPONENT TELEMETRY",
    acquireBtn: "ACQUIRE COMPONENT",
    specSheetBtn: "TECHNICAL SPEC SHEET",
    deployedTitle: "DEPLOYED CORE COMPONENTS",
    filtersApplied: "FILTERS APPLIED:",
    allUnits: "ALL",
    inStock: "IN_STOCK",
    outStock: "OUT_STOCK",
    estValue: "EST VALUE",
    sector: "SECTOR",

    // Added Missing Translations
    selectSector: "-- SELECT SECTOR --",
    btnSaving: "SAVING...",
    btnRegisterSubmit: "REGISTER PRODUCT",
    authRequired: "Authentication required. Only admins can add products.",
    nameRequired: "Product name is required.",
    categoryRequired: "Please select a category.",
    regSuccess: "PRODUCT REGISTERED SUCCESS.",
    sidebarFooter: "MERCHANDISE CORE v3.0",
    confirmRemoval: "CONFIRM REMOVAL FROM SHOWCASE",
    deleteTooltip: "Delete component",
    toggleStockTooltip: "Click to toggle stock status",
    dbConnError: "Database connection error. Ensure the backend server is running.",
    dbContactError: "Could not establish contact with persistent database server.",
    dbStockToggleError: "Failed to update stock status in database.",
    invalidPassword: "Invalid Password. Access Denied.",
    verifying: "VERIFYING...",
    unlockAdminTools: "Unlock Admin Tools",
    allSectors: "ALL SECTORS",
    anyTeam: "ALL TEAMS",
    statusLabel: "STATUS:",
    sectorAllocLabel: "SECTOR ALLOCATION:",
    optimized: "OPTIMIZED",
    systemDegradation: "SYSTEM DEGRADATION",
    noComponentFocus: "NO COMPONENT FOCUS SELECTED. CHOOSE A GRID COMPONENT TO INITIALIZE TELEMETRY.",
    noSectorsMatched: "NO COMPONENT SECTORS MATCHED",
    adjustFilters: "ADJUST ACTIVE SEARCH QUERY, MANUFACTURER FILTERS, OR TOGGLE CATEGORY SECTORS.",
    manufacturerTeams: "MANUFACTURER TEAMS",
    activeRacingSector: "CHOOSE ACTIVE RACING SECTOR",
    brandsTitle: "AVAILABLE BRANDS & OPTIONS",
    brandNameLabel: "BRAND NAME",
    brandPriceLabel: "PRICE SPEC",
    addBrandBtn: "ADD BRAND OPTION",
    brandSuccessMsg: "BRAND OPTION ADDED SUCCESSFULLY!",
    noBrandsPlaceholder: "NO SPECIFIC BRANDS LISTED. AVAILABLE AT MARKET PRICE.",
    inStockOption: "IN STOCK",
    outOfStockOption: "OUT OF STOCK",
    exitPortal: "EXIT PORTAL"
  },
  te: {
    // Portal
    title: "నాగ పవన్ మర్చండైజ్",
    tagline: "జనరల్ మర్చంట్స్",
    welcome: "మా డిజిటల్ స్టోర్ డ్యాష్‌బోర్డ్‌కు స్వాగతం. మా ఇన్వెంటరీ వస్తువులను బ్రౌజ్ చేయడానికి లేదా కార్యకలాపాలను నిర్వహించడానికి క్రింద మీ యాక్సెస్ పోర్టల్‌ను ఎంచుకోండి.",
    guestTitle: "// గెస్ట్ షోకేస్ వీక్షణ",
    guestDesc: "మా పూర్తి రిటైల్ ఇన్వెంటరీని అన్వేషించండి. వస్తువులను శోధించండి, వర్గాల వారీగా ఫిల్టర్ చేయండి మరియు ధరలు మరియు స్టాక్ లభ్యతను నిజ సమయంలో తనిఖీ చేయండి. సైన్-ఇన్ అవసరం లేదు.",
    guestButton: "గెస్ట్ షోకేస్ లోనికి ప్రవేశించండి",
    guestSelect: "గెస్ట్ పోర్టల్‌ను ఎంచుకోండి",
    adminTitle: "// స్టోర్ అడ్మినిస్ట్రేటర్",
    adminDesc: "పూర్తి కార్యాచరణ సాధనాలను అన్‌లాక్ చేయండి. కొత్త ఉత్పత్తులను జోడించండి, పాత వస్తువులను తొలగించండి మరియు స్టాక్ లభ్యతను నిజ సమయంలో మార్చండి.",
    adminPlaceholder: "అడ్మిన్ పాస్ వర్డ్ నమోదు చేయండి",
    adminButton: "అన్‌లాక్ చేయి",
    forgotPass: "పాస్‌వర్డ్ మర్చిపోయారా? పొడుపుకథను పూరించండి",
    address: "📍 మెయిన్ బజార్, దేవాలయం వీధి దగ్గర",
    timings: "⏰ ప్రతిరోజూ అందుబాటులో ఉంటుంది: ఉదయం 7:00 - రాత్రి 10:00 IST",

    // Riddle
    riddleTitle: "// వాల్ట్ డిక్రిప్షన్ గ్రిడ్ పొడుపుకథ",
    riddleCriteria: "యాక్సెస్ డిక్రిప్ట్ చేయడానికి పొడుపుకథను పూరించండి:",
    riddleText: '"నా పొట్టు వలిస్తే నేను ఏడవను, కానీ మీరు ఏడుస్తారు! నేను ఏ మర్చండైజ్ వస్తువును?"',
    riddlePlaceholder: "సమాధానాన్ని నమోదు చేయండి...",
    riddleDecrypt: "సిస్టమ్‌ను డిక్రిప్ట్ చేయి",
    riddleAbort: "రద్దు చేయి",
    riddleSuccess: "డిక్రిప్షన్ విజయవంతమైంది: రోల్ = అడ్మిన్",
    riddleCredText: "రహస్య పాస్‌వర్డ్:",
    riddleProceed: "పోర్టల్‌కు వెళ్ళండి",
    riddleError: "తప్పుడు సమాధానం. మళ్లీ ప్రయత్నించండి.",

    // Header
    searchPlaceholder: "శోధించండి...",
    stability: "వ్యవస్థ స్థిరత్వం:",
    rootOp: "అడ్మిన్",
    guestOp: "గెస్ట్",
    merchantCoords: "మర్చంట్ వివరాలు",
    activeHours: "పనివేళలు: ఉదయం 7:00 - రాత్రి 10:00 IST",

    // Sidebar
    sectorsTitle: "వర్గాలను ఎంచుకోండి",
    filterPlaceholder: "శోధించండి...",
    btnAll: "అన్నీ",
    btnClear: "తొలగించు",
    decryptRoot: "డిక్రిప్షన్: అడ్మిన్",
    decryptGuest: "డిక్రిప్షన్: గెస్ట్",
    sidebarTagline: "ఇన్వెంటరీ కన్సోల్",
    regTitle: "ఉత్పత్తిని జోడించండి",
    prodName: "ఉత్పత్తి పేరు *",
    sectorAlloc: "వర్గము *",
    priceSpec: "ధర",
    specDetails: "వివరాలు",
    stockAvailable: "స్టాక్ అందుబాటులో ఉంది",
    btnRegister: "సమర్పించు",
    exitDecryptor: "లాగ్ అవుట్",

    // Catalog
    heroTitle: "// ఎంపిక చేసిన వస్తువు వివరాలు",
    acquireBtn: "వస్తువును సేకరించు",
    specSheetBtn: "వివరాల పత్రం",
    deployedTitle: "స్టోర్ లోని వస్తువులు",
    filtersApplied: "అన్వయించిన ఫిల్టర్లు:",
    allUnits: "అన్నీ",
    inStock: "అందుబాటులో ఉన్నవి",
    outStock: "అందుబాటులో లేనివి",
    estValue: "ధర",
    sector: "వర్గము",

    // Added Missing Translations
    selectSector: "-- వర్గమును ఎంచుకోండి --",
    btnSaving: "భద్రపరుస్తోంది...",
    btnRegisterSubmit: "ఉత్పత్తిని నమోదు చేయి",
    authRequired: "అనుమతి అవసరం. అడ్మిన్ మాత్రమే ఉత్పత్తులను చేర్చగలరు.",
    nameRequired: "ఉత్పత్తి పేరు తప్పనిసరి.",
    categoryRequired: "దయచేసి ఒక వర్గాన్ని ఎంచుకోండి.",
    regSuccess: "ఉత్పత్తి విజయవంతంగా నమోదైంది.",
    sidebarFooter: "మర్చండైజ్ కోర్ v3.0",
    confirmRemoval: "తొలగింపును నిర్ధారించండి",
    deleteTooltip: "వస్తువును తొలగించు",
    toggleStockTooltip: "స్టాక్ లభ్యతను మార్చు",
    dbConnError: "డేటాబేస్ కనెక్షన్ లోపం. బ్యాకెండ్ సర్వర్ నడుస్తోందని నిర్ధారించుకోండి.",
    dbContactError: "డేటాబేస్ సర్వర్‌తో సంబంధాన్ని ఏర్పరచలేకపోయాము.",
    dbStockToggleError: "డేటాబేస్ లో స్టాక్ స్థితిని నవీకరించడం విఫలమైంది.",
    invalidPassword: "తప్పుడు పాస్‌వర్డ్. ప్రవేశం నిరాకరించబడింది.",
    verifying: "ధృవీకరిస్తోంది...",
    unlockAdminTools: "అడ్మిన్ టూల్స్ అన్‌లాక్ చేయి",
    allSectors: "అన్ని విభాగాలు",
    anyTeam: "అన్ని కంపెనీలు",
    statusLabel: "స్థితి:",
    sectorAllocLabel: "వర్గము కేటాయింపు:",
    optimized: "లభ్యత ఉంది",
    systemDegradation: "లభ్యత లేదు",
    noComponentFocus: "ఏ వస్తువు ఎంపిక చేయబడలేదు. ప్రారంభించడానికి ఒక వస్తువును ఎంచుకోండి.",
    noSectorsMatched: "ఎటువంటి వస్తువులు లభించలేదు",
    adjustFilters: "శోధనను లేదా ఫిల్టర్లను మార్చండి.",
    manufacturerTeams: "ఉత్పత్తిదారులు",
    activeRacingSector: "యాక్టివ్ సెకార్లను ఎంచుకోండి",
    brandsTitle: "అందుబాటులో ఉన్న బ్రాండ్లు & ఎంపికలు",
    brandNameLabel: "బ్రాండ్ పేరు",
    brandPriceLabel: "ధర వివరణ",
    addBrandBtn: "బ్రాండ్‌ను జోడించు",
    brandSuccessMsg: "బ్రాండ్ ఎంపిక విజయవంతంగా జోడించబడింది!",
    noBrandsPlaceholder: "నిర్దిష్ట బ్రాండ్లు ఏవీ లేవు. మార్కెట్ ధర వద్ద అందుబాటులో ఉంది.",
    inStockOption: "స్టాక్ ఉంది",
    outOfStockOption: "స్టాక్ లేదు",
    exitPortal: "పోర్టల్ నుండి నిష్క్రమించు"
  }
};

export default function App() {
  // Navigation State: 'portal' or 'showcase'
  const [viewMode, setViewMode] = useState(() => {
    const token = localStorage.getItem('adminToken');
    return token === 'nagapavan_admin_secret_token' ? 'showcase' : 'portal';
  });

  // Application Data States
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState(['Colgate', 'Dove', 'Patanjali', 'Britannia', 'Nestle', 'ITC', 'Parle', 'Amul', 'Tata', 'HUL']);

  const sanitizeProduct = (p) => {
    if (!p) return p;
    const copied = { ...p };
    if (copied.description) {
      const parts = copied.description.split(/ available at /i);
      if (parts.length > 1) {
        copied.description = parts[0].trim() + ".";
      }
    }
    return copied;
  };
  const sanitizeProducts = (list) => list.map(p => sanitizeProduct(p));

  const handleToggleBrand = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  // Focused Hero Product
  const [focusedProduct, setFocusedProduct] = useState(null);

  // New Brand Option Form States
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandPrice, setNewBrandPrice] = useState('Market Price');
  const [newBrandInStock, setNewBrandInStock] = useState(true);
  const [brandAddSuccess, setBrandAddSuccess] = useState(false);
  const [brandAddError, setBrandAddError] = useState('');
  const [brandAddLoading, setBrandAddLoading] = useState(false);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  // Authentication States
  const [isAdmin, setIsAdmin] = useState(() => {
    const token = localStorage.getItem('adminToken');
    return token === 'nagapavan_admin_secret_token';
  });

  // Mobile Sidebar Drawer State
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Riddle States
  const [showRiddleModal, setShowRiddleModal] = useState(false);
  const [riddleAnswer, setRiddleAnswer] = useState('');
  const [riddleSolved, setRiddleSolved] = useState(false);
  const [riddleError, setRiddleError] = useState('');

  // Portal Interactive States
  const [selectedPortalCard, setSelectedPortalCard] = useState('');
  const [portalPassword, setPortalPassword] = useState('');
  const [portalError, setPortalError] = useState('');
  const [portalLoading, setPortalLoading] = useState(false);

  // UI States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);

  // Theme State
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('themePreference');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Language State
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('langPreference') || 'en';
  });

  // Sync dark mode class with DOM & persist
  useEffect(() => {
    localStorage.setItem('themePreference', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Persist language state
  useEffect(() => {
    localStorage.setItem('langPreference', lang);
  }, [lang]);

  // Translate category helper
  const translateCategory = (catName) => {
    if (lang !== 'te') return catName;
    const catTranslations = {
      "Grains & Cereals": "ధాన్యాలు & తృణధాన్యాలు",
      "Pulses & Lentils": "పప్పుధాన్యాలు & పప్పులు",
      "Spices & Seasonings": "మసాలాలు & దినుసులు",
      "Cooking Oils & Fats": "వంట నూనెలు",
      "Sugar & Sweeteners": "చక్కెర & తీపి పదార్థాలు",
      "Dry Fruits & Nuts": "డ్రై ఫ్రూట్స్ & గింజలు",
      "Baking Supplies": "బేకింగ్ సామాగ్రి",
      "Sauces & Condiments": "సాస్‌లు & చట్నీలు",
      "Pickles & Preserves": "పచ్చళ్ళు",
      "Tea, Coffee & Beverages": "టీ, కాఫీ & పానీయాలు",
      "Dairy Products": "పాల ఉత్పత్తులు",
      "Breakfast Foods": "అల్పాహారాలు",
      "Snacks & Namkeen": "స్నాక్స్ & నమ్‌కీన్",
      "Biscuits & Cookies": "బిస్కెట్లు",
      "Chocolates & Confectionery": "చాక్లెట్లు",
      "Instant Foods": "ఇన్‌స్టంట్ ఫుడ్స్",
      "Baby Care": "శిశు సంరక్షణ",
      "Personal Care": "వ్యక్తిగత సంరక్షణ",
      "Feminine Hygiene": "మహిళల పరిశుభ్రత",
      "Health & OTC Products": "ఆరోగ్య రక్షణ",
      "Laundry Products": "బట్టల సబ్బులు & పొడులు",
      "Cleaning Supplies": "పరిశుభ్రత సామాగ్రి",
      "Household Consumables": "ఇంటి సామాగ్రి",
      "Kitchen Essentials": "వంటగది అవసరాలు",
      "Fresh Produce": "తాజా కూరగాయలు & పండ్లు",
      "Frozen Foods": "ఫ్రోజెన్ ఫుడ్స్",
      "Pet Supplies": "పెంపుడు జంతువుల ఆహారం",
      "Stationery & Utility Items": "స్టేషనరీ సామాగ్రి",
      "Religious & Festival Items": "పూజా సామాగ్రి",
      "Miscellaneous Household Items": "ఇతర గృహ సామాగ్రి"
    };
    return catTranslations[catName] || catName;
  };

  // Fetch initial categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/categories`);
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError(t('dbConnError'));
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE}/api/products`;
      if (selectedCategoryIds.length === 1) {
        url += `?category_id=${selectedCategoryIds[0]}`;
      }
      const res = await axios.get(url);
      const sanitized = sanitizeProducts(res.data);
      setProducts(sanitized);

      if (sanitized.length > 0 && !focusedProduct) {
        setFocusedProduct(sanitized[0]);
      }
      setError('');
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError(t('dbContactError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (viewMode === 'showcase') {
      fetchProducts();
    }
  }, [selectedCategoryIds, viewMode]);

  // Client-side search logic — filters across product name, description, category name, and brand option names
  useEffect(() => {
    if (viewMode !== 'showcase') return;
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        setIsSearching(true);
        const q = searchQuery.toLowerCase();
        const catMap = {};
        categories.forEach(c => { catMap[c.id] = c.name.toLowerCase(); });
        const filtered = products.filter(p => {
          const nameMatch = p.name.toLowerCase().includes(q);
          const descMatch = p.description?.toLowerCase().includes(q);
          const catMatch = (catMap[p.category_id] || '').includes(q);
          const brandMatch = p.brand_options && p.brand_options.some(opt => opt.name.toLowerCase().includes(q));
          return nameMatch || descMatch || catMatch || brandMatch;
        });
        setSearchResults(filtered);
        if (filtered.length > 0) {
          setFocusedProduct(filtered[0]);
        }
      } else {
        setIsSearching(false);
        setSearchResults([]);
      }
    }, 200);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, viewMode, products, categories]);

  // Submit new product (Admin only)
  const handleAddProduct = async (productData) => {
    setFormSubmitLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/products`, productData);
      const sanitized = sanitizeProduct(res.data);
      setProducts(prev => [sanitized, ...prev]);
      setFocusedProduct(sanitized);
      if (isSearching) {
        setSearchResults(prev => [sanitized, ...prev]);
      }
      return sanitized;
    } finally {
      setFormSubmitLoading(false);
    }
  };

  // Add brand option to product (Admin only)
  const handleAddBrandOption = async (productId, brandOptionData) => {
    const res = await axios.post(`${API_BASE}/api/products/${productId}/options`, brandOptionData);
    const sanitized = sanitizeProduct(res.data);
    setProducts(prev => prev.map(p => p.id === productId ? sanitized : p));
    if (focusedProduct?.id === productId) {
      setFocusedProduct(sanitized);
    }
    if (isSearching) {
      setSearchResults(prev => prev.map(p => p.id === productId ? sanitized : p));
    }
    return sanitized;
  };

  // Toggle stock availability (Admin only)
  const handleToggleStock = async (productId) => {
    try {
      const res = await axios.patch(`${API_BASE}/api/products/${productId}/toggle-stock`);
      const sanitized = sanitizeProduct(res.data);
      setProducts(prev => prev.map(p => p.id === productId ? sanitized : p));
      if (focusedProduct?.id === productId) {
        setFocusedProduct(sanitized);
      }
      if (isSearching) {
        setSearchResults(prev => prev.map(p => p.id === productId ? sanitized : p));
      }
    } catch (err) {
      console.error("Failed to toggle stock:", err);
      alert(t('dbStockToggleError'));
    }
  };

  // Riddle Form Submit Verification
  const handleRiddleSubmit = (e) => {
    e.preventDefault();
    setRiddleError('');
    const cleanAnswer = riddleAnswer.toLowerCase().trim();

    if (cleanAnswer === 'onion' || cleanAnswer === 'onions' || cleanAnswer === 'an onion') {
      setRiddleSolved(true);
    } else {
      setRiddleError(t('riddleError'));
    }
  };

  // Admin Verification Submit on Portal Choice
  const handlePortalAdminSubmit = async (e) => {
    e.preventDefault();
    setPortalError('');
    setPortalLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, {
        password: portalPassword
      });
      localStorage.setItem('adminToken', res.data.token);
      setIsAdmin(true);
      setViewMode('showcase');
      setPortalPassword('');
      setSelectedPortalCard('');
    } catch (err) {
      console.error("Portal login failed:", err);
      setPortalError(err.response?.data?.detail ? (lang === 'te' ? 'పాస్‌వర్డ్ చెల్లదు. ప్రవేశం నిరాకరించబడింది.' : err.response.data.detail) : t('invalidPassword'));
    } finally {
      setPortalLoading(false);
    }
  };

  // Safe Exit back to choosing view
  const handleExitToPortal = () => {
    localStorage.removeItem('adminToken');
    setIsAdmin(false);
    setViewMode('portal');
    setSelectedPortalCard('');
    setPortalPassword('');
    setPortalError('');
    setSelectedCategoryIds([]);
    setSearchQuery('');
    setSelectedBrands(['Colgate', 'Dove', 'Patanjali', 'Britannia', 'Nestle', 'ITC', 'Parle', 'Amul', 'Tata', 'HUL']);
    setFocusedProduct(null);
  };

  // Compute final displayed products
  const displayedProducts = (() => {
    let list = isSearching ? searchResults : products;

    if (selectedCategoryIds.length > 0) {
      list = list.filter(p => selectedCategoryIds.includes(p.category_id));
    }

    const MANUFACTURERS = ['Colgate', 'Dove', 'Patanjali', 'Britannia', 'Nestle', 'ITC', 'Parle', 'Amul', 'Tata', 'HUL'];
    if (selectedBrands.length < MANUFACTURERS.length) {
      list = list.filter(p =>
        selectedBrands.some(brand =>
          p.name.toUpperCase().includes(brand.toUpperCase()) ||
          p.description?.toUpperCase().includes(brand.toUpperCase()) ||
          (p.brand_options && p.brand_options.some(opt => opt.name.toUpperCase().includes(brand.toUpperCase())))
        )
      );
    }

    if (statusFilter === 'in_stock') {
      return list.filter(p => p.in_stock);
    } else if (statusFilter === 'out_stock') {
      return list.filter(p => !p.in_stock);
    }
    return list;
  })();

  // Sync focused product
  useEffect(() => {
    if (displayedProducts.length > 0) {
      if (!focusedProduct || !displayedProducts.find(p => p.id === focusedProduct.id)) {
        setFocusedProduct(displayedProducts[0]);
      }
    } else {
      setFocusedProduct(null);
    }
  }, [displayedProducts]);

  const totalInStock = products.filter(p => p.in_stock).length;
  const totalOutStock = products.filter(p => !p.in_stock).length;

  const focusedCategory = categories.find(cat => cat.id === focusedProduct?.category_id);
  const focusedCategoryName = focusedCategory ? focusedCategory.name : 'Uncategorized';

  // Translation helper function
  const t = (key) => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  return (
    <div className="min-h-full bg-bg-main text-text-main flex flex-col font-sans select-none transition-colors duration-200">

      {/* 1. RIDDLE POP-UP MODAL OVERLAY */}
      {showRiddleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md font-mono-system">
          <div className="relative w-full max-w-md p-6 rounded-3xl bg-bg-card border border-border-card shadow-2xl animate-scale-in text-center portal-container">

            {/* Header */}
            <div className="flex flex-col items-center mb-5">
              <div className="p-3 bg-[#bd00ff]/10 border border-[#bd00ff]/25 text-[#bd00ff] mb-3 rounded-full">
                <LockKeyhole className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-wider text-text-main">
                {t('riddleTitle')}
              </h3>
              <p className="text-[10px] text-text-muted uppercase tracking-widest mt-1">
                {t('riddleCriteria')}
              </p>
            </div>

            {/* Riddle Question Card */}
            <div className="p-4 rounded-2xl bg-bg-main border border-border-card text-[#bd00ff] font-bold text-xs tracking-wide italic mb-4 leading-relaxed">
              {t('riddleText')}
            </div>

            {/* Error Message */}
            {riddleError && (
              <div className="p-2.5 mb-4 bg-rose-955/20 border border-rose-900 text-rose-400 text-xs font-semibold rounded-xl uppercase tracking-wider">
                {riddleError}
              </div>
            )}

            {/* riddleSolved state checker */}
            {!riddleSolved ? (
              <form onSubmit={handleRiddleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={riddleAnswer}
                    onChange={(e) => setRiddleAnswer(e.target.value)}
                    placeholder={t('riddlePlaceholder')}
                    className="w-full px-4 py-2.5 border border-border-card rounded-full bg-bg-main text-sm text-text-main focus:outline-none focus:border-[#bd00ff] font-semibold text-center uppercase tracking-wider"
                    autoFocus
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-full text-white font-extrabold bg-gradient-to-r from-[#0052ff] via-[#bd00ff] to-[#00f0ff] hover:opacity-95 transition-all text-xs cursor-pointer uppercase tracking-wider shadow-md shadow-[#bd00ff]/15"
                  >
                    {t('riddleDecrypt')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRiddleModal(false)}
                    className="w-full py-2.5 px-4 rounded-full border border-border-card hover:border-[#bd00ff] bg-bg-card text-text-muted font-semibold text-xs transition-all cursor-pointer uppercase tracking-wider"
                  >
                    {t('riddleAbort')}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-5">
                <div className="p-4 bg-[#bd00ff]/10 border border-[#bd00ff]/30 rounded-2xl flex flex-col items-center">
                  <span className="text-[10px] font-black uppercase text-[#bd00ff] tracking-wider">
                    {t('riddleSuccess')}
                  </span>
                  <div className="text-xs font-bold text-text-muted mt-2 uppercase tracking-widest">
                    {t('riddleCredText')}
                  </div>
                  <div className="text-xl font-bold text-[#bd00ff] mt-1.5 select-all bg-bg-main px-4 py-1.5 border border-dashed border-[#bd00ff]/40 rounded-xl">
                    nagapavan123
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowRiddleModal(false);
                    setRiddleSolved(false);
                    setRiddleAnswer('');
                  }}
                  className="w-full py-3 px-4 rounded-full text-white font-extrabold bg-gradient-to-r from-[#0052ff] via-[#bd00ff] to-[#00f0ff] hover:opacity-90 transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                >
                  <span>{t('riddleProceed')}</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 2. PORTAL LANDING VIEW */}
      {viewMode === 'portal' && (
        <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-bg-main portal-container">

          {/* Background dot grid pattern */}
          <div className="absolute inset-0 brave-grid opacity-35 pointer-events-none" />

          {/* Top colored gradient radial blur */}
          <div className="absolute top-[-100px] left-[15%] w-[450px] h-[450px] bg-gradient-to-br from-[#bd00ff]/10 to-[#0052ff]/5 rounded-full blur-[95px] pointer-events-none" />

          {/* Landing Header Navigation / Solve Riddle & Language Switch */}
          <div className="absolute top-6 right-6 flex items-center gap-2">

            {/* Language Switch */}
            <button
              onClick={() => setLang(lang === 'en' ? 'te' : 'en')}
              className="px-4 py-2 border border-border-card hover:border-[#bd00ff] bg-bg-card text-[#bd00ff] text-[10px] uppercase font-bold tracking-wider rounded-full transition-all cursor-pointer font-mono-system"
            >
              {lang === 'en' ? 'తెలుగు' : 'ENGLISH'}
            </button>

            {/* Dark Mode toggle on landing */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 border border-border-card bg-bg-card text-text-muted hover:text-text-main rounded-full transition-all cursor-pointer"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="h-4 w-4 text-[#bd00ff]" /> : <Moon className="h-4 w-4 text-[#bd00ff]" />}
            </button>

            <button
              onClick={() => setShowRiddleModal(true)}
              className="px-4 py-2 border border-border-card hover:border-[#bd00ff] bg-bg-card text-text-muted text-[10px] uppercase font-bold tracking-wider rounded-full transition-all cursor-pointer font-mono-system"
            >
              🔓 {t('unlockAdminTools')}
            </button>
          </div>

          <div className="w-full max-w-4xl flex flex-col items-center z-10">

            {/* Header Store Branding */}
            <div className="flex items-center gap-3.5 mb-4 animate-fade-in">
              <div className="p-3 bg-[#bd00ff]/10 border border-[#bd00ff]/25 text-[#bd00ff] rounded-full">
                <ShoppingBasket className="h-8 w-8" />
              </div>
              <div className="text-left font-display">
                <h1 className="text-3xl font-extrabold tracking-tight text-text-main sm:text-4xl uppercase">
                  {t('title')}
                </h1>
                <p className="text-[10px] font-mono-system text-[#bd00ff] uppercase tracking-[0.22em] leading-none mt-1 font-bold">
                  {t('tagline')}
                </p>
              </div>
            </div>

            <p className="text-center text-xs sm:text-sm text-text-muted uppercase tracking-widest max-w-lg mb-10 leading-relaxed font-bold">
              {t('welcome')}
            </p>

            {/* Option Cards Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">

              {/* Card 1: Guest User */}
              <div
                onClick={() => {
                  setSelectedPortalCard('guest');
                  setPortalError('');
                }}
                className={`group flex flex-col p-6 rounded-3xl border transition-all duration-300 cursor-pointer ${selectedPortalCard === 'guest'
                    ? 'bg-bg-card/75 glassmorphism border-[#bd00ff] shadow-xl shadow-[#bd00ff]/5 scale-[1.01]'
                    : 'bg-bg-card/50 glassmorphism border-border-card hover:border-text-muted/30 hover:scale-[1.005]'
                  }`}
              >
                <div className="p-3.5 bg-[#bd00ff]/5 text-[#bd00ff] border border-[#bd00ff]/15 rounded-2xl w-fit mb-4 group-hover:scale-105 transition-transform">
                  <ShoppingBag className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-display font-bold uppercase tracking-wider text-text-main mb-2 flex items-center gap-1.5">
                  {t('guestTitle')}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed font-medium mb-6 flex-grow">
                  {t('guestDesc')}
                </p>

                {selectedPortalCard === 'guest' ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAdmin(false);
                      setViewMode('showcase');
                    }}
                    className="w-full py-3 px-4 rounded-full text-white font-extrabold bg-gradient-to-r from-[#0052ff] via-[#bd00ff] to-[#00f0ff] hover:opacity-95 transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider shadow-md shadow-[#bd00ff]/15"
                  >
                    <span>{t('guestButton')}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <span className="text-xs font-bold text-[#bd00ff] flex items-center gap-1 group-hover:translate-x-1 transition-transform font-mono-system uppercase tracking-wider">
                    {t('guestSelect')} <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>

              {/* Card 2: Authenticated Admin */}
              <div
                onClick={() => {
                  setSelectedPortalCard('admin');
                }}
                className={`flex flex-col p-6 rounded-3xl border transition-all duration-300 cursor-pointer ${selectedPortalCard === 'admin'
                    ? 'bg-bg-card/75 glassmorphism border-[#bd00ff] shadow-xl shadow-[#bd00ff]/5 scale-[1.01]'
                    : 'bg-bg-card/50 glassmorphism border-border-card hover:border-text-muted/30 hover:scale-[1.005]'
                  }`}
              >
                <div className="p-3.5 bg-[#bd00ff]/5 text-[#bd00ff] border border-[#bd00ff]/15 rounded-2xl w-fit mb-4">
                  <LockKeyhole className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-display font-bold uppercase tracking-wider text-text-main mb-2">
                  {t('adminTitle')}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed font-medium mb-6 flex-grow">
                  {t('adminDesc')}
                </p>

                {selectedPortalCard === 'admin' ? (
                  /* Expanded password validation form inside card */
                  <form onSubmit={handlePortalAdminSubmit} onClick={(e) => e.stopPropagation()} className="space-y-3.5 w-full">
                    {portalError && (
                      <div className="p-2.5 bg-rose-955/20 border border-rose-900 rounded-xl text-[10px] text-rose-400 font-bold text-center uppercase tracking-wider">
                        {portalError}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={portalPassword}
                        onChange={(e) => setPortalPassword(e.target.value)}
                        placeholder={t('adminPlaceholder')}
                        className="flex-1 px-4 py-2 text-xs border border-border-card rounded-full bg-bg-main text-text-main focus:outline-none focus:border-[#bd00ff] font-semibold uppercase tracking-wider"
                        autoFocus
                        required
                      />
                      <button
                        type="submit"
                        disabled={portalLoading}
                        className="py-2 px-4 rounded-full bg-[#bd00ff] text-white text-xs font-extrabold transition-all shrink-0 cursor-pointer disabled:opacity-50 uppercase tracking-wider"
                      >
                        {portalLoading ? t('verifying') : t('adminButton').toUpperCase()}
                      </button>
                    </div>
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setShowRiddleModal(true)}
                        className="text-[9px] font-mono-system text-[#bd00ff]/80 hover:text-[#bd00ff] font-bold uppercase tracking-widest hover:underline"
                      >
                        {t('forgotPass')}
                      </button>
                    </div>
                  </form>
                ) : (
                  <span className="text-xs font-bold text-[#bd00ff] flex items-center gap-1 font-mono-system uppercase tracking-wider">
                    {t('unlockAdminTools')} <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>

            </div>

            {/* Timings and address indicators on landing */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 text-[10px] text-text-muted font-mono-system font-bold mt-12 pt-6 border-t border-border-card w-full max-w-lg justify-center text-center sm:text-left uppercase tracking-widest">
              <span className="flex items-center justify-center gap-1.5">
                {t('address')}
              </span>
              <span className="flex items-center justify-center gap-1.5">
                {t('timings')}
              </span>
            </div>

          </div>
        </div>
      )}

      {/* 3. MAIN ACTIVE SHOWCASE VIEW (Split Sidebar-on-Left Layout) */}
      {viewMode === 'showcase' && (
        <div className="flex-grow flex">

          {/* Sidebar */}
          <Sidebar
            categories={categories}
            selectedCategoryIds={selectedCategoryIds}
            setSelectedCategoryIds={setSelectedCategoryIds}
            products={products}
            selectedBrands={selectedBrands}
            onToggleBrand={handleToggleBrand}
            onSubmitProduct={handleAddProduct}
            formSubmitLoading={formSubmitLoading}
            isAdmin={isAdmin}
            onExit={handleExitToPortal}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            t={t}
            translateCategory={translateCategory}
            focusedProduct={focusedProduct}
            onAddBrandOption={handleAddBrandOption}
            brandAddState={{
              newBrandName, setNewBrandName,
              newBrandPrice, setNewBrandPrice,
              newBrandInStock, setNewBrandInStock,
              brandAddSuccess, setBrandAddSuccess,
              brandAddError, setBrandAddError,
              brandAddLoading, setBrandAddLoading
            }}
            lang={lang}
          />

          {/* Main Content Pane */}
          <div className="flex-1 lg:pl-72 flex flex-col min-h-screen bg-bg-main">

            {/* Top Header Bar */}
            <BrandedHeader
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              darkMode={darkMode}
              toggleDarkMode={() => setDarkMode(!darkMode)}
              isAdmin={isAdmin}
              onMenuToggle={() => setSidebarOpen(true)}
              onExit={handleExitToPortal}
              lang={lang}
              setLang={setLang}
              t={t}
            />

            {/* Main Product Catalog Panel */}
            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-5xl w-full mx-auto space-y-6">

              {/* HERO: Focused Product Specification Panel */}
              {focusedProduct ? (
                <div className="relative border border-[#bd00ff]/30 bg-bg-card/75 glassmorphism p-6 rounded-2xl shadow-xl shadow-[#bd00ff]/5 animate-fade-in">

                  <div className="mb-4">
                    <span className="text-[10px] font-mono-system text-text-muted uppercase tracking-widest block mb-1.5 font-bold">
                      {t('heroTitle')}
                    </span>
                    <h2 className="font-display text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#0052ff] via-[#bd00ff] to-[#00f0ff] uppercase leading-none">
                      {focusedProduct.name}
                    </h2>
                    <p className="font-mono-system text-[11px] text-text-muted mt-2 uppercase tracking-wide">
                      {t('sectorAllocLabel')} {translateCategory(focusedCategoryName)} // {t('statusLabel')} {focusedProduct.in_stock ? t('optimized') : t('systemDegradation')}
                    </p>
                  </div>

                  <p className="text-sm text-text-muted leading-relaxed mb-6 font-medium">
                    {focusedProduct.description || (lang === 'en' ? `Fresh and high-quality ${focusedProduct.name.toLowerCase()} allocated to sector ${focusedCategoryName.toLowerCase()}.` : `${translateCategory(focusedCategoryName)} విభాగంలో కేటాయించబడిన తాజా మరియు నాణ్యమైన ${focusedProduct.name}.`)}
                  </p>

                  {/* Brand Options Section */}
                  <div className="mt-5 border-t border-border-card pt-5">
                    <h3 className="font-display text-sm font-bold uppercase tracking-wider text-text-main mb-3 flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 text-[#bd00ff]" />
                      {t('brandsTitle')}
                    </h3>

                    {/* Existing Brand Options List */}
                    {focusedProduct.brand_options && focusedProduct.brand_options.length > 0 ? (
                      <div className="space-y-2 mb-4">
                        {focusedProduct.brand_options.map((opt, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-bg-main/50 border border-border-card font-mono-system text-xs transition-all hover:border-[#bd00ff]/30"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#bd00ff] shrink-0" />
                              <span className="font-bold text-text-main uppercase tracking-wide">{opt.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] text-text-muted font-semibold uppercase">{opt.price || 'Market Price'}</span>
                              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${opt.in_stock
                                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                                }`}>
                                {opt.in_stock ? t('inStockOption') : t('outOfStockOption')}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 px-3 border border-dashed border-border-card rounded-xl mb-4">
                        <p className="text-[10px] text-text-muted/60 font-mono-system uppercase tracking-wider font-bold">
                          {t('noBrandsPlaceholder')}
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                <div className="border border-dashed border-border-card bg-bg-card p-6 rounded-2xl text-center font-mono-system">
                  <span className="text-[10px] text-text-muted uppercase tracking-widest">
                    // {lang === 'te' ? 'సిస్టమ్ లోపం' : 'DEPLOY SYSTEM ERROR'}
                  </span>
                  <div className="text-sm font-bold text-text-muted/80 mt-2 uppercase tracking-wider">
                    {t('noComponentFocus')}
                  </div>
                </div>
              )}



              {/* Header Dashboard & Filters Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border border-border-card bg-bg-card rounded-2xl font-mono-system">
                <div>
                  <h2 className="text-sm font-bold text-text-main flex items-center gap-2 uppercase tracking-wide">
                    <ShoppingBasket className="h-4.5 w-4.5 text-[#bd00ff]" />
                    {t('deployedTitle')}
                  </h2>
                  <p className="text-[9px] text-text-muted/55 font-bold uppercase tracking-wider mt-0.5">
                    {t('filtersApplied')} {statusFilter.toUpperCase()} STATUS • {selectedCategoryIds.length} {lang === 'te' ? 'విభాగాలు' : 'SECTORS'} • {selectedBrands.length === 10 ? (lang === 'te' ? 'అన్ని బ్రాండ్లు' : 'ALL BRANDS') : `${selectedBrands.length} BRANDS`}
                  </p>
                </div>

                {/* Stock Tab Filters */}
                <div className="flex bg-bg-main border border-border-card p-1 rounded-full w-full sm:w-auto text-[10px] font-bold tracking-wider uppercase">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`flex-grow sm:flex-initial px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${statusFilter === 'all'
                        ? 'bg-gradient-to-r from-[#0052ff] via-[#bd00ff] to-[#00f0ff] text-white font-extrabold'
                        : 'text-text-muted hover:text-text-main'
                      }`}
                  >
                    {t('allUnits')} ({products.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('in_stock')}
                    className={`flex-grow sm:flex-initial px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${statusFilter === 'in_stock'
                        ? 'bg-gradient-to-r from-[#0052ff] via-[#bd00ff] to-[#00f0ff] text-white font-extrabold'
                        : 'text-text-muted hover:text-text-main'
                      }`}
                  >
                    {t('inStock')} ({totalInStock})
                  </button>
                  <button
                    onClick={() => setStatusFilter('out_stock')}
                    className={`flex-grow sm:flex-initial px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${statusFilter === 'out_stock'
                        ? 'bg-rose-600 text-white font-extrabold'
                        : 'text-text-muted hover:text-text-main'
                      }`}
                  >
                    {t('outStock')} ({totalOutStock})
                  </button>
                </div>
              </div>

              {/* Catalog Product Grid */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 font-mono-system">
                  <RefreshCw className="h-8 w-8 text-[#bd00ff] animate-spin" />
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                    {lang === 'te' ? 'ఇన్వెంటరీ వివరాలను సింక్ చేస్తోంది...' : 'SYNCING INVENTORY SECTOR READOUTS...'}
                  </p>
                </div>
              ) : displayedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 animate-fade-in">
                  {displayedProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      categories={categories}
                      onToggleStock={handleToggleStock}
                      isAdmin={isAdmin}
                      isSelected={focusedProduct?.id === product.id}
                      onSelect={(p) => setFocusedProduct(p)}
                      t={t}
                      translateCategory={translateCategory}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-border-card bg-bg-card/40 rounded-2xl font-mono-system">
                  <CircleAlert className="h-10 w-10 text-text-muted/40 mb-3" />
                  <h3 className="font-bold text-text-muted text-sm uppercase tracking-wider">{t('noSectorsMatched')}</h3>
                  <p className="text-[10px] text-text-muted/60 mt-1 max-w-xs text-center font-bold uppercase tracking-wide">
                    {t('adjustFilters')}
                  </p>
                </div>
              )}

            </main>

            {/* Footer */}
            <footer className="w-full border-t border-border-card py-6 text-center text-[10px] text-text-muted/50 bg-bg-main font-mono-system uppercase tracking-widest mt-auto">
              <p>&copy; 2026 {lang === 'te' ? 'నాగ పవన్ మర్చండైజ్ మరియు జనరల్ మర్చంట్స్. డెవలప్ చేయబడింది FastAPI, React & Tailwind CSS తో.' : 'Naga Pavan Merchandise and General Merchants. Developed with FastAPI, React & Tailwind CSS.'}</p>
              <p className="mt-1.5 font-bold text-[#bd00ff] flex items-center justify-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#bd00ff] shrink-0" />
                {lang === 'te' ? 'స్టేట్‌లెస్ అసమకాలిక ఇన్వెంటరీ కంట్రోల్ ఇంజన్ v3.0' : 'Stateless Asynchronous Inventory Control Engine v3.0'}
              </p>
            </footer>

          </div>
        </div>
      )}

    </div>
  );
}
