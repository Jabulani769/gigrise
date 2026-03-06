// src/app/marketplace/page.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { MarketplaceSkeleton } from '@/components/skeletons/Skeleton';
import {
  Search,
  ShoppingCart,
  Heart,
  Star,
  SlidersHorizontal,
  Grid,
  List,
  Menu,
  User,
  Loader2,
  Home,
  MessageCircle,
  Bell,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  location: string;
  shipping_cost: number;
  images: string[] | null;
  seller_id: string;
  created_at: string;
  seller: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MarketplacePage() {
  const router = useRouter();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [freeShippingOnly, setFreeShippingOnly] = useState(false);

  // ✅ Load categories and products on mount
  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [sortBy, selectedCategories, minPrice, maxPrice, selectedConditions, selectedLocations, freeShippingOnly]);

  // ✅ Load categories
  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Load categories error:', err);
    }
  };

  // ✅ Load products with filters
  const loadProducts = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('marketplace_items')
        .select(`
          *,
          seller:profiles!marketplace_items_seller_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .eq('is_active', true);

      // Apply category filter
      if (selectedCategories.length > 0) {
        query = query.in('category', selectedCategories);
      }

      // Apply price filters
      if (minPrice) {
        query = query.gte('price', parseFloat(minPrice));
      }
      if (maxPrice) {
        query = query.lte('price', parseFloat(maxPrice));
      }

      // Apply condition filter
      if (selectedConditions.length > 0) {
        query = query.in('condition', selectedConditions);
      }

      // Apply location filter
      if (selectedLocations.length > 0) {
        query = query.in('location', selectedLocations);
      }

      // Apply free shipping filter
      if (freeShippingOnly) {
        query = query.eq('shipping_cost', 0);
      }

      // Apply sorting
      switch (sortBy) {
        case 'price-low':
          query = query.order('price', { ascending: true });
          break;
        case 'price-high':
          query = query.order('price', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;

      // Apply search filter client-side (simple text search)
      let filteredData = data || [];
      if (searchQuery.trim()) {
        const search = searchQuery.toLowerCase();
        filteredData = filteredData.filter(
          (p) =>
            p.title.toLowerCase().includes(search) ||
            p.description?.toLowerCase().includes(search)
        );
      }

      setProducts(filteredData);
    } catch (err) {
      console.error('Load products error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadProducts();
  };

  // ✅ Toggle category filter
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // ✅ Toggle condition filter
  const toggleCondition = (condition: string) => {
    setSelectedConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition]
    );
  };

  // ✅ Toggle location filter
  const toggleLocation = (location: string) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((l) => l !== location)
        : [...prev, location]
    );
  };

  const formatPrice = (price: number) => {
    return `MK ${price.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="border-b bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <Link href="/feed" className="hover:underline">
                Back to Feed
              </Link>
              <Link href="/help" className="hover:underline">
                Help & Contact
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/notifications" className="hover:underline">
                Notifications
              </Link>
              <Link href="/profile" className="flex items-center space-x-1 hover:underline">
                <User className="h-4 w-4" />
                <span>Account</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Navigation */}
      <nav className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between py-3">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600"></div>
              <div>
                <span className="block text-xl font-bold text-gray-900">Gigrise</span>
                <span className="block text-xs text-gray-600">Marketplace</span>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="hidden max-w-2xl flex-1 px-8 md:block">
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="flex-1 rounded-l-lg border border-r-0 border-gray-300 px-4 py-2.5 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="rounded-r-lg bg-blue-600 px-6 text-white hover:bg-blue-700"
                >
                  <Search className="h-5 w-5" />
                </button>
              </form>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <Link href="/feed" className="hidden items-center space-x-2 md:flex">
                <Home className="h-6 w-6 text-gray-600" />
              </Link>
              <Link href="/messages" className="hidden items-center space-x-2 md:flex">
                <MessageCircle className="h-6 w-6 text-gray-600" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Categories Bar */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center space-x-6 overflow-x-auto">
            <button
              onClick={() => setSelectedCategories([])}
              className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              <Menu className="h-5 w-5" />
              <span>All Categories</span>
            </button>
            {categories.slice(0, 6).map((cat) => (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.name)}
                className={`whitespace-nowrap text-sm ${
                  selectedCategories.includes(cat.name)
                    ? 'font-semibold text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <aside
            className={`lg:block ${showFilters ? 'block' : 'hidden'} lg:col-span-1`}
          >
            <div className="sticky top-6 space-y-6 rounded-lg bg-white p-6 shadow-sm">
              {/* Categories */}
              <div>
                <h3 className="mb-3 flex items-center justify-between font-semibold text-gray-900">
                  <span>Categories</span>
                  <SlidersHorizontal className="h-4 w-4" />
                </h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label
                      key={cat.id}
                      className="flex cursor-pointer items-center justify-between rounded p-2 hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat.name)}
                          onChange={() => toggleCategory(cat.name)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{cat.name}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="mb-3 font-semibold text-gray-900">Price Range</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => loadProducts()}
                    className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Condition */}
              <div>
                <h3 className="mb-3 font-semibold text-gray-900">Condition</h3>
                <div className="space-y-2">
                  {['New', 'Like New', 'Used', 'Refurbished'].map((condition) => (
                    <label key={condition} className="flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={selectedConditions.includes(condition)}
                        onChange={() => toggleCondition(condition)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{condition}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Shipping */}
              <div>
                <h3 className="mb-3 font-semibold text-gray-900">Shipping</h3>
                <label className="flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={freeShippingOnly}
                    onChange={(e) => setFreeShippingOnly(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Free Shipping Only</span>
                </label>
              </div>

              {/* Location */}
              <div>
                <h3 className="mb-3 font-semibold text-gray-900">Location</h3>
                <div className="space-y-2">
                  {['Blantyre', 'Lilongwe', 'Mzuzu', 'Zomba'].map((location) => (
                    <label key={location} className="flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={selectedLocations.includes(location)}
                        onChange={() => toggleLocation(location)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{location}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSelectedCategories([]);
                  setMinPrice('');
                  setMaxPrice('');
                  setSelectedConditions([]);
                  setSelectedLocations([]);
                  setFreeShippingOnly(false);
                  setSearchQuery('');
                }}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Clear All Filters
              </button>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">{products.length}</span> results
              </p>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Filters</span>
                </button>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
                <div className="hidden items-center space-x-2 sm:flex">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`rounded p-2 ${viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                  >
                    <Grid className="h-5 w-5 text-gray-700" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`rounded p-2 ${viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                  >
                    <List className="h-5 w-5 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <MarketplaceSkeleton />
            ) : products.length === 0 ? (
              <div className="rounded-lg bg-white p-12 text-center shadow-sm">
                <p className="text-4xl">🔍</p>
                <h3 className="mt-4 font-semibold text-gray-900">No products found</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Try adjusting your filters or search query
                </p>
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setMinPrice('');
                    setMaxPrice('');
                    setSelectedConditions([]);
                    setSelectedLocations([]);
                    setFreeShippingOnly(false);
                    setSearchQuery('');
                  }}
                  className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              /* Products */
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'
                    : 'space-y-4'
                }
              >
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/marketplace/${product.id}`}
                    className={`group block rounded-lg border bg-white transition hover:shadow-lg ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    {/* Product Image */}
                    <div
                      className={`flex items-center justify-center bg-gray-100 ${
                        viewMode === 'list' ? 'w-48' : 'h-64'
                      }`}
                    >
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-6xl">📦</span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <h3 className="mb-2 line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-blue-600">
                        {product.title}
                      </h3>

                      {/* Price */}
                      <div className="mb-2">
                        <span className="text-xl font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="space-y-1 text-xs text-gray-600">
                        <p>
                          <span className="font-medium">Condition:</span> {product.condition}
                        </p>
                        <p>
                          <span className="font-medium">Shipping:</span>{' '}
                          {product.shipping_cost === 0
                            ? 'Free'
                            : formatPrice(product.shipping_cost)}
                        </p>
                        <p>
                          <span className="font-medium">Location:</span> {product.location}
                        </p>
                        <p className="text-gray-500">
                          Sold by: {product.seller?.full_name || 'Unknown'}
                        </p>
                      </div>

                      {/* View Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          router.push(`/marketplace/${product.id}`);
                        }}
                        className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        View Details
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}