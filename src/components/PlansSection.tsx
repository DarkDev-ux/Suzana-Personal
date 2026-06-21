import React from 'react';
import { Plan } from '../types';
import { motion } from 'motion/react';

interface PlansSectionProps {
  plans: Plan[];
  onSelectPlan: (plan: Plan) => void;
}

export default function PlansSection({ plans, onSelectPlan }: PlansSectionProps) {
  // Sort plans so we have:
  // - LEFT: Trimestral
  // - MIDDLE: Anual (Featured / "Mais Procurado")
  // - RIGHT: Semestral
  const reorderPlans = () => {
    const trimestral = plans.find(p => p.id === 'trimestral');
    const anual = plans.find(p => p.id === 'anual');
    const semestral = plans.find(p => p.id === 'semestral');
    
    return [
      trimestral,
      anual,
      semestral
    ].filter((p): p is Plan => !!p);
  };

  const ordered = reorderPlans();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-6 max-w-6xl mx-auto px-4"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      {ordered.map((plan) => {
        const isFeatured = plan.id === 'anual';

        return (
          <motion.div 
            key={plan.id}
            id={`plan-card-${plan.id}`}
            variants={cardVariants}
            whileHover={{ 
              y: isFeatured ? -4 : -8,
              scale: isFeatured ? 1.05 : 1.02,
              transition: { duration: 0.25, ease: "easeOut" }
            }}
            className={`flex flex-col h-full rounded-2xl p-8 sm:p-10 transition-shadow duration-300 relative backdrop-blur-xl ${
              isFeatured 
                ? 'bg-white/[0.03] border border-[#e08dff]/40 shadow-[0_0_60px_-10px_rgba(224,141,255,0.3),inset_0_1px_0_0_rgba(255,255,255,0.25)] relative z-10' 
                : 'bg-white/[0.01] border border-white/[0.08] hover:bg-white/[0.03] hover:border-white/20 shadow-[0_25px_50px_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.05)]'
            }`}
          >
            {/* Background glass and shimmer container safely handling overflow */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-0">
              {/* Liquid glass light sweep shimmer on any hovered state */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
              
              {/* Soft accent gradient blob inside the featured card */}
              {isFeatured && (
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#e08dff]/10 rounded-full blur-2xl pointer-events-none" />
              )}
            </div>

            {/* Top popular badge inside kinetic gradient - fully visible on overflow */}
            {isFeatured && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#e08dff] to-[#bc00fb] px-4 py-1.5 rounded-full whitespace-nowrap shadow-[0_4px_20px_rgba(224,141,255,0.4)] z-20">
                <span className="text-[10px] font-extrabold text-black uppercase tracking-widest block font-display">
                  Mais Procurado
                </span>
              </div>
            )}

            {/* Pricing Area */}
            <div className="mb-8 relative z-10">
              <h3 className={`font-display text-xl font-black mb-2 tracking-tight uppercase ${isFeatured ? 'text-[#e08dff]' : 'text-white'}`}>
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-purple-primary text-xl font-bold tracking-tight">
                  {plan.durationMonths}x de R$&nbsp;
                </span>
                <span className="text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
                  {Math.floor(plan.priceMonthly)}
                </span>
                <span className="text-gray-400 text-sm font-medium">,00</span>
              </div>
              <p className="text-[11px] text-gray-400 font-sans mt-2">
                Total de R$ {plan.priceTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} {plan.id === 'anual' ? 'em até 12x' : plan.id === 'semestral' ? 'em até 6x' : 'em até 3x'}
              </p>
            </div>

            {/* Feature List */}
            <ul className="space-y-4 mb-10 flex-grow text-left relative z-10">
              {plan.features.map((feat, idx) => {
                return (
                  <li 
                    key={idx} 
                    className={`flex items-start gap-3 transition-opacity ${
                      isFeatured 
                        ? 'text-white' 
                        : 'text-neutral-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[#e08dff] text-base shrink-0 select-none mt-0.5">
                      check_circle
                    </span>
                    <span className="text-xs sm:text-sm font-sans leading-relaxed">
                      {feat}
                    </span>
                  </li>
                );
              })}
            </ul>

            {/* Selecionar Button */}
            <div className="relative z-10 pt-2">
              <button
                onClick={() => onSelectPlan(plan)}
                type="button"
                className={`w-full py-4 rounded-full font-display font-black text-xs uppercase tracking-widest transition-all ${
                  isFeatured
                    ? 'bg-gradient-to-r from-[#e08dff] to-[#bc00fb] text-black shadow-[0_5px_25px_rgba(224,141,255,0.35)] hover:shadow-[0_8px_35px_rgba(224,141,255,0.5)] hover:scale-[1.03] active:scale-95 cursor-pointer'
                    : 'border border-neutral-700 hover:border-[#e08dff] hover:bg-white/[0.04] text-white hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] active:scale-95 cursor-pointer'
                }`}
              >
                SELECIONAR
              </button>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
