// src/app/marketplace/page.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Search,
  ShoppingCart,
  Heart,
  Star,
  ChevronDown,
  SlidersHorizontal,
  Grid,
  List,
  TrendingUp,
  Menu,
  User,
} from 'lucide-react';

// Mock products
const MOCK_PRODUCTS = [
  {
    id: '1',
    title: 'iPhone 13 Pro Max - 256GB',
    price: 850000,
    originalPrice: 950000,
    rating: 4.8,
    reviews: 234,
    image: '📱',
    seller: 'Tech Store MW',
    condition: 'New',
    shipping: 'Free',
    location: 'Blantyre',
  },
  {
    id: '2',
    title: 'MacBook Air M2 - 2023',
    price: 1200000,
    rating: 4.9,
    reviews: 189,
    image: '💻',
    seller: 'Laptop World',
    condition: 'New',
    shipping: 'Free',
    location: 'Lilongwe',
  },
  {
    id: '3',
    title: 'Nike Air Max Sneakers',
    price: 45000,
    originalPrice: 65000,
    rating: 4.6,
    reviews: 156,
    image: '👟',
    seller: 'Fashion Hub MW',
    condition: 'New',
    shipping: 'MK 2,000',
    location: 'Blantyre',
  },
  {
    id: '4',
    title: 'Sony WH-1000XM5 Headphones',
    price: 125000,
    rating: 4.9,
    reviews: 312,
    image: '🎧',
    seller: 'Audio Pro',
    condition: 'New',
    shipping: 'Free',
    location: 'Mzuzu',
  },
  {
    id: '5',
    title: 'Samsung 55" 4K Smart TV',
    price: 450000,
    rating: 4.7,
    reviews: 198,
    image: '📺',
    seller: 'Electronics Plus',
    condition: 'New',
    shipping: 'MK 5,000',
    location: 'Lilongwe',
  },
  {
    id: '6',
    title: 'Canon EOS R6 Camera',
    price: 950000,
    rating: 4.9,
    reviews: 87,
    image: '📷',
    seller: 'Camera Corner',
    condition: 'Like New',
    shipping: 'Free',
    location: 'Blantyre',
  },
];

const CATEGORIES = [
  { name: 'Electronics', icon: '📱', count: 1234 },
  { name: 'Fashion', icon: '👕', count: 892 },
  { name: 'Home & Garden', icon: '🏠', count: 567 },
  { name: 'Sports & Outdoors', icon: '⚽', count: 445 },
  { name: 'Books & Media', icon: '📚', count: 334 },
  { name: 'Toys & Games', icon: '🎮', count: 289 },
  { name: 'Health & Beauty', icon: '💄', count: 456 },
  { name: 'Automotive', icon: '🚗', count: 223 },
];

