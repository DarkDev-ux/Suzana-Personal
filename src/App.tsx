import React, { useEffect, useState } from 'react';
import { 
  Dumbbell, Star, Instagram, Flame, Activity, ShieldCheck, 
  Lock, Settings, ArrowRight, UserCheck, ShieldAlert, Sparkles 
} from 'lucide-react';
import { Plan, PaymentSubscription } from './types';
import PlansSection from './components/PlansSection';
import CheckoutModal from './components/CheckoutModal';
import TermsAndPrivacy from './components/TermsAndPrivacy';
import SuccessCelebrationModal from './components/SuccessCelebrationModal';
import LiquidGlassPresentation from './components/LiquidGlassPresentation';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [termsInitialTab, setTermsInitialTab] = useState<'terms' | 'privacy'>('terms');
  const [redirectPaymentResult, setRedirectPaymentResult] = useState<PaymentSubscription | null>(null);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Load plans from Express server API on boot
  useEffect(() => {
    fetch('/api/plans')
      .then(res => res.json())
      .then(data => setPlans(data))
      .catch(err => {
        console.error('Error fetching plans:', err);
        // Fallback mockup in case of build server cold-start
        setPlans([
          {
            id: 'trimestral',
            name: 'Trimestral',
            durationMonths: 3,
            priceTotal: 900.00,
            priceMonthly: 300.00,
            description: 'Consultoria de 3 meses para impulsionar seus primeiros resultados.',
            features: [
              'Treino personalizado',
              'Videochamada',
              'Suporte via WhatsApp'
            ],
            isPopular: false
          },
          {
            id: 'anual',
            name: 'Anual',
            durationMonths: 12,
            priceTotal: 4800.00,
            priceMonthly: 400.00,
            description: 'Acompanhamento premium de um ano completo para transformação definitiva.',
            features: [
              'Treino personalizado',
              'Videochamada',
              'Suporte via WhatsApp',
              'Atendimento Premium'
            ],
            badge: 'Mais Procurado',
            isPopular: true
          },
          {
            id: 'semestral',
            name: 'Semestral',
            durationMonths: 6,
            priceTotal: 2100.00,
            priceMonthly: 350.00,
            description: 'Consultoria de 6 meses perfeita para consolidação de hábitos saudáveis.',
            features: [
              'Treino personalizado',
              'Videochamada',
              'Suporte via WhatsApp'
            ],
            isPopular: false
          }
        ]);
      });
  }, []);

  // Intercept Mercado Pago back-urls redirects (/?status=approved&id=txId)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status') || urlParams.get('collection_status');
    const txId = urlParams.get('id') || urlParams.get('external_reference');
    const paymentId = urlParams.get('payment_id') || urlParams.get('collection_id');

    if (txId && status) {
      // Clean query parameters from address bar to preserve premium URL presentation
      const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.replaceState({ path: cleanUrl }, '', cleanUrl);

      // Verify and record the check-out outcome with the backend database
      fetch('/api/payments/verify-redirect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          id: txId,
          status,
          paymentId
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.payment) {
          // Open a gorgeous success/confirmation celebration modal with the paid subscription!
          setRedirectPaymentResult(data.payment);
        }
      })
      .catch(err => console.error('Error verifying redirect transaction:', err));
    }
  }, []);

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSuccess = (payment: PaymentSubscription) => {
    console.log('Payment registered checkout success:', payment);
    // Automatically close checkout drawer and trigger success celebration!
    setIsCheckoutOpen(false);
    setRedirectPaymentResult(payment);
  };

  const handleOpenTerms = (tab: 'terms' | 'privacy') => {
    setTermsInitialTab(tab);
    setIsTermsOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white font-sans flex flex-col relative overflow-x-hidden selection:bg-[#e08dff] selection:text-black">
      
      {/* GLOW BACKGROUND BLURS */}
      <div className="absolute top-[10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#bc00fb]/10 blur-[130px] -z-10 pointer-events-none"></div>
      <div className="absolute top-[40%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-[#e08dff]/5 blur-[120px] -z-10 pointer-events-none"></div>

      {/* STICKY LUXURY NAVIGATION */}
      <nav id="navbar" className="fixed top-0 left-0 right-0 z-50 bg-transparent transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-4">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDsvCoi2iDDQdMDKpf0AAd_ETbc79uLJ0PevF_eWTxKVQ9GFvyBbjHC_rpUJwvYQjpSQTv8v2i3tfjwOxC5J-8zm97ZfAokNvuWxhHE21CuC10RgE2SXsep6CNRSKwk5TwgmPjjOZx0cXtm_9uaKrgFokmFBIRLv5Xno-ILJT2HUwURe-Io4e_DvQbGE7KVucd152rA3f6VE8Fy8kHD-hNfde4PdQRV6rfBSbzixPFHDPUwseAjqdd2xBwbENQFZGY5kwTa4bv0Ag" 
              alt="SP Suzana Personal Logo" 
              className="h-14 sm:h-16 w-auto rounded-xl object-contain shadow-lg shadow-[#e08dff]/10 transition-transform duration-300 hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <span className="font-display font-black text-sm sm:text-base tracking-[0.25em] text-white uppercase hidden xs:inline-block">
              SP <span className="text-[#e08dff]">SUZANA PERSONAL</span>
            </span>
          </div>

          <div className="flex items-center space-x-4 sm:space-x-8">
            <a 
              href="#hero" 
              onClick={(e) => handleScrollTo(e, 'hero')}
              className="text-[10px] sm:text-xs font-display font-medium uppercase tracking-wider text-neutral-200 hover:text-white hover:scale-105 active:scale-95 transition bg-white/[0.04] hover:bg-white/[0.1] px-4 py-2 rounded-full border border-white/10 hover:border-white/25 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_4px_15px_rgba(0,0,0,0.3)] backdrop-blur-md cursor-pointer"
            >
              Início
            </a>
            <a 
              href="#sobre" 
              onClick={(e) => handleScrollTo(e, 'sobre')}
              className="text-[10px] sm:text-xs font-display font-medium uppercase tracking-wider text-neutral-200 hover:text-white hover:scale-105 active:scale-95 transition bg-white/[0.04] hover:bg-white/[0.1] px-4 py-2 rounded-full border border-white/10 hover:border-white/25 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_4px_15px_rgba(0,0,0,0.3)] backdrop-blur-md cursor-pointer"
            >
              Sobre
            </a>
            <a 
              href="#planos" 
              onClick={(e) => handleScrollTo(e, 'planos')}
              className="text-[10px] sm:text-xs font-display font-bold uppercase tracking-wider text-[#e08dff] hover:text-white transition bg-gradient-to-b from-[#e08dff]/12 to-[#bc00fb]/6 hover:from-[#e08dff]/25 hover:to-[#bc00fb]/12 border border-[#e08dff]/30 hover:border-[#e08dff]/60 px-5 py-2 rounded-full hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_4px_20px_rgba(224,141,255,0.2)]"
            >
              Planos
            </a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION - Gym Backdrop and Clean Styling */}
      <header id="hero" className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden">
        {/* Full screen gym bg with dark overlay */}
        <div className="absolute inset-0 -z-10 bg-black">
          <img 
            alt="Gym background" 
            className="w-full h-full object-cover opacity-45 select-none" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvMBorxldu17XahI0OfAh0GKBaxWRckvpw_7rTCWxhd64EptCo5_9enJyYlZEV5sebREFjbdNckDymPSiox0LMgF6J6-x_ipcHz6sU8Uw5s_4CBJ_EfVkW1iHd0gs6WzzR5KqSBRUZv7tt1ybbgdlBksK2b5jyLp7zzY4KrV3XOpCnx1NAfEQ2gssCERrS6VH0JPwL5dEVwAC5ROewDiYBtCpOhMYGiIKUqRc_NuMEAPFkc9PeoLpzN7TGfILHZ-igSmbUHOCrBwE"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/40 to-black/60"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto px-6 text-center space-y-6"
        >
          <span className="text-xs text-[#e08dff] tracking-[0.3em] font-display font-bold uppercase block">
            — PERFORMANCE & ESTÉTICA
          </span>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-white leading-tight">
            Transforme seu <span className="text-[#e08dff] italic font-extrabold">corpo</span> <br className="hidden sm:block" /> e sua mente.
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed">
            Treino personalizado com acompanhamento profissional para quem busca resultados reais.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#planos"
              onClick={(e) => handleScrollTo(e, 'planos')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#e08dff] to-[#bc00fb] text-black font-display font-bold uppercase text-xs tracking-widest rounded-full hover:scale-105 transition-all text-center cursor-pointer"
            >
              VER PLANOS
            </a>
            <a 
              href="#sobre"
              onClick={(e) => handleScrollTo(e, 'sobre')}
              className="w-full sm:w-auto px-8 py-4 border border-white/20 text-white font-display font-bold uppercase text-xs tracking-widest rounded-full hover:bg-white/5 transition-all text-center cursor-pointer"
            >
              SAIBA MAIS
            </a>
          </div>
        </motion.div>
      </header>

      {/* ABOUT ME SECTION (#sobre) - Highly requested styles */}
      <section id="sobre" className="max-w-7xl mx-auto px-6 py-24 w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        {/* Portrait Column */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="md:col-span-5 relative flex justify-center"
        >
          <div className="relative w-full max-w-[360px] aspect-[4/5] rounded-xl overflow-hidden bg-neutral-900 border border-white/5 shadow-2xl">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuApsDclAEuSsKm8W4sjRNx2AzWJSOm1uThTF0QyRaO3XuXVkXDCfhCGdPqWApFD3jAMFlGwTRV-q3TVkpjJG7vsccDtvPsAcZUgoOpjwQc7O8kAMjoYTfqW5LgdQPFtblP3iY2zWPrXegUQd2Xzxxymk4Qoy077Y12pLNo4l4UP2pPZlb62beqoqmaPSy6P9Ylg5RbAGgFpk0Co6C7BqcNc9Y1cGhkI9waSwcoHOVX1ErafMyV4c66sFHnvb8ut1wnQqzQzjWII7FI" 
              alt="Suzana Personal Trainer" 
              className="w-full h-full object-cover object-top select-none"
              referrerPolicy="no-referrer"
            />
            {/* Absolute overlay badge on portrait */}
            <div className="absolute top-4 right-4 bg-[#e08dff] text-black px-4 py-2 rounded font-display font-extrabold text-[11px] uppercase tracking-wider shadow-lg flex flex-col items-center leading-none">
              <span className="text-base font-black">10+</span>
              <span className="text-[8px] font-bold mt-0.5">Anos de XP</span>
            </div>
          </div>
        </motion.div>

        {/* Text Specs Column */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="md:col-span-7 space-y-6 text-left"
        >
          <span className="text-[10px] text-[#e08dff] font-display font-bold uppercase tracking-widest block">
            QUEM É SUZANA PERSONAL?
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white leading-tight italic">
            Ciência aplicada ao seu movimento.
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {[
              { text: "PÓS-GRADUADA EM POSTUROLOGIA", icon: "school" },
              { text: "PERSONAL TRAINER E CONSULTORA", icon: "fitness_center" },
              { text: "ESPECIALISTA EM POSTURA", icon: "accessibility_new" },
              { text: "SAÚDE, ESTÉTICA E BEM-ESTAR", icon: "favorite" },
              { text: "ATENDIMENTO PRESENCIAL E ON-LINE", icon: "devices" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-neutral-900/60 p-3 rounded-lg border border-white/[0.04]">
                <span className="material-symbols-outlined text-[#e08dff] text-xl shrink-0">
                  {item.icon}
                </span>
                <span className="text-xs font-display font-bold text-neutral-300 tracking-wide">
                  {item.text}
                </span>
              </div>
            ))}
          </div>



          <div className="inline-flex items-center gap-2 bg-[#e08dff]/10 text-[#e08dff] px-4 py-2.5 rounded-lg border border-[#e08dff]/20">
            <span className="material-symbols-outlined text-sm">verified</span>
            <span className="text-xs font-display font-bold">Formação Continuada & Registro Profissional Ativo</span>
          </div>
        </motion.div>
      </section>

      {/* MISSION SECTION */}
      <section className="bg-neutral-900/40 py-20 border-t border-b border-white/[0.03]">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-12">
          <div className="space-y-2">
            <span className="text-[10px] text-[#e08dff] font-display font-bold uppercase tracking-widest block">
              — O QUE ME MOVE
            </span>
            <h3 className="text-3xl font-display font-extrabold text-white">
              Minha missão é simples:
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Entregar resultados reais", icon: "trending_up", desc: "Estruturas sólidas com eficácia comprovada, sem perda de tempo." },
              { title: "Transformar hábitos", icon: "sync_alt", desc: "Acompanhamento dinâmico focado em criar rotinas sustentáveis." },
              { title: "Melhorar sua qualidade de vida", icon: "auto_fix_high", desc: "Ajuste na postura, ganho de energia e mobilidade de alto desempenho." }
            ].map((card, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -4, borderColor: "rgba(224, 141, 255, 0.25)", transition: { duration: 0.2 } }}
                className="bg-neutral-900 border border-white/5 p-8 rounded-xl flex flex-col items-center text-center space-y-4 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-[#e08dff]/10 flex items-center justify-center text-[#e08dff]">
                  <span className="material-symbols-outlined text-2xl">{card.icon}</span>
                </div>
                <h4 className="text-base font-display font-bold text-white">{card.title}</h4>
                <p className="text-xs text-neutral-400 font-sans leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>

          <p className="text-sm italic text-neutral-300 font-sans max-w-2xl mx-auto">
            &ldquo;Cada treino é pensado para você, respeitando seu corpo, seus objetivos e sua rotina.&rdquo;
          </p>
        </div>
      </section>

      {/* APPLE LIQUID GLASS CONSULTING PRESENTATION */}
      <LiquidGlassPresentation />

      {/* SUBSCRIPTION PLANS SECTION */}
      <section id="planos" className="max-w-7xl mx-auto px-6 py-24 w-full space-y-12 text-center">
        <div className="space-y-3 max-w-2xl mx-auto text-center">
          <span className="text-xs text-[#e08dff] font-display font-bold uppercase tracking-widest block">
            ESCOLHA SEU NÍVEL
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-white leading-none">
            Planos estruturados para diferentes objetivos
          </h2>
          <p className="text-sm text-neutral-400">
            Acompanhamento profissional sob demanda, sem fidelidades abusivas. Comece sua evolução hoje.
          </p>
        </div>

        {/* Plans element */}
        <PlansSection 
          plans={plans} 
          onSelectPlan={handleSelectPlan} 
        />

        {/* SECURE PAYMENT BADGES */}
        <div className="pt-12 text-center max-w-2xl mx-auto">
          <p className="text-[10px] text-neutral-500 font-display font-bold uppercase tracking-widest mb-4">
            COMPRA 100% SEGURA & PROTEGIDA PELO MERCADO PAGO
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 opacity-40 hover:opacity-60 transition-opacity">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base">pix</span>
              <span className="text-xs font-mono font-bold">PIX</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base">credit_card</span>
              <span className="text-xs font-mono font-bold">CARTÃO</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base">shield_lock</span>
              <span className="text-xs font-mono font-bold">SSL ENCRYPTED</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base">verified_user</span>
              <span className="text-xs font-mono font-bold">MERCADO PAGO Checkout</span>
            </div>
          </div>
          <p className="text-[10px] text-neutral-500 mt-2 font-sans">
            Seus dados são encriptados e processados em conformidade com as diretrizes LGPD vigentes.
          </p>
        </div>
      </section>

      {/* FOOTER SECTION */}
      <footer id="footer" className="mt-auto bg-[#090909] border-t border-white/[0.04] py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 items-center text-center md:text-left">
          
          <div className="space-y-3">
            <div className="flex items-center justify-center md:justify-start space-x-3.5">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDsvCoi2iDDQdMDKpf0AAd_ETbc79uLJ0PevF_eWTxKVQ9GFvyBbjHC_rpUJwvYQjpSQTv8v2i3tfjwOxC5J-8zm97ZfAokNvuWxhHE21CuC10RgE2SXsep6CNRSKwk5TwgmPjjOZx0cXtm_9uaKrgFokmFBIRLv5Xno-ILJT2HUwURe-Io4e_DvQbGE7KVucd152rA3f6VE8Fy8kHD-hNfde4PdQRV6rfBSbzixPFHDPUwseAjqdd2xBwbENQFZGY5kwTa4bv0Ag" 
                alt="SP Suzana Personal Logo" 
                className="h-10 w-auto rounded-lg object-contain shadow-md shadow-[#e08dff]/5"
                referrerPolicy="no-referrer"
              />
              <span className="font-display font-extrabold text-sm sm:text-base uppercase tracking-[0.2em] text-white">
                SP <span className="text-[#e08dff]">SUZANA PERSONAL</span>
              </span>
            </div>
            <p className="text-xs text-neutral-500 font-sans leading-relaxed">
              Consultoria Fitness Premium e Planos Assistidos de Treino. <br />
              Todos os direitos reservados © {new Date().getFullYear()}.
            </p>
          </div>

          {/* Social media handler with zero whatsapp footprint */}
          <div className="flex flex-col items-center space-y-3">
            <span className="text-[10px] text-neutral-500 font-display font-bold uppercase tracking-wider">ACOMPANHE NO INSTAGRAM</span>
            <a 
              href="https://www.instagram.com/SuzanaPersonal" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-neutral-900 border border-white/5 rounded-full text-xs font-display font-semibold text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all"
            >
              <Instagram className="w-4 h-4 text-[#e08dff]" />
              @SuzanaPersonal
            </a>
          </div>

          {/* Legal / Policy references */}
          <div className="flex flex-col items-center md:items-end space-y-3 text-xs">
            <span className="text-[10px] text-neutral-500 font-display font-bold uppercase tracking-wider block">CONTRATUAL & PRIVACIDADE</span>
            <div className="flex gap-4">
              <button 
                onClick={() => handleOpenTerms('terms')}
                className="text-[11px] text-neutral-400 hover:text-[#e08dff] transition font-sans cursor-pointer focus:outline-none"
              >
                Termos de Uso
              </button>
              <div className="w-px h-3.5 bg-white/10"></div>
              <button 
                onClick={() => handleOpenTerms('privacy')}
                className="text-[11px] text-neutral-400 hover:text-[#e08dff] transition font-sans cursor-pointer focus:outline-none"
              >
                Política de Privacidade
              </button>
            </div>
            <p className="text-[10px] text-neutral-600 font-sans text-center md:text-right">
              Plataforma financeira de alta integridade.
            </p>
          </div>

        </div>
      </footer>

      {/* MODALS INTEGRATION */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <CheckoutModal
            isOpen={isCheckoutOpen}
            plan={selectedPlan}
            onClose={() => setIsCheckoutOpen(false)}
            onSuccess={handleCheckoutSuccess}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isTermsOpen && (
          <TermsAndPrivacy
            isOpen={isTermsOpen}
            onClose={() => setIsTermsOpen(false)}
            initialTab={termsInitialTab}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {redirectPaymentResult && (
          <SuccessCelebrationModal
            payment={redirectPaymentResult}
            onClose={() => setRedirectPaymentResult(null)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
