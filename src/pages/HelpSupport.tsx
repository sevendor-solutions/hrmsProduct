import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, LifeBuoy, Mail, Phone, Clock, FileText, Send, Check } from 'lucide-react';

const FAQS = [
  { category: 'leaves', q: 'How is leave carry-forward calculated?', a: 'Up to 5 annual leaves can be carried forward to the next financial year automatically. Any additional unused leaves will expire.' },
  { category: 'leaves', q: 'What is the approval timeline for casual leaves?', a: 'Casual leaves of 1-2 days are generally approved by reporting managers within 24 hours. Plan ahead for longer request structures.' },
  { category: 'payroll', q: 'When do we receive our monthly payslip?', a: 'Payslips are generated on the last working day of each month and can be viewed directly in the Self-Service module.' },
  { category: 'payroll', q: 'How do I update my bank account details for payroll?', a: 'Submit an IT/Finance ticket under Support using the contact form below, enclosing your new bank account passbook copy.' },
  { category: 'it', q: 'How do I request software license renewals?', a: 'Navigate to the Assets Management module, view your assigned laptop details, and request renewal support or raise a help ticket.' },
  { category: 'it', q: 'What is the corporate password policy?', a: 'Passwords must be updated every 90 days, have at least 8 characters, and include capital letters, numbers, and special characters.' },
];

export default function HelpSupport() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [faqCategory, setFaqCategory] = useState('All');
  const [ticketForm, setTicketForm] = useState({ subject: '', category: 'IT Support', description: '' });
  const [ticketSent, setTicketSent] = useState(false);

  const filteredFaqs = FAQS.filter(f => faqCategory === 'All' || f.category === faqCategory);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.subject || !ticketForm.description) {
      alert('Please fill out the ticket form.');
      return;
    }
    setTicketSent(true);
    setTimeout(() => {
      setTicketSent(false);
      setTicketForm({ subject: '', category: 'IT Support', description: '' });
    }, 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="page-header">
        <h1>Help & Support Desk</h1>
        <p>Browse self-help FAQS, contact support personnel, or open a technical service ticket.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Support contact info card */}
        <div className="glass-card p-5 h-fit space-y-4">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 border-b pb-2 flex items-center gap-2">
            <LifeBuoy size={16} className="text-violet-500" /> Help Desk Contacts
          </h3>
          <div className="space-y-3.5 text-xs">
            <div className="flex gap-2 text-slate-600 dark:text-slate-400">
              <Mail size={14} className="text-violet-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-300">Support Email</p>
                <p>support@sevendor.com</p>
              </div>
            </div>
            <div className="flex gap-2 text-slate-600 dark:text-slate-400">
              <Phone size={14} className="text-violet-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-300">Phone Hotline</p>
                <p>+91 98765 00112</p>
              </div>
            </div>
            <div className="flex gap-2 text-slate-600 dark:text-slate-400">
              <Clock size={14} className="text-violet-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-300">Working Hours</p>
                <p>Monday - Friday, 9am - 6pm</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ & Ticket submission */}
        <div className="md:col-span-2 space-y-6">
          {/* FAQ Accordion */}
          <div className="glass-card p-5 space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <HelpCircle size={16} className="text-violet-500" /> FAQs
              </h3>
              <div className="flex gap-2 text-xs">
                {['All', 'leaves', 'payroll', 'it'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setFaqCategory(cat); setActiveFaq(null); }}
                    className={`capitalize px-2.5 py-1 rounded-lg border transition-all ${
                      faqCategory === cat ? 'bg-violet-600 text-white border-violet-600 font-semibold' : 'text-slate-500 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {filteredFaqs.map((faq, i) => {
                const isOpen = activeFaq === i;
                return (
                  <div key={i} className="border-b border-slate-100 dark:border-slate-800/80 last:border-b-0">
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : i)}
                      className="w-full flex justify-between items-center py-3 text-left font-semibold text-xs text-slate-700 dark:text-slate-300 hover:text-violet-600 transition-colors"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {isOpen && (
                      <p className="text-xs text-slate-500 leading-relaxed pb-3 animate-fade-in">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ticket Request Form */}
          <div className="glass-card p-5 space-y-4">
            <h3 className="font-semibold text-slate-700 dark:text-slate-200 border-b pb-2 flex items-center gap-2">
              <FileText size={16} className="text-violet-500" /> Submit Support Ticket
            </h3>

            {ticketSent ? (
              <div className="p-6 text-center space-y-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-250 dark:border-emerald-900/50">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                  <Check size={20} />
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Ticket Created Successfully</h4>
                <p className="text-xs text-slate-500">Support representative will respond to your registered email soon.</p>
              </div>
            ) : (
              <form onSubmit={handleCreateTicket} className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Subject Title *</label>
                    <input className="input-field" placeholder="e.g. Laptop charger malfunction" value={ticketForm.subject} onChange={e => setTicketForm({ ...ticketForm, subject: e.target.value })} />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Support Category</label>
                    <select className="input-field" value={ticketForm.category} onChange={e => setTicketForm({ ...ticketForm, category: e.target.value })}>
                      <option>IT Support</option>
                      <option>HR Queries</option>
                      <option>Payroll & Taxes</option>
                      <option>Facilities & Admin</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Problem Description *</label>
                  <textarea rows={3} className="input-field resize-none text-xs" placeholder="Detail your issue here..." value={ticketForm.description} onChange={e => setTicketForm({ ...ticketForm, description: e.target.value })} />
                </div>

                <button type="submit" className="btn-primary flex items-center gap-1.5 self-start">
                  <Send size={13} /> Submit Ticket
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
