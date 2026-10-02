import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  Building2,
  HelpCircle
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';

export const ContactView: React.FC = () => {
  const { t } = useQueue();
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    organization: 'hospital',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;
    setTicketId(`QW-${Math.floor(100000 + Math.random() * 900000)}`);
    setSubmitted(true);
  };

  return (
    <div id="contact-page" className="py-12 bg-[#F2F4F7] min-h-[80vh]">
      <div className="max-w-5xl mx-auto px-4 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold text-[#002D62] uppercase tracking-wider">
            Citizen Support Cell
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#002D62] font-sans mt-1">
            Contact & Assistance
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            Need help with your digital token, counter verification, or public department schedules? Contact our citizen helpdesk.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left: Contact Form */}
          <div className="md:col-span-7 bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-5 pb-3 border-b border-slate-100">
              Send an Inquiry
            </h2>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl text-center space-y-3">
                <CheckCircle2 className="w-9 h-9 text-emerald-600 mx-auto" />
                <h3 className="text-sm font-bold text-emerald-950">Inquiry Received</h3>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Thank you, <strong>{formData.name}</strong>. Your reference ticket ID is <strong className="font-mono">{ticketId}</strong>. Our nodal team will review your query within 24 working hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', mobile: '', organization: 'hospital', subject: '', message: '' });
                  }}
                  className="mt-2 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Ramesh Patil"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#002D62] focus:border-[#002D62]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      placeholder="e.g. 9822114455"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#002D62] focus:border-[#002D62]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. citizen@example.com"
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#002D62]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Related Institution
                    </label>
                    <select
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-[#002D62]"
                    >
                      <option value="hospital">Government Hospital</option>
                      <option value="bank">Public Sector Bank</option>
                      <option value="office">Government Office / Tehsildar</option>
                      <option value="general">General System Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Subject / Token Ref (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Token #H-OPD-022"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#002D62]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Please describe your question or issue in detail..."
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#002D62]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#002D62] hover:bg-[#001F45] text-white text-xs font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>

          {/* Right: Public Helpdesk Info */}
          <div className="md:col-span-5 space-y-5">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-5 text-xs shadow-xs">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
                Helpline & Contact Channels
              </h3>

              <div className="space-y-4 text-slate-700">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-[#002D62]" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Toll-Free Citizen Helpline</div>
                    <div className="text-sm font-semibold text-[#002D62] mt-0.5">1800-200-7833</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Monday – Saturday: 9:00 AM – 6:00 PM</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-[#002D62]" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Direct Email Support</div>
                    <div className="text-slate-700 mt-0.5">support@queuewise.gov.in</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Responses typically within 24 hours</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#002D62]" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Administrative Facilitation Center</div>
                    <div className="text-slate-600 mt-0.5 leading-relaxed">
                      District Administrative Complex, Central Citizen Center, Pune, Maharashtra - 411001
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Assurance Card */}
            <div className="bg-[#002D62] text-white p-6 rounded-2xl space-y-2 text-xs shadow-xs">
              <div className="font-bold text-amber-300 text-xs flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span>Service Guarantee</span>
              </div>
              <p className="text-slate-200 leading-relaxed text-xs">
                Tokens are issued under official civic guidelines to guarantee fair, sequential queue servicing without priority bypasses.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
