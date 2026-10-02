import React, { useState, useEffect } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  Clock, 
  Users, 
  Building2, 
  MapPin, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import QRCode from 'qrcode';
import { Token } from '../types';
import { useQueue } from '../context/QueueContext';

interface TokenReceiptModalProps {
  token: Token | null;
  onClose: () => void;
  onTrackLive?: (tokenNumber: string) => void;
}

export const TokenReceiptModal: React.FC<TokenReceiptModalProps> = ({
  token,
  onClose,
  onTrackLive
}) => {
  const { calculateTokenQueueInfo, t, setActiveView, setSearchTerm } = useQueue();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  useEffect(() => {
    if (token) {
      const qrPayload = JSON.stringify({
        portal: 'QueueWise-Gov',
        tokenNumber: token.tokenNumber,
        service: token.serviceName,
        org: token.organizationName,
        bookingTime: token.bookingTime,
        citizen: token.citizenName,
        counter: token.counterNumber,
      });

      QRCode.toDataURL(qrPayload, {
        width: 160,
        margin: 1,
        color: {
          dark: '#0b2545',
          light: '#ffffff'
        }
      })
      .then(url => setQrCodeDataUrl(url))
      .catch(err => console.error('QR generation error', err));
    }
  }, [token]);

  if (!token) return null;

  const queueInfo = calculateTokenQueueInfo(token);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate text/HTML blob or download trigger
    const receiptContent = `
========================================
       QUEUEWISE CITIZEN TOKEN SLIP
   Smart Digital Queue Management System
========================================
Token Number: ${token.tokenNumber}
Status: ${token.status.toUpperCase()}
Citizen Name: ${token.citizenName}
Mobile: ${token.citizenMobile}

Organization: ${token.organizationName}
Branch: ${token.branchName}
Department: ${token.departmentName}
Service: ${token.serviceName}
Assigned Desk: ${token.counterNumber}

Booking Date & Time: ${new Date(token.bookingTime).toLocaleString()}
Current Running Token: ${queueInfo.currentRunningTokenNumber}
Citizens Ahead: ${queueInfo.peopleAhead}
Estimated Waiting Time: ${queueInfo.estimatedWaitMinutes} Minutes

* Please reach the counter when 2 people are ahead.
========================================
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `QueueWise-Token-${token.tokenNumber}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden my-auto print:border-none print:shadow-none print:max-w-full">
        {/* Top Government Bar */}
        <div className="bg-[#002D62] text-white px-6 py-4 flex items-center justify-between border-b border-[#001F45] print:bg-slate-900">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider">{t.portalTitle}</div>
              <div className="text-[10px] text-slate-300">CITIZEN DIGITAL TOKEN RECEIPT</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors print:hidden"
            id="btn-close-receipt"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Content */}
        <div id="printable-token-receipt" className="p-6 space-y-4 text-xs sm:text-sm bg-[#F2F4F7] border-b border-slate-200">
          {/* Official Seal / Header */}
          <div className="text-center pb-3 border-b border-slate-200">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              PUBLIC SERVICE TOKEN
            </div>
            <div className="text-lg font-extrabold text-[#002D62] font-sans mt-0.5">
              {token.organizationName}
            </div>
            <div className="text-xs text-slate-600 font-medium">
              {token.branchName}
            </div>
          </div>

          {/* Token Box */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 text-center shadow-xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase">Your Token Number</div>
            <div className="text-3xl sm:text-4xl font-black text-[#002D62] font-mono tracking-widest my-1.5">
              {token.tokenNumber}
            </div>
            <div className="inline-block bg-blue-50 text-[#002D62] text-xs font-bold px-3 py-1 rounded-full border border-blue-200 uppercase">
              {token.status === 'serving' ? 'NOW SERVING' : 'WAITING IN QUEUE'}
            </div>
            {token.isSeniorCitizenOrPriority && (
              <div className="text-[11px] font-bold text-amber-700 mt-1.5">
                ★ Priority / Senior Citizen Category
              </div>
            )}
          </div>

          {/* Core Queue Calculation Grid (Section 16 & 17) */}
          <div className="grid grid-cols-2 gap-2.5 bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs">
            <div className="border-r border-slate-100 pr-2">
              <span className="text-[11px] text-slate-500 block uppercase">Current Serving:</span>
              <span className="text-sm font-bold text-[#002D62] font-mono">
                {queueInfo.currentRunningTokenNumber}
              </span>
            </div>

            <div className="pl-2">
              <span className="text-[11px] text-slate-500 block uppercase">{t.peopleAhead}:</span>
              <span className="text-sm font-bold text-slate-900">
                {queueInfo.peopleAhead} Citizens
              </span>
            </div>

            <div className="border-r border-slate-100 pr-2 pt-2 border-t">
              <span className="text-[11px] text-slate-500 block uppercase">{t.estWait}:</span>
              <span className="text-sm font-bold text-amber-700">
                ~{queueInfo.estimatedWaitMinutes} Minutes
              </span>
            </div>

            <div className="pl-2 pt-2 border-t">
              <span className="text-[11px] text-slate-500 block uppercase">Counter Desk:</span>
              <span className="text-sm font-bold text-slate-900">
                {token.counterNumber}
              </span>
            </div>
          </div>

          {/* Service & Citizen Details */}
          <div className="space-y-2 text-xs text-slate-700 bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Department:</span>
              <span className="font-semibold text-slate-900">{token.departmentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Service:</span>
              <span className="font-semibold text-slate-900">{token.serviceName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Citizen Name:</span>
              <span className="font-semibold text-slate-900">{token.citizenName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Mobile No:</span>
              <span className="font-semibold text-slate-900">{token.citizenMobile}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Booking Time:</span>
              <span className="font-mono text-slate-900">{new Date(token.bookingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
            </div>
          </div>

          {/* QR Code (Section 27) */}
          <div className="flex items-center justify-between bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs">
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-[#002D62] uppercase">Verification QR Code</div>
              <p className="text-[10px] text-slate-500 leading-tight max-w-[200px]">
                Scan at the entrance kiosk or present to counter clerk for digital verification.
              </p>
              <div className="text-[10px] font-mono text-slate-400">ID: {token.id}</div>
            </div>
            <div className="border border-slate-200 p-1.5 bg-white rounded-lg shrink-0">
              {qrCodeDataUrl ? (
                <img src={qrCodeDataUrl} alt="Token QR Code" className="w-20 h-20" />
              ) : (
                <div className="w-20 h-20 bg-slate-100 flex items-center justify-center text-[10px] text-slate-400">QR</div>
              )}
            </div>
          </div>

          {/* Instructions Footer */}
          <div className="text-[11px] text-slate-500 text-center leading-relaxed border-t border-slate-200 pt-2.5">
            * Please arrive at the waiting hall when <strong>2 people</strong> remain ahead of your token. Tokens missed upon 3 announcements will be marked No-Show.
          </div>
        </div>

        {/* Action Buttons (Hidden during window.print) */}
        <div className="p-4 bg-white flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center space-x-2">
            <button
              id="btn-print-token-receipt"
              onClick={handlePrint}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg border border-slate-200 flex items-center space-x-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-700" />
              <span>{t.btnPrint}</span>
            </button>

            <button
              id="btn-download-token-slip"
              onClick={handleDownload}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg border border-slate-200 flex items-center space-x-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-700" />
              <span>{t.btnDownload}</span>
            </button>
          </div>

          <button
            id="btn-receipt-track-live"
            onClick={() => {
              if (onTrackLive) {
                onTrackLive(token.tokenNumber);
              } else {
                setSearchTerm(token.tokenNumber);
                setActiveView('queue-status');
              }
              onClose();
            }}
            className="px-5 py-2 bg-[#002D62] hover:bg-[#001F45] text-white text-xs font-bold rounded-lg flex items-center space-x-2 transition-colors shadow-xs"
          >
            <span>{t.btnTrackLive}</span>
            <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