export default function MarketplacePage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-MW', {
      style: 'currency',
      currency: 'MWK',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const calculateDiscount = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="border-b bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <Link href="/" className="hover:underline">
                Sell on Gigrise
              </Link>
              <Link href="/help" className="hover:underline">
                Help & Contact
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/notifications" className="hover:underline">
                Notifications
              </Link>
              <Link href="/cart" className="hover:underline">
                My Cart
              </Link>
              <Link
                href="/account"
                className="flex items-center space-x-1 hover:underline"
              >
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
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-lg bg-linear-to-br from-blue-600 to-purple-600"></div>
              <div>
                <span className="block text-xl font-bold text-gray-900">
                  Gigrise
                </span>
                <span className="block text-xs text-gray-600">Marketplace</span>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="hidden max-w-2xl flex-1 px-8 md:block">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="flex-1 rounded-l-lg border border-r-0 border-gray-300 px-4 py-2.5 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
                <select className="border-y border-gray-300 bg-gray-50 px-3 text-sm text-gray-700 focus:outline-none">
                  <option>All Categories</option>
                  <option>Electronics</option>
                  <option>Fashion</option>
                  <option>Home & Garden</option>
                </select>
                <button className="rounded-r-lg bg-blue-600 px-6 text-white hover:bg-blue-700">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button className="hidden items-center space-x-2 md:flex">
                <Heart className="h-6 w-6 text-gray-600" />
                <span className="text-sm text-gray-700">Watchlist</span>
              </button>
              <Link href="/cart" className="relative">
                <ShoppingCart className="h-6 w-6 text-gray-600" />
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  3
                </span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Categories Bar */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center space-x-6 overflow-x-auto">
            <button className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-blue-600">
              <Menu className="h-5 w-5" />
              <span>All Categories</span>
            </button>
            {CATEGORIES.slice(0, 6).map((cat) => (
              <Link
                key={cat.name}
                href={`/marketplace/${cat.name.toLowerCase()}`}
                className="text-sm whitespace-nowrap text-gray-700 hover:text-blue-600"
              >
                {cat.name}
              </Link>
            ))}
            <Link
              href="/deals"
              className="text-sm font-medium text-red-600 hover:text-red-700"
            >
              Daily Deals
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <aside
            className={`lg:block ${showFilters ? 'block' : 'hidden'} lg:col-span-1`}
            style={{ maxHeight: 'calc(100vh - 10rem)', overflowY: 'auto' }} // This will make the filters scrollable
          >
            <div className="sticky top-6 space-y-6 rounded-lg bg-white p-6 shadow-sm">
              {/* Categories */}
              <div>
                <h3 className="mb-3 flex items-center justify-between font-semibold text-gray-900">
                  <span>Categories</span>
                  <SlidersHorizontal className="h-4 w-4" />
                </h3>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <label
                      key={cat.name}
                      className="flex cursor-pointer items-center justify-between rounded p-2 hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {cat.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{cat.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="mb-3 font-semibold text-gray-900">
                  Price Range
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                    Apply
                  </button>
                </div>
              </div>

              {/* Condition */}
              <div>
                <h3 className="mb-3 font-semibold text-gray-900">Condition</h3>
                <div className="space-y-2">
                  {['New', 'Like New', 'Used', 'Refurbished'].map(
                    (condition) => (
                      <label
                        key={condition}
                        className="flex cursor-pointer items-center"
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {condition}
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Shipping */}
              <div>
                <h3 className="mb-3 font-semibold text-gray-900">Shipping</h3>
                <div className="space-y-2">
                  <label className="flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Free Shipping
                    </span>
                  </label>
                  <label className="flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Local Pickup
                    </span>
                  </label>
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="mb-3 font-semibold text-gray-900">Location</h3>
                <div className="space-y-2">
                  {['Blantyre', 'Lilongwe', 'Mzuzu', 'Zomba'].map(
                    (location) => (
                      <label
                        key={location}
                        className="flex cursor-pointer items-center"
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {location}
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div
            className="overflow-y-auto lg:col-span-3"
            style={{ maxHeight: 'calc(100vh - 10rem)' }}
          >
            {' '}
            {/* This will make the product grid scrollable */}
            {/* Results Header */}
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">
                  {MOCK_PRODUCTS.length}
                </span>{' '}
                results
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
                    <option value="featured">Best Match</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                    <option value="rating">Highest Rated</option>
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
            {/* Products */}
            <div
              className={
                viewMode === 'grid'
                  ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'
                  : 'space-y-4'
              }
            >
              {MOCK_PRODUCTS.map((product) => (
                <Link
                  key={product.id}
                  href={`/marketplace/${product.id}`}
                  className={`group block rounded-lg border bg-white transition hover:shadow-lg ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  {/* Product Image */}
                  <div
                    className={`flex items-center justify-center bg-gray-100 text-6xl ${
                      viewMode === 'list' ? 'w-48' : 'h-64'
                    }`}
                  >
                    {product.image}
                  </div>

                  {/* Product Info */}
                  <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <h3 className="mb-2 line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-blue-600">
                      {product.title}
                    </h3>

                    {/* Rating */}
                    <div className="mb-2 flex items-center space-x-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600">
                        ({product.reviews})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mb-2">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-xl font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <>
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                            <span className="text-xs font-semibold text-red-600">
                              -
                              {calculateDiscount(
                                product.originalPrice,
                                product.price
                              )}
                              %
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-1 text-xs text-gray-600">
                      <p>
                        <span className="font-medium">Condition:</span>{' '}
                        {product.condition}
                      </p>
                      <p>
                        <span className="font-medium">Shipping:</span>{' '}
                        {product.shipping}
                      </p>
                      <p>
                        <span className="font-medium">Location:</span>{' '}
                        {product.location}
                      </p>
                      <p className="text-gray-500">Sold by: {product.seller}</p>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Added to cart!');
                      }}
                      className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      Add to Cart
                    </button>
                  </div>
                </Link>
              ))}
            </div>
            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <div className="flex items-center space-x-2">
                <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Previous
                </button>
                <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white">
                  1
                </button>
                <button className="text-gray-700text-sm rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">
                  2
                </button>
                <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  3
                </button>
                <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
