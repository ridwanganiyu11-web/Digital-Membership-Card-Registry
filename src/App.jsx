import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import OrgDirectory from './components/OrgDirectory';
import MyCards from './components/MyCards';
import OrgDashboard from './components/OrgDashboard';
import VerifyCard from './components/VerifyCard';
import { ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [targetCardId, setTargetCardId] = useState(null);

  // Check URL query parameters (e.g., when scanned via QR code)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    const cardParam = params.get('cardId');

    if (tabParam === 'verify' || cardParam) {
      setActiveTab('verify');
      if (cardParam) {
        setTargetCardId(cardParam);
      }
    }
  }, []);

  const handleSelectVerify = (cardId) => {
    setTargetCardId(cardId);
    setActiveTab('verify');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-slate-100">
      {/* Navigation Header with Reown AppKit */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Pages */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <OrgDirectory 
            onNavigate={(tab) => setActiveTab(tab)}
            onSelectVerify={handleSelectVerify}
          />
        )}

        {activeTab === 'my-cards' && (
          <MyCards 
            onSelectVerify={handleSelectVerify}
            onGoToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'dashboard' && (
          <OrgDashboard onSelectVerify={handleSelectVerify} />
        )}

        {activeTab === 'verify' && (
          <VerifyCard initialCardId={targetCardId} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-300 font-['Space_Grotesk']">MemberChain</span>
            <span>•</span>
            <span>Your Membership. Your Identity. On-Chain.</span>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="https://scan.bohr.life/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 flex items-center space-x-1 transition-colors"
            >
              <span>Botchain Testnet (Chain ID 968)</span>
              <ExternalLink className="w-3 h-3 text-sky-400" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

