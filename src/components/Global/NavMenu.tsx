'use client'

import { useState } from 'react'
import Link from 'next/link'

const menuItems = {
  Personal: [
    'Family Law',
    'Estate Planning',
    'Personal Injury',
    'Criminal Defense',
    'Immigration',
  ],
  Business: [
    'Contract Law',
    'Corporate Formation',
    'Intellectual Property',
    'Employment Law',
    'Mergers & Acquisitions',
  ],
  Financial: [
    'Tax Law',
    'Banking Regulations',
    'Securities Law',
    'Bankruptcy',
    'Financial Compliance',
  ],
  Social: [
    'Discrimination',
    'Labour Rights',
    'Environmental Protection',
    'Corporate Malpractices',
    'Unlawful Government Malpractices',
  ],
}

export function NavMenu() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  return (
    <nav className="hidden md:flex items-center space-x-8">
      {Object.entries(menuItems).map(([category, items]) => (
        <div
          key={category}
          className="relative group"
          onMouseEnter={() => setActiveMenu(category)}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <Link
            href="#"
            className="text-sm font-medium text-slate-200 hover:text-white transition-colors py-2"
          >
            {category}
          </Link>
          {activeMenu === category && (
            <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-50">
              {items.map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}

