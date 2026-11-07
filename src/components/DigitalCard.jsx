import React, { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import { Download, Share2, Check, ShieldCheck, Sparkles, AlertTriangle, XCircle, Cpu } from 'lucide-react';

export default function DigitalCard({ card, org, onSelectVerify }) {
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Format timestamps
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).toUpperCase();
  };

  // Determine current effective status
  const now = Math.floor(Date.now() / 1000);
  const isExpired = Number(card.expiresAt) < now;
  
  let statusLabel = 'ACTIVE';
  let statusTheme = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/20';
  let badgeIcon = <ShieldCheck className="w-3.5 h-3.5" />;

  if (card.status === 2 || card.status === 'Revoked') {
    statusLabel = 'REVOKED';
    statusTheme = 'bg-red-500/20 text-red-300 border-red-500/40 shadow-red-500/20';
    badgeIcon = <XCircle className="w-3.5 h-3.5" />;
  } else if (card.status === 1 || card.status === 'Suspended') {
    statusLabel = 'SUSPENDED';
    statusTheme = 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-500/20';
    badgeIcon = <AlertTriangle className="w-3.5 h-3.5" />;
  } else if (isExpired || card.status === 3 || card.status === 'Expired') {
    statusLabel = 'EXPIRED';
    statusTheme = 'bg-orange-500/20 text-orange-300 border-orange-500/40 shadow-orange-500/20';
    badgeIcon = <AlertTriangle className="w-3.5 h-3.5" />;
  }

  const verifyUrl = `${window.location.origin}/?tab=verify&cardId=${card.id || card.cardId}`;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      setDownloading(true);
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        quality: 0.98,
        pixelRatio: 2.5
      });
      const link = document.createElement('a');
      link.download = `MemberChain-Card-${card.membershipNumber || card.id}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download card:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Visual Card (Render target for PNG download) */}
      <div
        ref={cardRef}
        className="w-full max-w-[420px] aspect-[1.62/1] rounded-2xl p-6 relative card-metallic flex flex-col justify-between text-white select-none border border-white/20 shadow-2xl transition-all duration-300"
      >
        {/* Top bar: Organization Branding & Status */}
        <div className="flex items-start justify-between z-10">
          <div className="flex items-center space-x-3 max-w-[70%]">
            {org?.logoUrl ? (
              <img
                src={org.logoUrl}
                alt="Org Logo"
                className="w-10 h-10 rounded-lg object-cover border border-white/20 bg-slate-900"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-white text-base shadow-inner">
                {(org?.name || 'MC').slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="font-bold text-sm tracking-wide uppercase line-clamp-1 text-slate-100 font-['Space_Grotesk']">
                {org?.name || 'MEMBERCHAIN REGISTRY'}
              </h3>
              <p className="text-[10px] tracking-wider text-sky-400 font-medium">
                OFFICIAL MEMBERSHIP
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider border shadow-md ${statusTheme}`}>
            {badgeIcon}
            <span>{statusLabel}</span>
          </div>
        </div>

        {/* Middle: Smart Chip & Hologram */}
        <div className="flex items-center justify-between z-10 my-1">
          <div className="flex items-center space-x-3">
            {/* Metallic Smart Chip graphic */}
            <div className="w-11 h-8 rounded-md bg-gradient-to-tr from-amber-200 via-yellow-400 to-amber-500 border border-amber-300/60 shadow flex items-center justify-center relative overflow-hidden">
              <div className="w-full h-[1px] bg-amber-800/40 absolute top-2"></div>
              <div className="w-full h-[1px] bg-amber-800/40 absolute bottom-2"></div>
              <div className="h-full w-[1px] bg-amber-800/40 absolute left-4"></div>
              <Cpu className="w-4 h-4 text-amber-900/60 relative z-10" />
            </div>
            
            {/* Contactless / On-chain Badge */}
            <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-mono tracking-widest">
              <Sparkles className="w-3 h-3 text-sky-400" />
              <span>BOTCHAIN 968</span>
            </div>
          </div>

          {/* QR Code */}
          <div 
            onClick={() => onSelectVerify && onSelectVerify(card.id || card.cardId)}
            className="p-1.5 bg-white rounded-lg shadow-md cursor-pointer hover:scale-105 transition-transform"
            title="Scan or click to verify"
          >
            <QRCodeSVG
              value={verifyUrl}
              size={64}
              level="M"
              includeMargin={false}
            />
          </div>
        </div>

        {/* Bottom bar: Member Name, Membership Number & Dates */}
        <div className="z-10 grid grid-cols-2 gap-y-2 pt-2 border-t border-white/10">
          <div>
            <div className="text-[9px] tracking-wider uppercase text-slate-400 font-semibold">
              MEMBER NAME
            </div>
            <div className="text-sm font-bold tracking-tight text-white line-clamp-1">
              {card.memberName || 'REGISTERED MEMBER'}
            </div>
          </div>

          <div className="text-right">
            <div className="text-[9px] tracking-wider uppercase text-slate-400 font-semibold">
              MEMBERSHIP NO.
            </div>
            <div className="text-sm font-mono font-bold tracking-wider text-sky-300">
              {card.membershipNumber || `MBR-${String(card.id || 1).padStart(6, '0')}`}
            </div>
          </div>

          <div>
            <div className="text-[9px] tracking-wider uppercase text-slate-400 font-semibold">
              ISSUED
            </div>
            <div className="text-xs font-mono text-slate-300">
              {formatDate(card.issuedAt)}
            </div>
          </div>

          <div className="text-right">
            <div className="text-[9px] tracking-wider uppercase text-slate-400 font-semibold">
              EXPIRES
            </div>
            <div className="text-xs font-mono text-slate-300">
              {formatDate(card.expiresAt)}
            </div>
          </div>
        </div>
      </div>

      {/* Card Action Controls */}
      <div className="w-full max-w-[420px] flex items-center justify-between mt-3 px-1">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex-1 mr-2 inline-flex items-center justify-center space-x-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/80 transition-all shadow-sm active:scale-95"
        >
          <Download className="w-3.5 h-3.5 text-sky-400" />
          <span>{downloading ? 'Exporting...' : 'Download Card'}</span>
        </button>

        <button
          onClick={handleCopyLink}
          className="inline-flex items-center justify-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/80 transition-all shadow-sm active:scale-95"
          title="Copy Verification Link"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-slate-300" />
              <span>Share QR Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

