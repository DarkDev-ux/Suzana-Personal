import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, ShieldCheck, Mail, User, Phone, FileText, ArrowRight, Loader } from 'lucide-react';
import { Plan } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  plan: Plan | null;
  onClose: () => void;
  onSuccess?: (payment: any) => void;
}

export default function CheckoutModal({ isOpen, plan, onClose, onSuccess }: CheckoutModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');

  if (!isOpen || !plan) return null;

  // Mask function for phone (99) 99999-9999
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 6) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }
    setPhone(value);
  };

  // Mask function for CPF: 999.999.999-99
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 9) {
      value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9)}`;
    } else if (value.length > 6) {
      value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`;
    } else if (value.length > 3) {
      value = `${value.slice(0, 3)}.${value.slice(3)}`;
    }
    setCpf(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !email.trim() || !phone.trim() || !cpf.trim()) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Basic email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg('Por favor, informe um e-mail válido.');
      return;
    }

    // Clean CPF digits count
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) {
      setErrorMsg('O CPF deve conter exatamente 11 dígitos.');
      return;
    }

    // Clean Phone digits count (at least 10 or 11 digits: 2 for DDD + 8 or 9)
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      setErrorMsg('Por favor, informe um celular com DDD válido.');
      return;
    }

    setIsLoading(true);

    try {
      // Post registration data to backend API to generate secure Asaas invoice paymentUrl
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          planId: plan.id,
          planName: plan.name,
          amount: plan.priceTotal,
          customerName: fullName.trim(),
          customerEmail: email.trim(),
          customerWhatsApp: cleanPhone,
          customerCpf: cleanCpf,
          paymentMethod: paymentMethod, // 'pix' or 'card'
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.payment?.paymentUrl) {
        throw new Error(data.error || 'Não foi possível gerar a cobrança. Contate o suporte.');
      }

      // On successful charge creation, save paymentUrl and open safely in a new tab to avoid iframe block
      const checkoutUrl = data.payment.paymentUrl;
      setPaymentUrl(checkoutUrl);
      setIsLoading(false);

      // Attempt automatic redirect to new tab (fallback is manual link button)
      try {
        const opened = window.open(checkoutUrl, '_blank');
        if (!opened) {
          console.log('[Checkout] Popup bloqueado pelo navegador, aguardando clique manual do usuário.');
        }
      } catch (e) {
        console.error('[Checkout] Falha ao abrir nova aba de pagamento:', e);
      }
    } catch (err: any) {
      console.error('[Checkout] Erro:', err);
      setErrorMsg(err.message || 'Erro de comunicação. Tente novamente ou fale com a gente no WhatsApp.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={!isLoading ? onClose : undefined}
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="relative w-full max-w-lg bg-[#0d0d0f]/90 border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10 p-0"
      >
        {/* Header decoration */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#e08dff] to-transparent" />

        {/* Close Button */}
        {!isLoading && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition p-1 bg-white/5 hover:bg-white/10 rounded-full cursor-pointer focus:outline-none"
            aria-label="Fechar checkout"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Content */}
        <div className="p-6 sm:p-8">
          
          {/* Success / Ready Redirect View */}
          {paymentUrl ? (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
                  <ShieldCheck className="w-10 h-10 text-emerald-400" />
                </div>
              </div>
              
              <div className="space-y-2 w-full">
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono select-none px-2.5 py-1 rounded-full border border-emerald-500/20 font-bold tracking-wider uppercase">
                  Faturamento Gerado! 🔒
                </span>
                <h3 className="text-xl font-display font-extrabold text-white tracking-tight">
                  Tudo pronto, {fullName.split(' ')[0]}!
                </h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                  Sua fatura oficial no valor de <strong className="text-[#e08dff]">R$ {plan.priceTotal.toFixed(2).replace('.', ',')}</strong> foi criada.
                </p>
                
                <div className="my-4 p-4 bg-white/5 border border-white/5 rounded-xl text-left space-y-1.5 text-xs text-neutral-300 w-full">
                  <div className="flex justify-between"><span className="text-neutral-500">Inscrição:</span> <span className="font-semibold text-white">{plan.name}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-500">Forma de Pagamento:</span> <span className="font-semibold text-white uppercase">{paymentMethod === 'pix' ? 'Pix ⚡' : 'Cartão de Crédito 💳'}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-500">E-mail:</span> <span className="font-semibold text-white truncate max-w-[200px]">{email}</span></div>
                </div>
                
                <p className="text-[10px] text-zinc-400 max-w-sm mx-auto font-sans leading-relaxed pt-2">
                  Clique no botão abaixo para concluir o pagamento em uma aba 100% segura do Asaas Checkout.
                </p>
              </div>

              <div className="w-full space-y-3 pt-2">
                <a
                  href={paymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#e08dff] hover:bg-[#d07df0] active:scale-[0.99] font-sans font-extrabold text-[#0d0d0f] text-sm py-4 px-6 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer border-0 shadow-[0_0_30px_rgba(224,141,255,0.25)] hover:shadow-[0_0_40px_rgba(224,141,255,0.45)] text-center block"
                >
                  Ir para Pagamento Seguro
                  <ArrowRight className="w-4 h-4" />
                </a>
                
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-neutral-500 hover:text-neutral-300 transition focus:outline-none bg-transparent border-0 cursor-pointer"
                >
                  Fechar janela
                </button>
              </div>
            </div>
          ) : isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border border-[#e08dff]/10 flex items-center justify-center">
                  <Loader className="w-10 h-10 text-[#e08dff] animate-spin" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 border-2 border-[#0d0d0f]">
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-display font-bold text-white uppercase tracking-wider">
                  Criando Faturamento Seguro
                </h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                  Buscando cadastro e gerando seu QR Code / link oficial criptografado diretamente na carteira de segurança do <span className="text-[#e08dff] font-semibold">Asaas Tecnologia</span>...
                </p>
              </div>
              <div className="text-[10px] text-neutral-500 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 animate-pulse">
                Redirecionando em instantes...
              </div>
            </div>
          ) : (
            <>
              {/* Product Info & Header */}
              <div className="text-center space-y-2 mb-6">
                <span className="text-[10px] bg-[#e08dff]/10 text-[#e08dff] font-mono select-none px-2.5 py-1 rounded-full border border-[#e08dff]/20 font-bold tracking-wider uppercase">
                  Checkout de Inscrição 🔒
                </span>
                <h3 className="text-2xl font-display font-extrabold text-white tracking-tight">
                  Matrícula: {plan.name}
                </h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  Preencha os dados abaixo e Prossiga para o pagamento oficial na plataforma de segurança da sua treinadora.
                </p>
              </div>

              {/* Plan Box Review */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-center justify-between mb-6">
                <div className="flex items-center space-y-0.5 flex-col items-start">
                  <span className="text-xs font-semibold text-neutral-300">Consultoria Suzana Personal</span>
                  <span className="text-[10px] text-neutral-500">{plan.durationMonths} meses de acompanhamento</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-neutral-400 line-through block">
                    R$ {(plan.priceTotal * 1.25).toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-md font-display font-extrabold text-[#e08dff]">
                    R$ {plan.priceTotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-xs text-red-400 text-center font-medium mb-4">
                  ⚠️ {errorMsg}
                </div>
              )}

              {/* Patient/Student Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* 1. Full Name */}
                <div className="space-y-1">
                  <label className="text-[11px] text-neutral-400 font-semibold uppercase tracking-wider block">
                    Nome Completo <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
                    <input
                      type="text"
                      required
                      placeholder="Ex: Mariana Silva"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#131316] border border-white/5 focus:border-[#e08dff]/40 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none transition group"
                    />
                  </div>
                </div>

                {/* 2. Email Address */}
                <div className="space-y-1">
                  <label className="text-[11px] text-neutral-400 font-semibold uppercase tracking-wider block">
                    E-mail de Recebimento de Acesso <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
                    <input
                      type="email"
                      required
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#131316] border border-white/5 focus:border-[#e08dff]/40 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none transition"
                    />
                  </div>
                  <span className="text-[9px] text-neutral-500 block">
                    Suas credenciais e aplicativo de treino serão enviados para este e-mail.
                  </span>
                </div>

                {/* Row: WhatsApp & CPF */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* WhatsApp */}
                  <div className="space-y-1">
                    <label className="text-[11px] text-neutral-400 font-semibold uppercase tracking-wider block">
                      Celular / WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
                      <input
                        type="text"
                        required
                        placeholder="(11) 99999-9999"
                        value={phone}
                        onChange={handlePhoneChange}
                        className="w-full bg-[#131316] border border-white/5 focus:border-[#e08dff]/40 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none transition"
                      />
                    </div>
                  </div>

                  {/* CPF */}
                  <div className="space-y-1">
                    <label className="text-[11px] text-neutral-400 font-semibold uppercase tracking-wider block">
                      CPF <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
                      <input
                        type="text"
                        required
                        placeholder="000.000.000-00"
                        value={cpf}
                        onChange={handleCpfChange}
                        className="w-full bg-[#131316] border border-white/5 focus:border-[#e08dff]/40 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="text-[11px] text-neutral-400 font-semibold uppercase tracking-wider block mb-2">
                    Forma de Pagamento Preferida
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Option 1: Pix */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('pix')}
                      className={`font-sans py-3 px-4 rounded-xl border text-left cursor-pointer transition flex flex-col items-start gap-1 ${
                        paymentMethod === 'pix'
                          ? 'border-[#e08dff] bg-[#e08dff]/5 text-white'
                          : 'border-white/5 bg-[#131316] hover:border-white/10 text-neutral-400'
                      }`}
                    >
                      <span className="text-xs font-bold font-sans flex items-center gap-1.5 text-white">
                        Pix ⚡
                      </span>
                      <span className="text-[10px] text-neutral-500 leading-normal">
                        Compensa no mesmo minuto
                      </span>
                    </button>

                    {/* Option 2: Card */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`font-sans py-3 px-4 rounded-xl border text-left cursor-pointer transition flex flex-col items-start gap-1 ${
                        paymentMethod === 'card'
                          ? 'border-[#e08dff] bg-[#e08dff]/5 text-white'
                          : 'border-white/5 bg-[#131316] hover:border-white/10 text-neutral-400'
                      }`}
                    >
                      <span className="text-xs font-bold font-sans flex items-center gap-1.5 text-white">
                        Cartão de Crédito 💳
                      </span>
                      <span className="text-[10px] text-neutral-500 leading-normal">
                        Parcele em até 12x
                      </span>
                    </button>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-start gap-2.5 text-left text-[11px] text-neutral-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="font-sans leading-relaxed">
                    Seus dados cadastrais são assegurados com criptografia SSL 256 bits. O faturamento e cobrança oficial serão processados de forma 100% segura pelo gateway <strong className="text-emerald-400">Asaas Tecnologia de Pagamentos S.A.</strong>
                  </p>
                </div>

                {/* CTA Submit Redirect Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#e08dff] hover:bg-[#d07df0] active:scale-[0.99] font-sans font-extrabold text-[#0d0d0f] text-sm py-3.5 px-6 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer border-0 mt-2"
                >
                  Ir para Pagamento Seguro
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </>
          )}

        </div>

        <div className="px-6 py-4 border-t border-white/5 bg-black/40 text-center text-[10px] text-neutral-600 font-sans">
          Autorizado oficial Suzana Personal & Asaas S.A. CNPJ 19.540.550/0001-21
        </div>
      </motion.div>
    </div>
  );
}
