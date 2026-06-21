import React from 'react';
import { CheckCircle2, MessageSquare, Sparkles, X, Trophy, Dumbbell } from 'lucide-react';
import { PaymentSubscription } from '../types';
import { motion } from 'motion/react';

interface SuccessCelebrationModalProps {
  payment: PaymentSubscription;
  onClose: () => void;
}

export default function SuccessCelebrationModal({ payment, onClose }: SuccessCelebrationModalProps) {
  const whatsappNumber = "5519988744544"; // Suzana's Professional WhatsApp
  
  // Format the text message to send on WhatsApp
  const whatsappText = `Olá Suzana! Minha assinatura da consultoria de treino foi confirmada pelo Mercado Pago!\n\n🔥 *Faturamento:* ${payment.id}\n🌟 *Plano:* ${payment.planName}\n💰 *Valor:* R$ ${payment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n👤 *Aluno:* ${payment.customerName}\n📧 *E-mail:* ${payment.customerEmail}\n\nPor favor, envie o questionário de anamnese e minhas credenciais de acesso!`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
    >
      {/* Floating Sparkles decorative effects */}
      <div className="absolute top-[30%] left-[20%] w-72 h-72 rounded-full bg-purple-primary/10 blur-[80px] -z-10 pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[30%] right-[20%] w-72 h-72 rounded-full bg-emerald-500/5 blur-[80px] -z-10 pointer-events-none animate-pulse"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 35 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 35 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className="relative w-full max-w-md bg-surface-card rounded-2xl overflow-hidden border border-emerald-500/20 shadow-2xl purple-glow p-6 text-center space-y-6"
      >
        {/* Confetti-like ambient sparkle */}
        <div className="flex justify-center items-center gap-1.5 absolute top-5 left-5 text-emerald-400 text-xs font-display font-black uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <Sparkles className="w-3.5 h-3.5 animate-bounce" />
          <span>Confirmado</span>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration Badges */}
        <div className="pt-8 flex justify-center relative">
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-400/30 rounded-full flex items-center justify-center animate-bounce shadow-lg shadow-emerald-500/5">
            <CheckCircle2 className="w-11 h-11 text-emerald-400" />
          </div>
          <div className="absolute -top-1 right-12 text-[#e08dff] animate-pulse">
            <Trophy className="w-6 h-6 rotate-12" />
          </div>
          <div className="absolute -bottom-1 left-12 text-purple-primary animate-pulse">
            <Dumbbell className="w-6 h-6 -rotate-12" />
          </div>
        </div>

        {/* Title and Congratulation messaging */}
        <div className="space-y-2">
          <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight leading-none">
            Parabéns, {payment.customerName.split(' ')[0]}!
          </h2>
          <p className="text-xs text-emerald-400 font-display font-bold uppercase tracking-wider">
            Sua vaga na consultoria está garantida!
          </p>
          <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed pt-1">
            Seu pagamento de <span className="text-white font-bold">R$ {payment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span> pelo <span className="text-white font-bold">{payment.planName}</span> foi liquidado e aprovado com absoluto sucesso.
          </p>
        </div>

        {/* Details card with verification key */}
        <div className="bg-background-black/50 p-4 rounded-xl border border-white/5 text-left text-xs space-y-2 font-sans text-gray-300">
          <div className="flex justify-between border-b border-white/[0.04] pb-1">
            <span className="text-gray-500">Transação ID:</span>
            <span className="font-mono text-white text-[11px] font-bold">{payment.id}</span>
          </div>
          {payment.mpId && (
            <div className="flex justify-between border-b border-white/[0.04] pb-1">
              <span className="text-gray-500">Mercado Pago ID:</span>
              <span className="font-mono text-purple-primary text-[11px] font-bold">{payment.mpId}</span>
            </div>
          )}
          <div className="flex justify-between border-b border-white/[0.04] pb-1">
            <span className="text-gray-500">E-mail:</span>
            <span className="text-white truncate max-w-[180px]">{payment.customerEmail}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Data aprovação:</span>
            <span className="text-white">{new Date(payment.createdAt).toLocaleDateString('pt-BR')} às {new Date(payment.createdAt).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}</span>
          </div>
        </div>

        {/* Next and imperative action step: Send WhatsApp message */}
        <div className="space-y-3 pt-1">
          <div className="bg-emerald-500/10 border border-emerald-400/20 p-3.5 rounded-xl text-left text-xs">
            <p className="font-sans leading-relaxed text-emerald-300">
              <span className="font-bold block mb-1">💡 PRÓXIMO PASSO MANDATÓRIO:</span>
              Clique no botão verde abaixo para enviar seu comprovante e liberar imediatamente seus treinos e questionário direto com a Suzana no WhatsApp!
            </p>
          </div>

          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-black uppercase tracking-widest text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 active:scale-95"
          >
            <MessageSquare className="w-4 h-4 text-white animate-bounce" />
            Liberar Acesso no WhatsApp
          </a>

          <button 
            onClick={onClose}
            className="text-[11px] text-gray-500 hover:text-white transition font-display uppercase tracking-wider underline cursor-pointer pt-1"
          >
            Voltar para o site
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
