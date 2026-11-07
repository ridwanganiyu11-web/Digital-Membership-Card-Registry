import React from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { ShieldCheck, Layers, CreditCard, Building2, ExternalLink } from 'lucide-react';
import { botchainTestnet } from '../config/botchain';

export default function Navbar({ activeTab, setActiveTab }) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const isCorrectChain = chainId === botchainTestnet.id;

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Tagline */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('home')}
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 via-cyan-500 to-indigo-600 p-[2px] shadow-lg shadow-sky-500/25 group-hover:scale-105 transition-transform overflow-hidden">
              <img 
                src="/logo.svg" 
                alt="MemberChain Logo" 
                className="w-full h-full object-cover rounded-[14px] bg-slate-950" 
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight text-white font-['Space_Grotesk']">
                  Member<span className="text-sky-400">Chain</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-950/80 text-sky-300 border border-sky-800/60">
                  Botchain 968
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Your Membership. Your Identity. On-Chain.
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                activeTab === 'home'
                  ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Organizations</span>
            </button>

            <button
              onClick={() => setActiveTab('my-cards')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                activeTab === 'my-cards'
                  ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>My Cards</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                activeTab === 'dashboard'
                  ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Org Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('verify')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                activeTab === 'verify'
                  ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify Card</span>
            </button>
          </nav>

          {/* Wallet & Network Control */}
          <div className="flex items-center space-x-3">
            {isConnected && !isCorrectChain && (
              <button
                onClick={() => switchChain({ chainId: botchainTestnet.id })}
                className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-colors animate-pulse"
              >
                Switch to Botchain (968)
              </button>
            )}

            {/* Reown AppKit Button */}
            <div className="reown-connect-wrapper">
              <appkit-button balance="hide" />
            </div>
          </div>
        </div>

        {/* Mobile Nav Row */}
        <div className="flex md:hidden border-t border-slate-800/80 py-2.5 justify-around">
          <button
            onClick={() => setActiveTab('home')}
            className={`text-xs px-2.5 py-1.5 rounded-md ${activeTab === 'home' ? 'text-sky-400 font-semibold bg-sky-950/60' : 'text-slate-400'}`}
          >
            Directory
          </button>
          <button
            onClick={() => setActiveTab('my-cards')}
            className={`text-xs px-2.5 py-1.5 rounded-md ${activeTab === 'my-cards' ? 'text-sky-400 font-semibold bg-sky-950/60' : 'text-slate-400'}`}
          >
            My Cards
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`text-xs px-2.5 py-1.5 rounded-md ${activeTab === 'dashboard' ? 'text-sky-400 font-semibold bg-sky-950/60' : 'text-slate-400'}`}
          >
            Org Portal
          </button>
          <button
            onClick={() => setActiveTab('verify')}
            className={`text-xs px-2.5 py-1.5 rounded-md ${activeTab === 'verify' ? 'text-sky-400 font-semibold bg-sky-950/60' : 'text-slate-400'}`}
          >
            Verify
          </button>
        </div>
      </div>
    </header>
  );
}
