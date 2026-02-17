// src/app/about/page.tsx
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faHandshake,
  faMobileScreenButton,
  faShieldHalved,
  faGlobeAfrica,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero-like header */}
      <section className="bg-linear-to-br from-blue-600 to-purple-600 py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 text-4xl font-bold md:text-5xl">About Gigrise</h1>
          <p className="mx-auto max-w-3xl text-xl text-blue-100">
            Empowering Malawi&apos;s digital economy by connecting talent,
            buyers, and sellers in one trusted platform.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold text-gray-900">
              Our Mission
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              We built Gigrise to make freelancing and online commerce simple,
              secure, and accessible — especially for Malawians and across
              Africa.
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl bg-gray-50 p-8">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                <FontAwesomeIcon
                  icon={faUsers}
                  className="h-8 w-8 text-blue-600"
                />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                For Freelancers & Sellers
              </h3>
              <p className="text-gray-600">
                Post gigs, sell products, get verified, receive secure payments
                via mobile money or international methods, and grow your
                business with analytics and priority visibility.
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-8">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100">
                <FontAwesomeIcon
                  icon={faHandshake}
                  className="h-8 w-8 text-purple-600"
                />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                For Clients & Buyers
              </h3>
              <p className="text-gray-600">
                Find skilled talent or quality products, use escrow protection,
                read real reviews, and pay confidently knowing your money is
                safe until you&apos;re satisfied.
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-8">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">
                <FontAwesomeIcon
                  icon={faMobileScreenButton}
                  className="h-8 w-8 text-green-600"
                />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                Made for Malawi — Ready for Africa
              </h3>
              <p className="text-gray-600">
                Mobile-first design, local payment integration (mobile money),
                and support for scaling beyond borders while staying rooted in
                trust and opportunity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-linear-to-br from-blue-600 to-purple-600 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-4xl font-bold md:text-5xl">
            Join the Gigrise Movement
          </h2>
          <p className="mb-10 text-xl text-blue-100">
            Be part of Malawi&apos;s growing digital future — whether
            you&apos;re freelancing, hiring, buying, or selling.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/signup?type=freelancer"
              className="rounded-lg bg-white px-8 py-4 font-semibold text-blue-600 shadow-lg transition hover:bg-gray-50"
            >
              Start as Freelancer / Seller
            </Link>
            <Link
              href="/signup?type=client"
              className="rounded-lg border-2 border-white bg-transparent px-8 py-4 font-semibold text-white transition hover:bg-white/10"
            >
              Hire or Buy Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Optional: better SEO
export const metadata = {
  title: 'About Gigrise – Malawi’s Freelance & Marketplace Platform',
  description:
    'Learn about Gigrise: connecting talent and buyers in Malawi with secure payments, verified profiles, and local-first design.',
};
