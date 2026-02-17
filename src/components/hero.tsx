'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';

// Font Awesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLaptopCode,
  faMobileScreen,
  faChartLine,
  faPaintbrush,
  faPenNib,
  faVideo,
} from '@fortawesome/free-solid-svg-icons';

const FREELANCER_CARDS = [
  {
    id: 1,
    title: 'Web Designer',
    skills: 'UI/UX • Figma • Webflow',
    price: 'MK120,000',
    duration: '3 days',
    rating: 4.9,
    gradient: 'from-blue-500 to-blue-600',
    faIcon: faLaptopCode,
    color: 'blue',
  },
  {
    id: 2,
    title: 'Mobile Developer',
    skills: 'Flutter • React Native',
    price: 'MK200,000',
    duration: '5 days',
    rating: 5.0,
    gradient: 'from-purple-500 to-purple-600',
    faIcon: faMobileScreen,
    color: 'purple',
  },
  {
    id: 3,
    title: 'Digital Marketer',
    skills: 'SEO • Ads • Growth',
    price: 'MK90,000',
    duration: '2 days',
    rating: 4.8,
    gradient: 'from-green-500 to-green-600',
    faIcon: faChartLine,
    color: 'green',
  },
  {
    id: 4,
    title: 'Graphic Designer',
    skills: 'Logo • Branding • Print',
    price: 'MK75,000',
    duration: '2 days',
    rating: 4.9,
    gradient: 'from-pink-500 to-pink-600',
    faIcon: faPaintbrush,
    color: 'pink',
  },
  {
    id: 5,
    title: 'Content Writer',
    skills: 'SEO • Blog • Copywriting',
    price: 'MK45,000',
    duration: '1 day',
    rating: 4.7,
    gradient: 'from-indigo-500 to-indigo-600',
    faIcon: faPenNib,
    color: 'indigo',
  },
  {
    id: 6,
    title: 'Video Editor',
    skills: 'Premiere • After Effects',
    price: 'MK150,000',
    duration: '4 days',
    rating: 4.8,
    gradient: 'from-orange-500 to-orange-600',
    faIcon: faVideo,
    color: 'orange',
  },
];

// Helper
const rand = (min: number, max: number) => Math.random() * (max - min) + min;

// Pre-compute scatter once (outside component – stable enough)
const initialScatter = FREELANCER_CARDS.map(() => ({
  radius: rand(120, 220),
  angle: rand(0, Math.PI * 2),
  lift: rand(-40, 40),
  rotate: rand(-12, 12),
  speed: rand(0.15, 0.3),
}));

export default function EnhancedHeroSection() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(0);
  const [scatter] = useState(initialScatter); // initializer only – no setter

  // Mark as mounted (this is the standard Next.js pattern)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Auto cycle active card
  const [activeCard, setActiveCard] = useState(0);
  useEffect(() => {
    const cycle = setInterval(() => {
      setActiveCard((p) => (p + 1) % FREELANCER_CARDS.length);
    }, 3500);
    return () => clearInterval(cycle);
  }, []);

  // Orbit animation clock
  useEffect(() => {
    const tick = setInterval(() => {
      setTime((t) => t + 0.01);
    }, 16);
    return () => clearInterval(tick);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative overflow-hidden bg-white px-4 pt-28 pb-20 sm:px-6 sm:pt-20 sm:pb-10 lg:px-8 lg:pt-10">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
        {/* LEFT */}
        <div>
          <h1 className="mb-6 text-5xl leading-tight font-bold text-gray-900 md:text-7xl">
            Your Gateway to
            <br />
            <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Freelance Success
            </span>
          </h1>

          <p className="mb-10 max-w-3xl text-xl text-gray-600">
            Connect with talented freelancers, hire for projects, or sell your
            products. Gigrise brings opportunities to your fingertips with
            secure payments and escrow protection.
          </p>

          <div className="flex gap-4">
            <Link
              href="/signup?type=client"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg transition hover:bg-blue-700"
            >
              Hire Freelancers <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/signup?type=freelancer"
              className="rounded-lg border-2 px-8 py-4 font-semibold text-gray-900"
            >
              Start Freelancing
            </Link>
          </div>
        </div>

        {/* RIGHT – ORBITING SCATTER */}
        <div className="relative hidden h-[620px] lg:block">
          {scatter.map((s, i) => {
            const card = FREELANCER_CARDS[i];
            const isActive = i === activeCard;

            const angle = s.angle + time * s.speed;
            const x = Math.cos(angle) * s.radius;
            const y =
              Math.sin(angle) * s.radius * 0.6 + s.lift - (isActive ? 40 : 0);

            return (
              <div
                key={card.id}
                className="absolute top-1/2 left-1/2 w-80 rounded-2xl bg-white p-6 transition-all duration-700 ease-out"
                style={{
                  transform: `
                    translate(-50%, -50%)
                    translate(${x}px, ${y}px)
                    rotate(${s.rotate}deg)
                    scale(${isActive ? 1.08 : 0.94})
                  `,
                  zIndex: isActive ? 40 : 10,
                  opacity: isActive ? 1 : 0.8,
                  boxShadow: isActive
                    ? '0 40px 80px rgba(0,0,0,0.25)'
                    : '0 20px 40px rgba(0,0,0,0.15)',
                }}
              >
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-r ${card.gradient} text-xl text-white`}
                    >
                      <FontAwesomeIcon icon={card.faIcon} />
                    </div>
                    <div>
                      <div className="font-bold">{card.title}</div>
                      <div className="text-xs text-gray-500">{card.skills}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold">{card.rating}</span>
                  </div>
                </div>

                <div className="my-4 h-px bg-gray-200" />

                <div className="flex justify-between">
                  <div>
                    <div className={`text-lg font-bold text-${card.color}-600`}>
                      {card.price}
                    </div>
                    <div className="text-xs text-gray-500">per project</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{card.duration}</div>
                    <div className="text-xs text-gray-500">delivery</div>
                  </div>
                </div>

                {isActive && (
                  <button
                    className={`mt-4 w-full rounded-lg bg-linear-to-r ${card.gradient} py-2 text-sm font-semibold text-white`}
                  >
                    View Profile
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
