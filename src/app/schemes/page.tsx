'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  Search, 
  ArrowLeft, 
  ExternalLink, 
  CheckCircle, 
  CalendarDays,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Award,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function SchemesPage() {
  const { schemes, t } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Collapsible tracking
  const [expandedSchemeId, setExpandedSchemeId] = useState<string | null>(null);

  const categories = ['All', 'Financial Support', 'Crop Insurance', 'Subsidies', 'Equipment'];

  // Upgraded schemes data structure with details
  const extendedSchemesDetails = [
    {
      id: 'scheme-1',
      title: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
      category: 'Financial Support',
      description: 'An initiative by the Government of India that provides up to ₹6,000 per year in three equal installments to all small and marginal farmers.',
      eligibility: 'All landholding farmer families holding cultivable land in their names (subject to exclusion criteria like high tax payers/government employees).',
      benefits: 'Direct cash transfer of ₹6,000 annually, deposited into bank accounts in 3 equal installments of ₹2,000 every 4 months.',
      documents: ['Aadhaar Card', 'Land holding papers / Khatauni', 'Bank Passbook copy', 'Mobile Number linked to Aadhaar'],
      steps: [
        'Visit the PM-KISAN official website or contact local CSC centers.',
        'Complete Aadhaar verification (eKYC).',
        'Upload land holding documents and bank detail pages.',
        'Submit the application and track verification status online.'
      ],
      link: 'https://pmkisan.gov.in',
      deadline: 'Ongoing enrollment',
      status: 'Active',
      statusColor: 'bg-emerald-100 border-emerald-200 text-emerald-800'
    },
    {
      id: 'scheme-2',
      title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      category: 'Crop Insurance',
      description: 'A government-sponsored crop insurance scheme that integrates multiple stakeholders to protect farmers from natural calamities, pests, and diseases.',
      eligibility: 'All farmers, including sharecroppers and tenant farmers, growing notified crops in notified areas.',
      benefits: 'Low premium rate (1.5% to 2% for foodgrains, 5% for commercial/horticultural crops) with full claim payout for yield damage.',
      documents: ['Land Records / RTC / Patta', 'Sowing Certificate from local authority', 'Bank Account details', 'Identity Proof (Aadhaar/Voter ID)'],
      steps: [
        'Register on the PMFBY crop insurance portal.',
        'Select state, district, crop type, and field survey numbers.',
        'Calculate premium and make the online payment.',
        'Receive the insurance receipt and policy cover note.'
      ],
      link: 'https://pmfby.gov.in',
      deadline: 'July 31, 2026 (Kharif season)',
      status: 'Open for Registration',
      statusColor: 'bg-amber-100 border-amber-200 text-amber-805'
    },
    {
      id: 'scheme-3',
      title: 'Kisan Credit Card (KCC) Scheme',
      category: 'Financial Support',
      description: 'Provides farmers with timely credit cards to meet their agricultural needs, including buying seeds, fertilizers, and pesticide treatments.',
      eligibility: 'All farmers, joint cultivators, tenant farmers, and self-help groups (SHG) involved in agricultural activities.',
      benefits: 'Concessional interest rate of 4% per annum (after prompt repayment subsidy) with flexible crop loan credit limits up to ₹3 Lakhs.',
      documents: ['Land revenue records', 'Identity & Address proof', 'No-due certificate from other cooperative banks', 'Recent passport photo'],
      steps: [
        'Visit your local commercial or cooperative bank branch.',
        'Fill out the KCC application form.',
        'Provide land titles for verification.',
        'Receive card limit and withdraw funds at ATMs or local agricultural input dealers.'
      ],
      link: 'https://www.myscheme.gov.in/schemes/kcc',
      deadline: 'Enrolling continuously',
      status: 'Active',
      statusColor: 'bg-emerald-100 border-emerald-200 text-emerald-800'
    },
    {
      id: 'scheme-4',
      title: 'Subsidies for Custom Hiring Centers (CHC)',
      category: 'Subsidies',
      description: 'Financial assistance for purchasing high-tech farm machinery, solar water pumps, and setting up village custom renting stations.',
      eligibility: 'Individual farmers, cooperative societies, farmer groups, and young rural entrepreneurs.',
      benefits: '40% to 50% subsidy on buying tractors, power tillers, seed drills, and combine harvesters.',
      documents: ['CHC Registration form', 'Estimates of machinery to buy', 'Pan Card', 'Bank loan sanction copy (if applicable)'],
      steps: [
        'Register on the agricultural mechanization portal of your state.',
        'Submit CHC proposal plan.',
        'Get approval from block agricultural department.',
        'Purchase tools and upload bills for subsidy credit.'
      ],
      link: 'https://agrimachinery.nic.in',
      deadline: 'Varies by State',
      status: 'Apply Now',
      statusColor: 'bg-blue-105 border-blue-200 text-blue-800'
    }
  ];

  const filteredSchemes = extendedSchemesDetails.filter((sch) => {
    const matchesSearch = 
      sch.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sch.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sch.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || sch.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const toggleExpand = (id: string) => {
    setExpandedSchemeId(prev => prev === id ? null : id);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white border border-emerald-800/10 p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-2 bg-white border border-emerald-800/10 hover:bg-emerald-50 rounded-xl transition-colors shadow-sm cursor-pointer">
            <ArrowLeft className="h-4.5 w-4.5 text-emerald-900" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-emerald-950">{t('schemes')}</h1>
            <p className="text-xs text-emerald-800/60 font-medium">Verify your eligibility and check checklist documents for central support.</p>
          </div>
        </div>
      </div>

      {/* Dynamic Scrolling News Section */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 text-amber-900">
        <AlertCircle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5 animate-pulse" />
        <div className="text-xs leading-relaxed font-semibold">
          <p className="font-bold text-amber-950">Important Scheme Deadline (ಯೋಜನೆ ಕೊನೆಯ ದಿನಾಂಕ)</p>
          <p className="opacity-90 mt-0.5">PMFBY crop insurance application portal closes for Kharif crops on July 31, 2026. Keep sowing receipts ready for quick approval.</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border border-emerald-800/10 p-5 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`
                  px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer shrink-0
                  ${selectedCategory === cat 
                    ? 'bg-emerald-600 border-emerald-600 text-white font-bold shadow-sm' 
                    : 'bg-emerald-50/50 border-emerald-850/15 text-emerald-850 hover:bg-emerald-50'
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-800/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search scheme name, keyword..."
              className="w-full pl-9 pr-4 py-2 border border-emerald-800/10 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
            />
          </div>
        </div>

        {/* Schemes List */}
        <div className="space-y-4 pt-2">
          {filteredSchemes.map((sch) => {
            const isExpanded = expandedSchemeId === sch.id;
            return (
              <div 
                key={sch.id}
                className="border border-emerald-850/15 rounded-xl bg-stone-50/20 overflow-hidden transition-all hover:border-emerald-600/35"
              >
                {/* Header Collapsible Trigger */}
                <div 
                  onClick={() => toggleExpand(sch.id)}
                  className="p-5 flex justify-between items-start gap-4 cursor-pointer select-none bg-white hover:bg-stone-50/40 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[9px] bg-emerald-50 border border-emerald-850/10 px-2 py-0.5 rounded text-emerald-800 font-extrabold uppercase tracking-wide">
                        {sch.category}
                      </span>
                      <span className={`text-[9px] border px-2 py-0.5 rounded font-bold ${sch.statusColor}`}>
                        {sch.status}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-sm text-emerald-950">{sch.title}</h3>
                    <p className="text-xs text-stone-600 leading-relaxed font-semibold pr-4">{sch.description}</p>
                  </div>

                  <button className="p-1.5 border border-stone-200 rounded-xl bg-white text-stone-600">
                    {isExpanded ? <ChevronUp className="h-4.5 w-4.5" /> : <ChevronDown className="h-4.5 w-4.5" />}
                  </button>
                </div>

                {/* Expanded Details section */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-3 border-t border-stone-200/50 bg-white/90 space-y-5 animate-in fade-in duration-200">
                    
                    {/* Eligibility & Benefits */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="bg-emerald-50/30 border border-emerald-850/10 p-4 rounded-xl space-y-2">
                        <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                          <Award className="h-4.5 w-4.5 text-emerald-700" />
                          <span>Eligibility (पात्रता)</span>
                        </h4>
                        <p className="text-xs text-stone-700 leading-relaxed font-semibold">{sch.eligibility}</p>
                      </div>

                      <div className="bg-emerald-50/30 border border-emerald-850/10 p-4 rounded-xl space-y-2">
                        <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                          <ShieldCheck className="h-4.5 w-4.5 text-emerald-700" />
                          <span>Benefits (लाभ)</span>
                        </h4>
                        <p className="text-xs text-stone-700 leading-relaxed font-semibold">{sch.benefits}</p>
                      </div>
                    </div>

                    {/* Documents checklist & Sowing application steps */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2.5">
                        <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                          <FileSpreadsheet className="h-4.5 w-4.5 text-emerald-700" />
                          <span>Required Documents (आवश्यक दस्तावेज)</span>
                        </h4>
                        <ul className="space-y-1.5 pl-1.5">
                          {sch.documents.map((doc, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-xs text-stone-700 font-semibold">
                              <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                              <span>{doc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2.5">
                        <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                          <CalendarDays className="h-4.5 w-4.5 text-emerald-700" />
                          <span>How to Apply (आवेदन कैसे करें)</span>
                        </h4>
                        <ol className="space-y-2 pl-1">
                          {sch.steps.map((step, idx) => (
                            <li key={idx} className="text-xs text-stone-700 font-semibold leading-relaxed flex gap-2">
                              <span className="h-5 w-5 bg-emerald-100 text-emerald-850 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>

                    {/* Footer Controls */}
                    <div className="flex justify-between items-center border-t border-stone-200/50 pt-4 mt-2">
                      <span className="text-[10px] text-stone-400 font-extrabold uppercase flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        Deadline: {sch.deadline}
                      </span>

                      <a 
                        href={sch.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
