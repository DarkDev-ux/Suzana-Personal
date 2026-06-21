import React, { useState } from 'react';
import { X, Shield, FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface TermsAndPrivacyProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'terms' | 'privacy';
}

export default function TermsAndPrivacy({ isOpen, onClose, initialTab = 'terms' }: TermsAndPrivacyProps) {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>(initialTab);

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
        className="relative w-full max-w-4xl bg-surface-card rounded-2xl max-h-[85vh] overflow-hidden flex flex-col border border-white/5 shadow-2xl purple-glow"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-background-black/50">
          <div className="flex items-center space-x-3">
            {activeTab === 'terms' ? (
              <FileText className="w-5 h-5 text-purple-primary" />
            ) : (
              <Shield className="w-5 h-5 text-purple-primary" />
            )}
            <h2 className="text-xl font-display font-bold text-white">
              {activeTab === 'terms' ? 'Termos de Uso' : 'Política de Privacidade'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 px-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-white/5 bg-background-black/30">
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex-1 py-3 text-center text-sm font-medium font-display tracking-wide transition ${
              activeTab === 'terms' 
                ? 'text-purple-primary border-b-2 border-purple-primary bg-white/[0.02]' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Termos de Uso de Consultoria
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 py-3 text-center text-sm font-medium font-display tracking-wide transition ${
              activeTab === 'privacy' 
                ? 'text-purple-primary border-b-2 border-purple-primary bg-white/[0.02]' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Privacidade & Tratamento de Dados
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 text-sm text-gray-400 font-sans leading-relaxed">
          {activeTab === 'terms' ? (
            <div className="space-y-6 animate-fade-in">
              <section className="space-y-3">
                <h3 className="text-white font-display font-semibold text-base flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-primary shrink-0" />
                  1. Escopo da Prestação de Serviços
                </h3>
                <p>
                  O serviço consiste em planejamento individualizado de rotinas de exercícios físicos, doravante denominado "Consultoria Online", idealizado e liderado exclusivamente pela profissional certificada <strong>Suzana Personal</strong> (sob registro profissional ativo). Os treinos são entregues digitalmente, ajustados aos objetivos e às declarações de saúde fornecidas voluntariamente pelo cliente.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-white font-display font-semibold text-base flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-primary shrink-0" />
                  2. Assinatura e Cobrança Automática
                </h3>
                <p>
                  A plataforma utiliza serviços de pagamento integrado (Mercado Pago). No caso de planos recorrentes contratados pelo Cliente (mensal, trimestral ou semestral), as assinaturas são processadas de acordo com o intervalo escolhido. A renovação acontece automaticamente ao final de cada período. Caso queira interromper a renovação, o aluno deverá solicitar o cancelamento com pelo menos 5 dias de antecedência do novo ciclo de faturamento.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-white font-display font-semibold text-base flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-primary shrink-0" />
                  3. Declaração do Aluno e Responsabilidade por Saúde
                </h3>
                <p>
                  O contratante declara estar em plenas condições de saúde para a prática esportiva e assume total responsabilidade pela veracidade das respostas dadas em nosso questionário anamnese inicial. Recomenda-se enfaticamente possuir liberação médica prévia antes de iniciar quaisquer atividades intensas de condicionamento cardiovascular ou levantamento de peso.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-white font-display font-semibold text-base flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-primary shrink-0" />
                  4. Política de Direitos Autorais e Uso de Imagens
                </h3>
                <p>
                  Todo material disponibilizado — incluindo vídeos explicativos de movimentos, guias alimentares de suporte, roteiros de treinos e estruturas pedagógicas — constituem propriedade intelectual exclusiva de <strong>Suzana Personal</strong>. É expressamente proibida a retransmissão, publicação ou distribuição comercial de tais conteúdos a terceiros sob sanções legais previstas na Lei de Direitos Autorais brasileira.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-white font-display font-semibold text-base flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-primary shrink-0" />
                  5. Devoluções e Reembolsos
                </h3>
                <p>
                  Em atendimento ao Código de Defesa do Consumidor, o cliente possui o direito de arrependimento e cancelamento do plano financeiro com estorno integral do valor pago em até 7 (sete) dias corridos a contar da confirmação do primeiro pagamento. Após esse prazo, reembolsos proporcionais não serão efetuados.
                </p>
              </section>
            </div>
          ) : (
            <div className="space-y-6">
              <section className="space-y-3">
                <h3 className="text-white font-display font-semibold text-base flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-primary shrink-0" />
                  1. Diretrizes da LGPD (Lei Geral de Proteção de Dados)
                </h3>
                <p>
                  Garantimos total transparência, integridade e segurança no tratamento das informações pessoais de nossos assinantes. Ao preencher o formulário cadastral, você consente expressamente com a coleta de seu Nome, Endereço de Email, e Número de WhatsApp exclusivo com o fito de processar a autenticação, notificação de pagamentos e suporte ativo via assessoria atlética direta.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-white font-display font-semibold text-base flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-primary shrink-0" />
                  2. Segurança dos Dados de Pagamento
                </h3>
                <p>
                  Todas as comunicações envolvendo transações bancárias, cartões de crédito e Pix são tratadas em ambiente criptografado de segurança SSL direto do <strong>Mercado Pago</strong>. Este ambiente cumpre integralmente os requisitos internacionais PCI-DSS (Payment Card Industry Data Security Standard). A plataforma da Suzana Personal não armazena nem tem acesso direto aos números de cartão de crédito digitados durante a compra.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-white font-display font-semibold text-base flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-primary shrink-0" />
                  3. Compartilhamento de Informações
                </h3>
                <p>
                  Sob nenhuma circunstância compartilhamos, comercializamos ou licenciamos bases de dados de e-mail ou dados de contato para fins publicitários de terceiros. As únicas trocas efetuadas envolvem os agentes tecnológicos mínimos necessários para faturamento (instituições emissoras e Mercado Pago) e para o contato de mentoria direta conduzido pela própria Suzana Personal via WhatsApp.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-white font-display font-semibold text-base flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-primary shrink-0" />
                  4. Alterações e Exclusão Permanente
                </h3>
                <p>
                  O usuário tem o direito, a qualquer momento, de requerer a exclusão permanente de seus dados pessoais ou cadastrais de nossa plataforma de treinos. Para realizar essa ação, basta abrir uma requisição de contato de suporte direto. A exclusão de dados cadastrais implicará a interrupção imediata de todos os serviços de consultoria fitness e cancelamento da assinatura recorrente associada.
                </p>
              </section>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/5 bg-background-black/50 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-purple-primary to-purple-dim text-white text-xs font-display font-bold uppercase rounded-full hover:opacity-95 transition"
          >
            Entendi e Concordo
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
