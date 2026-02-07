// src/app/page.tsx
import Link from 'next/link';
import {
  ArrowRight,
  Shield,
  Zap,
  Globe,
  TrendingUp,
  Users,
  CheckCircle,
  Star,
  Briefcase,
  ShoppingBag,
  Clock,
  Laptop,
  Paintbrush,
  Edit,
  Smartphone,
  Film,
  Phone,
  Tag,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-linear-to-br from-blue-600 to-purple-600"></div>
                <span className="text-xl font-bold text-gray-900">Gigrise</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden items-center space-x-8 md:flex">
              <Link
                href="#features"
                className="text-gray-600 transition hover:text-gray-900"
              >
                Features
              </Link>
              <Link
                href="#categories"
                className="text-gray-600 transition hover:text-gray-900"
              >
                Categories
              </Link>
              <Link
                href="#pricing"
                className="text-gray-600 transition hover:text-gray-900"
              >
                Pricing
              </Link>
              <Link
                href="/about"
                className="text-gray-600 transition hover:text-gray-900"
              >
                About
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="font-medium text-gray-600 transition hover:text-gray-900"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white px-4 pt-28 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* LEFT: Text Content */}
          <div className="text-left">
            <h1 className="mb-6 text-5xl leading-tight font-bold text-gray-900 md:text-7xl">
              Your Gateway to
              <br />
              <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Freelance Success
              </span>
            </h1>

            <p className="mb-10 max-w-3xl text-xl leading-relaxed text-gray-600">
              Connect with talented freelancers, hire for projects, or sell your
              products. Gigrise brings opportunities to your fingertips with
              secure payments and escrow protection.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-start gap-4 sm:flex-row">
              <Link
                href="/signup?type=client"
                className="flex w-full items-center justify-center space-x-2 rounded-lg bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 sm:w-auto"
              >
                <span>Hire Freelancers</span>
                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                href="/signup?type=freelancer"
                className="w-full rounded-lg border-2 border-gray-200 bg-white px-8 py-4 font-semibold text-gray-900 transition hover:border-gray-300 sm:w-auto"
              >
                Start Freelancing
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid max-w-2xl grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-gray-900">500+</div>
                <div className="mt-1 text-sm text-gray-600">
                  Active Freelancers
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">1,000+</div>
                <div className="mt-1 text-sm text-gray-600">
                  Projects Completed
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">MK50M+</div>
                <div className="mt-1 text-sm text-gray-600">
                  Paid to Freelancers
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Visual Enhancement */}
          <div className="relative hidden lg:block">
            {/* Gradient background blob */}
            <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-linear-to-r from-blue-500 to-purple-600 opacity-30 blur-3xl"></div>

            {/* Floating cards */}
            <div className="relative flex flex-col gap-6">
              <div className="w-72 rounded-xl bg-white p-5 shadow-xl">
                <div className="text-sm font-semibold text-gray-900">
                  Web Designer
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  UI/UX • Figma • Webflow
                </div>
                <div className="mt-3 text-sm font-bold text-blue-600">
                  MK120,000 / project
                </div>
              </div>

              <div className="ml-16 w-72 rounded-xl bg-white p-5 shadow-xl">
                <div className="text-sm font-semibold text-gray-900">
                  Mobile App Developer
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Flutter • React Native
                </div>
                <div className="mt-3 text-sm font-bold text-purple-600">
                  MK200,000 / project
                </div>
              </div>

              <div className="ml-8 w-72 rounded-xl bg-white p-5 shadow-xl">
                <div className="text-sm font-semibold text-gray-900">
                  Digital Marketer
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  SEO • Ads • Growth
                </div>
                <div className="mt-3 text-sm font-bold text-green-600">
                  MK90,000 / project
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Why Choose Gigrise?
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              Everything you need to succeed in the digital economy
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-2xl bg-white p-8 shadow-sm transition hover:shadow-md">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                Secure Escrow Payments
              </h3>
              <p className="leading-relaxed text-gray-600">
                Your funds are protected. Money is held securely until work is
                completed and approved. Support for mobile money and
                international payments.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl bg-white p-8 shadow-sm transition hover:shadow-md">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                Dual Platform
              </h3>
              <p className="leading-relaxed text-gray-600">
                Freelance services and product marketplace in one place. Hire
                talent or buy products - all your business needs covered.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl bg-white p-8 shadow-sm transition hover:shadow-md">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Globe className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                Local & Global Reach
              </h3>
              <p className="leading-relaxed text-gray-600">
                Optimized for Malawi with mobile-first design and local payment
                methods. Ready to scale across Africa and beyond.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl bg-white p-8 shadow-sm transition hover:shadow-md">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                Grow Your Business
              </h3>
              <p className="leading-relaxed text-gray-600">
                Access analytics, insights, and tools to grow your freelance
                business or marketplace sales. Premium features for serious
                entrepreneurs.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-2xl bg-white p-8 shadow-sm transition hover:shadow-md">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100">
                <Users className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                Verified Profiles
              </h3>
              <p className="leading-relaxed text-gray-600">
                Work with confidence. All freelancers and sellers are verified.
                Check ratings, reviews, and portfolios before hiring.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-2xl bg-white p-8 shadow-sm transition hover:shadow-md">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
                <CheckCircle className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                Easy to Use
              </h3>
              <p className="leading-relaxed text-gray-600">
                Simple, intuitive interface. Post a gig in minutes, browse
                services easily, and manage everything from one dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section id="categories" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Explore Popular Categories
            </h2>
            <p className="text-xl text-gray-600">
              Find the perfect freelancer or product for your needs
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
            {[
              {
                name: 'Web Development',
                icon: <Laptop className="h-6 w-6 text-indigo-600" />,
                count: '120+ gigs',
              },
              {
                name: 'Graphic Design',
                icon: <Paintbrush className="h-6 w-6 text-indigo-600" />,
                count: '85+ gigs',
              },
              {
                name: 'Content Writing',
                icon: <Edit className="h-6 w-6 text-indigo-600" />,
                count: '95+ gigs',
              },
              {
                name: 'Digital Marketing',
                icon: <Smartphone className="h-6 w-6 text-indigo-600" />,
                count: '70+ gigs',
              },
              {
                name: 'Video Editing',
                icon: <Film className="h-6 w-6 text-indigo-600" />,
                count: '45+ gigs',
              },
              {
                name: 'Mobile Apps',
                icon: <Phone className="h-6 w-6 text-indigo-600" />,
                count: '55+ gigs',
              },
              {
                name: 'Electronics',
                icon: <Zap className="h-6 w-6 text-indigo-600" />,
                count: '200+ products',
              },
              {
                name: 'Fashion',
                icon: <Tag className="h-6 w-6 text-indigo-600" />,
                count: '150+ products',
              },
            ].map((category) => (
              <Link
                key={category.name}
                href={`/browse?category=${category.name.toLowerCase().replace(' ', '-')}`}
                className="group rounded-xl border-2 border-gray-200 bg-white p-6 transition hover:border-blue-500 hover:shadow-md"
              >
                <div className="mb-3 text-4xl">{category.icon}</div>
                <h3 className="mb-1 font-semibold text-gray-900 group-hover:text-blue-600">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600">{category.count}</p>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/browse"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <span className="font-semibold">View All Categories</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Dual Platform Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Side - Freelance */}
            <div className="rounded-2xl bg-linear-to-br from-blue-50 to-purple-50 p-8">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-4 text-3xl font-bold text-gray-900">
                Freelance Services
              </h3>
              <p className="mb-6 text-lg text-gray-600">
                Find skilled professionals for your projects. From web
                development to graphic design, get quality work delivered on
                time.
              </p>
              <ul className="mb-8 space-y-3">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="mr-3 h-5 w-5 text-green-600" />
                  <span>Browse 500+ skilled freelancers</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="mr-3 h-5 w-5 text-green-600" />
                  <span>Secure escrow payments</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="mr-3 h-5 w-5 text-green-600" />
                  <span>Ratings and reviews</span>
                </li>
              </ul>
              <Link
                href="/browse-gigs"
                className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                <span>Browse Gigs</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            {/* Right Side - Marketplace */}
            <div className="rounded-2xl bg-linear-to-br from-purple-50 to-pink-50 p-8">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-600">
                <ShoppingBag className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-4 text-3xl font-bold text-gray-900">
                Product Marketplace
              </h3>
              <p className="mb-6 text-lg text-gray-600">
                Buy and sell products with ease. Electronics, fashion, home
                goods, and more - all in one convenient marketplace.
              </p>
              <ul className="mb-8 space-y-3">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="mr-3 h-5 w-5 text-green-600" />
                  <span>Shop 1000+ products</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="mr-3 h-5 w-5 text-green-600" />
                  <span>Safe payment options</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="mr-3 h-5 w-5 text-green-600" />
                  <span>Seller verification</span>
                </li>
              </ul>
              <Link
                href="/marketplace"
                className="inline-flex items-center space-x-2 rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
              >
                <span>Browse Products</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start free, upgrade when you grow
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
            {/* Free Plan */}
            <div className="rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-sm">
              <div className="mb-8 text-center">
                <h3 className="mb-2 text-2xl font-bold text-gray-900">
                  Freemium
                </h3>
                <div className="mb-4 text-5xl font-bold text-gray-900">
                  Free
                </div>
                <p className="text-gray-600">Perfect for getting started</p>
              </div>
              <ul className="mb-8 space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="mt-0.5 mr-3 h-5 w-5 shrink-0 text-green-600" />
                  <span className="text-gray-600">Post up to 3 gigs</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mt-0.5 mr-3 h-5 w-5 shrink-0 text-green-600" />
                  <span className="text-gray-600">
                    List up to 5 marketplace items
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mt-0.5 mr-3 h-5 w-5 shrink-0 text-green-600" />
                  <span className="text-gray-600">Basic messaging</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mt-0.5 mr-3 h-5 w-5 shrink-0 text-green-600" />
                  <span className="text-gray-600">15% platform fee</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mt-0.5 mr-3 h-5 w-5 shrink-0 text-green-600" />
                  <span className="text-gray-600">Standard support</span>
                </li>
              </ul>
              <Link
                href="/signup"
                className="block w-full rounded-lg bg-gray-900 px-6 py-4 text-center font-semibold text-white transition hover:bg-gray-800"
              >
                Get Started Free
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="relative rounded-2xl bg-linear-to-br from-blue-600 to-purple-600 p-8 text-white shadow-lg">
              <div className="absolute top-4 right-4 rounded-full bg-yellow-400 px-3 py-1 text-sm font-bold text-gray-900">
                Popular
              </div>
              <div className="mb-8 text-center">
                <h3 className="mb-2 text-2xl font-bold">Premium</h3>
                <div className="mb-1 text-5xl font-bold">MK 15,000</div>
                <p className="text-blue-100">per month</p>
              </div>
              <ul className="mb-8 space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="mt-0.5 mr-3 h-5 w-5 shrink-0 text-yellow-300" />
                  <span>Unlimited gigs</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mt-0.5 mr-3 h-5 w-5 shrink-0 text-yellow-300" />
                  <span>Unlimited marketplace listings</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mt-0.5 mr-3 h-5 w-5 shrink-0 text-yellow-300" />
                  <span>Priority in search results</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mt-0.5 mr-3 h-5 w-5 shrink-0 text-yellow-300" />
                  <span>10% platform fee (save 5%!)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mt-0.5 mr-3 h-5 w-5 shrink-0 text-yellow-300" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mt-0.5 mr-3 h-5 w-5 shrink-0 text-yellow-300" />
                  <span>Featured listings</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mt-0.5 mr-3 h-5 w-5 shrink-0 text-yellow-300" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Link
                href="/signup?plan=premium"
                className="block w-full rounded-lg bg-white px-6 py-4 text-center font-semibold text-blue-600 transition hover:bg-gray-50"
              >
                Upgrade to Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-linear-to-br from-blue-600 to-purple-600 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            Ready to Get Started?
          </h2>
          <p className="mb-10 text-xl text-blue-100">
            Join thousands of freelancers and clients building the future of
            work in Malawi
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/signup?type=freelancer"
              className="rounded-lg bg-white px-8 py-4 font-semibold text-blue-600 shadow-lg transition hover:bg-gray-50"
            >
              Start as Freelancer
            </Link>
            <Link
              href="/signup?type=client"
              className="rounded-lg border-2 border-white bg-transparent px-8 py-4 font-semibold text-white transition hover:bg-white/10"
            >
              Hire Talent
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-gray-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-linear-to-br from-blue-600 to-purple-600"></div>
                <span className="text-xl font-bold text-white">Gigrise</span>
              </div>
              <p className="text-sm">
                Empowering Malawi's digital economy, one gig at a time.
              </p>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-white">For Clients</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/browse-gigs"
                    className="transition hover:text-white"
                  >
                    Find Freelancers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/marketplace"
                    className="transition hover:text-white"
                  >
                    Browse Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/post-project"
                    className="transition hover:text-white"
                  >
                    Post a Project
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-white">For Freelancers</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/start-selling"
                    className="transition hover:text-white"
                  >
                    Start Selling
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="transition hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/resources"
                    className="transition hover:text-white"
                  >
                    Resources
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-white">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="transition hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="transition hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="transition hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="transition hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2026 Gigrise. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
