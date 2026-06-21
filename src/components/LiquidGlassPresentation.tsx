import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Sparkles, 
  ArrowRight, 
  Video, 
  ClipboardList, 
  CheckCircle, 
  Dumbbell, 
  MessageSquare,
  FileImage,
  Layers,
  Zap
} from 'lucide-react';

export default function LiquidGlassPresentation() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);

  // Exact text content provided by user mapped to visual interactive glass blocks
  const targetAudience = [
    { text: "Trabalha horas sentado ou em Home office", highlight: true },
    { text: "Praticantes de atividade física em busca de evolução" },
    { text: "Pessoas com dores constantes nas costas, pescoço e articulações", highlight: true },
    { text: "Quem busca envelhecer com autonomia, flexibilidade e qualidade de vida" }
  ];

  const deliverables = [
    {
      title: "Reunião on-line anamnese e discussão",
      desc: "Alinhamento inicial, expectativas e levantamento do seu histórico físico.",
      icon: Video,
      badge: "Início"
    },
    {
      title: "Avaliação postural e explicação sobre o plano de ação",
      desc: "Análise profunda de desvios para direcionamento preciso dos movimentos.",
      icon: Layers,
      badge: "Análise"
    },
    {
      title: "Plano de treino no app",
      desc: "Planilhas exclusivas integradas para você treinar com foco e eficiência.",
      icon: Dumbbell,
      badge: "Metodologia"
    },
    {
      title: "Suporte individualizado direto comigo",
      desc: "Tire dúvidas, envie vídeos de execuções e receba correções em tempo real.",
      icon: MessageSquare,
      badge: "Elite VIP"
    }
  ];

  const processSteps = [
    {
      number: "01",
      title: "Envio de fotos",
      desc: "Você envia imagens específicas seguindo nosso guia simples para avaliação visual precisa."
    },
    {
      number: "02",
      title: "Anamnese",
      desc: "Preenchimento do formulário detalhado sobre seu histórico de dores, metas e tempo disponível."
    },
    {
      number: "03",
      title: "Devolutiva + plano de ação",
      desc: "Entrega completa do seu planejamento de correções posturais e rotina de treinos."
    }
  ];

  return (
    <section className="relative w-full py-24 px-6 overflow-hidden bg-black/40 border-t border-b border-white/[0.02]">
      
      {/* REAL-TIME LIQUID GLASS GRADIENT BLOB SIMULATOR */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Animated Blob 1 (Purple) */}
        <motion.div 
          animate={{
            x: ['-20%', '30%', '-10%'],
            y: ['-10%', '20%', '10%'],
            scale: [1, 1.2, 0.9],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-[#bc00fb]/15 to-[#e08dff]/10 blur-[110px]"
        />

        {/* Animated Blob 2 (Cyan/Emerald contrast for glass refraction sheen) */}
        <motion.div 
          animate={{
            x: ['20%', '-20%', '10%'],
            y: ['40%', '-10%', '20%'],
            scale: [0.9, 1.25, 1],
            rotate: [180, 0, 360],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-emerald-500/10 to-[#bc00fb]/5 blur-[120px]"
        />

        {/* Dynamic Highlight Flare following timeline */}
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-[#e08dff]/25 to-transparent shadow-[0_0_40px_10px_rgba(224,141,255,0.15)]" />
      </div>

      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* HEADER BRAND & LOGO (Apple Refracted Style) */}
        <div className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="inline-flex flex-col items-center justify-center p-6 bg-white/[0.02] border border-white/10 rounded-2xl backdrop-blur-md shadow-2xl relative overflow-hidden group hover:border-[#e08dff]/30 transition-all duration-500"
          >
            {/* Gloss reflection overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDsvCoi2iDDQdMDKpf0AAd_ETbc79uLJ0PevF_eWTxKVQ9GFvyBbjHC_rpUJwvYQjpSQTv8v2i3tfjwOxC5J-8zm97ZfAokNvuWxhHE21CuC10RgE2SXsep6CNRSKwk5TwgmPjjOZx0cXtm_9uaKrgFokmFBIRLv5Xno-ILJT2HUwURe-Io4e_DvQbGE7KVucd152rA3f6VE8Fy8kHD-hNfde4PdQRV6rfBSbzixPFHDPUwseAjqdd2xBwbENQFZGY5kwTa4bv0Ag" 
              alt="Suzana Personal Logo" 
              className="h-16 w-auto rounded-xl object-contain shadow-lg mb-3 border border-white/[0.08]"
              referrerPolicy="no-referrer"
            />
            
            <h4 className="text-[10px] text-[#e08dff] font-display font-black tracking-[0.4em] uppercase">
              SUZANA PERSONAL
            </h4>
          </motion.div>

          <div className="space-y-4 max-w-3xl mx-auto">
            <span className="text-[11px] text-emerald-400 font-display font-bold uppercase tracking-[0.25em] bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
              ⚡ CONSULTORIA ON-LINE POSTURAL
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white leading-tight">
              Bem vindo (a) A Consultoria
            </h2>
            <div className="relative pt-2">
              <span className="absolute left-0 top-0 text-3xl font-serif text-[#e08dff]/20">“</span>
              <p className="text-neutral-300 font-sans text-base leading-relaxed px-5 max-w-2xl mx-auto italic">
                Pensando no seu bem estar eu estruturei minha consultoria on-line de avaliação postural. O objetivo é identificar onde seu corpo está desalinhado e te entregar um direcionamento prático de exercícios para melhorar a sua postura e alcançar seus objetivos. O processo é <span className="text-[#e08dff] font-bold">100% digital</span>. Vamos cuidar do seu corpo?
              </p>
              <span className="absolute right-0 bottom-0 text-3xl font-serif text-[#e08dff]/20">”</span>
            </div>
          </div>
        </div>

        {/* CONTAINER MAIN GRID - 2 columns bento-grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-6">

          {/* LEFT PANEL: QUAIS AS DORES & TARGET AUDIENCE */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-12 xl:col-span-5 bg-white/[0.02] border border-white/[0.08] p-8 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col justify-between group hover:border-[#e08dff]/20 transition-all duration-300"
          >
            {/* Radial Specular Sheen */}
            <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-[#e08dff]/5 blur-[70px] pointer-events-none group-hover:bg-[#e08dff]/10 transition-colors duration-500" />
            
            <div className="space-y-6 relative z-10">
              <div className="inline-flex p-3 bg-red-400/10 border border-red-400/20 rounded-2xl text-red-400">
                <Users className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight">
                  Pra quem é essa consultoria?
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans mt-1">
                  Ela foi meticulosamente desenhada para solucionar desalinhamentos posturais em quem sofre no dia a dia.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {targetAudience.map((audience, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-start gap-3 p-3.5 rounded-xl border font-sans text-xs transition duration-300 ${
                      audience.highlight 
                        ? 'bg-neutral-900/80 border-[#e08dff]/15 text-white font-bold' 
                        : 'bg-[#000]/20 border-white/[0.03] text-neutral-300'
                    }`}
                  >
                    <div className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${audience.highlight ? 'bg-[#e08dff]' : 'bg-neutral-500'}`} />
                    <p className="leading-normal">{audience.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/[0.05] relative z-10 flex items-center justify-end text-neutral-400 text-xs">
              <span className="font-sans">Resultado Real</span>
            </div>
          </motion.div>

          {/* RIGHT PANEL: DELIVERABLES */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-12 xl:col-span-7 bg-white/[0.02] border border-white/[0.08] p-8 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col justify-between group hover:border-[#e08dff]/20 transition-all duration-300"
          >
            {/* Light sweep on hover */}
            <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-emerald-500/5 blur-[80px] pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="inline-flex p-3 bg-[#e08dff]/10 border border-[#e08dff]/20 rounded-2xl text-[#e08dff]">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight">
                  O que você vai receber?
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  Suporte total.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {deliverables.map((item, idx) => {
                  const IconComp = item.icon;
                  return (
                    <div 
                      key={idx}
                      onMouseEnter={() => setHoveredCard(idx)}
                      onMouseLeave={() => setHoveredCard(null)}
                      className="bg-black/30 border border-white/[0.04] p-4.5 rounded-2xl hover:bg-neutral-900 hover:border-[#e08dff]/30 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 bg-[#e08dff]/10 border border-[#e08dff]/10 rounded-xl text-[#e08dff]">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className="text-[9px] font-display font-extrabold uppercase tracking-widest text-[#e08dff]/60 px-2 py-0.5 bg-white/[0.03] border border-white/[0.05] rounded-full">
                          {item.badge}
                        </span>
                      </div>
                      <h4 className="text-xs font-display font-bold text-white mb-1 tracking-tight leading-normal min-h-[32px] flex items-center">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.05] relative z-10 flex items-center justify-between text-[11px] text-[#e08dff] font-display font-bold">
              <span>MÉTODO EXCLUSIVO</span>
              <span className="flex items-center gap-1">Suzana Personal <CheckCircle className="w-3.5 h-3.5 text-emerald-400 inline" /></span>
            </div>
          </motion.div>

        </div>

        {/* HOW IT WORKS DYNAMIC FLOW CHART - HIGHLIGHTED & BEAUTIFIED */}
        <div className="bg-gradient-to-br from-[#121214] via-[#0b0b0c] to-[#040405] border border-[#e08dff]/30 p-8 md:p-10 rounded-[32px] relative overflow-hidden shadow-[0_0_50px_rgba(224,141,255,0.12)]">
          {/* Glass reflection overlay & top spotlight glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[360px] h-[180px] bg-[#e08dff]/15 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[200px] h-[200px] bg-emerald-500/5 rounded-full blur-[70px] pointer-events-none" />
          
          <div className="relative z-10 space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-2 border-b border-white/[0.04]">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 bg-[#e08dff]/15 px-3 py-1 rounded-full border border-[#e08dff]/25">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e08dff] animate-pulse"></span>
                  <span className="text-[10px] text-[#e08dff] font-display font-black uppercase tracking-widest leading-none">MÉTODO PASSO A PASSO</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight">
                  Como <span className="text-[#e08dff]">funciona</span>?
                </h3>
              </div>
              <div className="flex gap-2 bg-black/60 p-1.5 rounded-2xl border border-white/[0.06] backdrop-blur-md self-stretch md:self-auto justify-center">
                {processSteps.map((step, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-display font-extrabold uppercase tracking-wider transition-all duration-300 ${
                      activeStep === idx 
                        ? 'bg-[#e08dff] text-black shadow-lg shadow-[#e08dff]/30 scale-[1.03]' 
                        : 'text-neutral-400 hover:text-white hover:bg-white/[0.02]'
                    }`}
                  >
                    Etapa {step.number}
                  </button>
                ))}
              </div>
            </div>

            {/* Steps Flow Map */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {/* Connector line with custom gradient */}
              <div className="hidden md:block absolute top-[44%] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-[#e08dff]/45 to-transparent -z-0" />
              
              {processSteps.map((step, idx) => {
                const isActive = activeStep === idx;
                return (
                  <div 
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`relative z-10 p-6 md:p-8 rounded-2xl border cursor-pointer select-none transition-all duration-500 flex flex-col justify-between ${
                      isActive 
                        ? 'bg-[#e08dff]/[0.06] border-[#e08dff]/60 scale-[1.04] shadow-[0_10px_40px_rgba(224,141,255,0.18)]' 
                        : 'bg-black/55 border-white/[0.05] opacity-65 hover:opacity-100 hover:border-white/15'
                    }`}
                  >
                    {/* Glowing corner dot on active step */}
                    {isActive && (
                      <div className="absolute -top-[1px] -right-[1px] w-12 h-[1px] bg-gradient-to-r from-transparent to-[#e08dff] shadow-[0_0_15px_#e08dff]" />
                    )}
                    {isActive && (
                      <div className="absolute -bottom-[1px] -left-[1px] w-12 h-[1px] bg-gradient-to-r from-[#e08dff] to-transparent shadow-[0_0_15px_#e08dff]" />
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-black text-xs transition duration-500 ${
                          isActive 
                            ? 'bg-gradient-to-br from-[#e08dff] to-[#bc00fb] text-black shadow-[0_4px_15px_rgba(224,141,255,0.4)]' 
                            : 'bg-white/5 text-neutral-400'
                        }`}>
                          {step.number}
                        </div>

                        {isActive ? (
                          <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 rounded-full">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[8px] text-emerald-400 font-display font-black tracking-widest uppercase">Ativo</span>
                          </div>
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-neutral-700" />
                        )}
                      </div>

                      <h4 className={`text-base font-display font-black mb-3 leading-tight transition duration-300 ${isActive ? 'text-[#e08dff]' : 'text-white'}`}>
                        {step.title}
                      </h4>
                    </div>
                    
                    <p className={`text-xs leading-relaxed font-sans transition duration-300 ${isActive ? 'text-neutral-200' : 'text-neutral-400'}`}>
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Quick Interactive status helper text */}
            <div className="bg-gradient-to-r from-black/60 to-black/30 p-5 border border-white/[0.04] rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <span className="text-xl shrink-0 mt-0.5 select-none">⚡</span>
                <p className="text-xs text-neutral-300 max-w-2xl font-sans leading-relaxed">
                  Você receberá o questionário de anamnese e as orientações para fotos <span className="text-[#e08dff] font-extrabold underline decoration-[#e08dff]/30 underline-offset-4">imediatamente</span> no seu WhatsApp após a confirmação do pagamento.
                </p>
              </div>
              <a 
                href="#planos" 
                className="w-full sm:w-auto text-center px-5 py-3 bg-[#e08dff]/10 hover:bg-[#e08dff]/20 text-xs font-display font-black text-[#e08dff] hover:text-white rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 group shrink-0 border border-[#e08dff]/25"
              >
                Começar Agora <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
