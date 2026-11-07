import React, { useState } from 'react';
import { 
  Building2, Users, ShieldCheck, ArrowRight, Sparkles, 
  CreditCard, ExternalLink, Search, CheckCircle, Shield
} from 'lucide-react';
import DigitalCard from './DigitalCard';

export default function OrgDirectory({ onNavigate, onSelectVerify }) {
  const [search, setSearch] = useState('');

  // Example organizations registered on MemberChain
  const organizations = [
    {
      id: 1,
      name: 'Elite Business Network',
      category: 'Professional Association',
      description: 'Exclusive network connecting founders, high-level executives, and venture investors.',
      membersCount: 250,
      activeCards: 220,
      logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      wallet: '0x3429B85Fe893De1208D16c52Fe487E7b30c1491e',
      sampleCard: {
        id: 125,
        memberName: 'GANIYU RIDWAN',
        membershipNumber: 'MBR-000125',
        issuedAt: 1793923200,
        expiresAt: 1825459200,
        status: 0,
      }
    },
    {
      id: 2,
      name: 'Global Developers Guild',
      category: 'Tech Community',
      description: 'Worldwide decentralized community of Web3 engineers and open source contributors.',
      membersCount: 412,
      activeCards: 395,
      logoUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=120&auto=format&fit=crop&q=80',
      wallet: '0x89A5F121C16053Fa31D9D4537D08518eA6054e99',
      sampleCard: {
        id: 126,
        memberName: 'ALEX RIVERA',
        membershipNumber: 'GDG-000412',
        issuedAt: 1793923200,
        expiresAt: 1825459200,
        status: 0,
      }
    },
    {
      id: 3,
      name: 'Apex Athletic Club',
      category: 'Sports & Fitness',
      description: 'Private fitness & athletic club providing digital pass access to sports facilities.',
      membersCount: 180,
      activeCards: 175,
      logoUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=120&auto=format&fit=crop&q=80',
      wallet: '0x5C808Ea898511faE86875567a147048701B4B692',
      sampleCard: {
        id: 127,
        memberName: 'SARAH CHEN',
        membershipNumber: 'AAC-000180',
        issuedAt: 1793923200,
        expiresAt: 1825459200,
        status: 0,
      }
    }
  ];

  const filteredOrgs = organizations.filter(org => 
    org.name.toLowerCase().includes(search.toLowerCase()) ||
    org.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-16 py-8">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-6 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Organization Digital Card Registry on Botchain</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-['Space_Grotesk'] text-white tracking-tight leading-tight">
            Your Membership.<br />
            Your Identity. <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-400">On-Chain.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Issue and verify tamper-proof digital membership cards on the Botchain blockchain. Replace fragile paper passes with verifiable Web3 identity credentials.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-sky-500/25 transition-all transform hover:-translate-y-0.5"
            >
              Issue Cards for Your Organization
            </button>
            <button
              onClick={() => onNavigate('my-cards')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-all"
            >
              View My Digital Cards
            </button>
            <button
              onClick={() => onNavigate('verify')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800 text-sky-400 border border-sky-500/30 font-semibold text-sm transition-all flex items-center justify-center space-x-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify a Card</span>
            </button>
          </div>
        </div>

        {/* Hero Card Demo Showcase */}
        <div className="mt-12 flex justify-center">
          <div className="transform hover:scale-[1.02] transition-transform duration-300">
            <DigitalCard
              card={organizations[0].sampleCard}
              org={organizations[0]}
              onSelectVerify={onSelectVerify}
            />
          </div>
        </div>
      </section>

      {/* Feature Value Props */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
              On-Chain Cryptographic Proof
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every membership card is immutably registered on Botchain (Chain ID 968). Status cannot be faked or tampered with.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
              Downloadable High-Res Passes
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Export digital membership cards directly to mobile devices or desktop with high-resolution rendering and QR codes.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
              Zero-Gas Public Verification
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Anyone can scan a card’s QR code or search its ID to verify validity instantly with no MetaMask or gas fees required.
            </p>
          </div>
        </div>
      </section>

      {/* Organization Directory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
              Registered Organizations
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Browse communities, clubs, and institutions issuing credentials on MemberChain.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search organizations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredOrgs.map((org) => (
            <div 
              key={org.id} 
              className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={org.logoUrl}
                    alt={org.name}
                    className="w-12 h-12 rounded-xl object-cover border border-white/10 bg-slate-900"
                  />
                  <div>
                    <h3 className="font-bold text-white text-sm line-clamp-1">
                      {org.name}
                    </h3>
                    <span className="text-[10px] text-sky-400 font-semibold uppercase tracking-wider">
                      {org.category}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                  {org.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Members</span>
                  <span className="font-bold text-white font-mono">{org.membersCount}</span>
                </div>
                <button
                  onClick={() => onSelectVerify(org.sampleCard.id)}
                  className="inline-flex items-center space-x-1 text-sky-400 hover:text-sky-300 font-semibold text-xs"
                >
                  <span>Sample Pass</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

