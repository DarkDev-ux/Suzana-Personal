import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { getPayments, addPayment, updatePaymentStatus, savePayments } from './src/db_sim';
import { PaymentSubscription } from './src/types';

// Run dotenv config
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API: List Plans
app.get('/api/plans', (req, res) => {
  res.json([
    {
      id: 'trimestral',
      name: 'Trimestral',
      durationMonths: 3,
      priceTotal: 900.00,
      priceMonthly: 300.00,
      checkoutUrl: process.env.ASAAS_LINK_TRIMESTRAL || 'https://cobranca.asaas.com/c/trimestral-placeholder',
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
      checkoutUrl: process.env.ASAAS_LINK_ANUAL || 'https://cobranca.asaas.com/c/anual-placeholder',
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
      checkoutUrl: process.env.ASAAS_LINK_SEMESTRAL || 'https://cobranca.asaas.com/c/semestral-placeholder',
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

// API: Create Payment Preference or direct Payment via Asaas API or high-fidelity simulation
app.post('/api/payments/create', async (req, res) => {
  try {
    const { planId, planName, amount, customerName, customerEmail, customerWhatsApp, customerCpf, paymentMethod, cardDetails } = req.body;

    if (!planId || !customerName || !customerEmail || !customerWhatsApp || !paymentMethod) {
      return res.status(400).json({ error: 'Campos obrigatórios não informados.' });
    }

    // Server-side security map to prevent price alterations or value modifications via HTTP requests
    const planMap: Record<string, { name: string; price: number }> = {
      trimestral: { name: 'Trimestral', price: 900.00 },
      anual: { name: 'Anual', price: 4800.00 },
      semestral: { name: 'Semestral', price: 2100.00 }
    };

    const targetPlan = planMap[planId.toLowerCase().trim()];
    if (!targetPlan) {
      return res.status(400).json({ error: 'Plano inválido ou inexistente.' });
    }

    // Force secure values determined on the server
    const verifiedAmount = targetPlan.price;
    const verifiedPlanName = targetPlan.name;

    const txId = 'tx_' + Math.floor(Math.random() * 10000000);
    const rawApiKey = process.env.ASAAS_API_KEY || '';
    const asaasKey = rawApiKey.replace(/^["']|["']$/g, '').trim();
    const asaasEnv = (process.env.ASAAS_ENV || 'sandbox').replace(/^["']|["']$/g, '').trim().toLowerCase();
    const asaasWalletId = (process.env.ASAAS_WALLET_ID || '').replace(/^["']|["']$/g, '').trim();
    const isProd = asaasEnv === 'production';
    const asaasBaseUrl = isProd ? 'https://api.asaas.com/v3' : 'https://sandbox.asaas.com/api/v3';

    let pixCode = undefined;
    let pixQrCodeImage = undefined;
    let cardLastFour = undefined;
    let paymentStatus: 'pending' | 'approved' | 'failed' = 'pending';
    let paymentUrl = `https://sandbox.asaas.com/i/simulate_${txId}`;

    // Validate if actual Asaas token is set
    const hasRealToken = asaasKey && asaasKey !== 'YOUR_ASAAS_API_KEY' && asaasKey.length > 10;
    let realAsaasId: string | undefined = undefined;

    if (hasRealToken) {
      // Clean up fields
      const cleanCpf = String(customerCpf || '').replace(/\D/g, '');
      const cleanPhone = String(customerWhatsApp || '').replace(/\D/g, '');

      try {
        console.log(`[Asaas] Usando ambiente: ${asaasEnv}. Criando ou buscando cliente para: ${customerName}`);
        
        // 1. Create a customer in Asaas
        const customerPayload = {
          name: customerName.trim(),
          email: customerEmail.trim(),
          mobilePhone: cleanPhone,
          cpfCnpj: cleanCpf
        };

        const custRes = await fetch(`${asaasBaseUrl}/customers`, {
          method: 'POST',
          headers: {
            'access_token': asaasKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(customerPayload)
        });

        if (!custRes.ok) {
          const errText = await custRes.text();
          console.error('[Asaas] Falha ao registrar cliente:', errText);
          return res.status(400).json({ error: `Erro ao cadastrar cliente no Asaas: ${errText}` });
        }

        const customerData = await custRes.json();
        const customerId = customerData.id;
        console.log(`[Asaas] Cliente cadastrado com sucesso: ${customerId}`);

        // 2. Set dueDate (today's date + 3 days)
        const d = new Date();
        d.setDate(d.getDate() + 3);
        const dueDateStr = d.toISOString().split('T')[0];

        // 3. Create charge in Asaas
        const billingPayload: any = {
          customer: customerId,
          billingType: paymentMethod === 'pix' ? 'PIX' : 'CREDIT_CARD',
          value: verifiedAmount,
          dueDate: dueDateStr,
          description: `Consultoria Suzana Personal - ${verifiedPlanName}`,
          externalReference: txId
        };

        if (asaasWalletId) {
          billingPayload.walletId = asaasWalletId;
        }

        const paymentRes = await fetch(`${asaasBaseUrl}/payments`, {
          method: 'POST',
          headers: {
            'access_token': asaasKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(billingPayload)
        });

        if (!paymentRes.ok) {
          const errText = await paymentRes.text();
          console.error('[Asaas] Falha ao criar cobrança:', errText);
          return res.status(400).json({ error: `Erro ao gerar fatura no Asaas: ${errText}` });
        }

        const paymentData = await paymentRes.json();
        realAsaasId = paymentData.id;
        paymentUrl = paymentData.invoiceUrl || paymentUrl;
        console.log(`[Asaas] Cobrança criada. ID: ${realAsaasId}. Link da fatura: ${paymentUrl}`);

        // 4. If method is Pix, retrieve the direct QR Code data
        if (paymentMethod === 'pix') {
          console.log(`[Asaas] Obtendo Pix QR Code para cobrança ID: ${realAsaasId}`);
          const pixRes = await fetch(`${asaasBaseUrl}/payments/${realAsaasId}/pixQrCode`, {
            method: 'GET',
            headers: {
              'access_token': asaasKey
            }
          });

          if (pixRes.ok) {
            const pixData = await pixRes.json();
            if (pixData.success) {
              pixCode = pixData.payload;
              if (pixData.encodedImage) {
                pixQrCodeImage = `data:image/png;base64,${pixData.encodedImage}`;
              } else {
                pixQrCodeImage = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixCode)}`;
              }
            }
          } else {
            console.warn('[Asaas] Não foi possível carregar imagem do QR Code nativo do Asaas. Usando gerador alternativo.');
          }
        }
      } catch (err: any) {
        console.error('[Asaas] Erro de rede na API oficial do Asaas:', err);
        return res.status(502).json({ error: `Erro de comunicação com a API do Asaas: ${err.message}` });
      }
    }

    // Default simulation if real API fails or token not configured yet
    if (paymentMethod === 'pix' && !pixCode) {
      const randHex = Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join('');
      // Simulate real EMV Pix Code pointing specifically to Asaas infrastructure mockup
      pixCode = `00020101021226870014br.gov.bcb.pix2565qr.asaas.com/v2/cobranca/pay_sim_${randHex}5204000053039865802BR5915SuzanaPersonal6009SaoPaulo62070503***6304EE88`;
      pixQrCodeImage = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixCode)}`;
      paymentStatus = 'pending';
      paymentUrl = `https://sandbox.asaas.com/i/simulate_pix_${txId}`;
    } else if (paymentMethod === 'card') {
      const ccNum = String(cardDetails?.number || '');
      cardLastFour = ccNum.length >= 4 ? ccNum.slice(-4) : '4321';
      if (hasRealToken) {
        paymentStatus = 'pending'; // Needs user credit card checkout at redirect
      } else {
        paymentStatus = 'approved'; // Instant approved in offline simulation
        paymentUrl = `https://sandbox.asaas.com/i/receipt_approved_${txId}`;
      }
    }

    const newSub: PaymentSubscription = {
      id: txId,
      mpId: realAsaasId, // Store Asaas ID in the database parameter
      planId,
      planName: verifiedPlanName,
      paymentMethod,
      amount: verifiedAmount,
      status: paymentStatus,
      customerName,
      customerEmail,
      customerWhatsApp,
      pixCode,
      pixQrCodeImage,
      cardLastFour,
      paymentUrl,
      createdAt: new Date().toISOString()
    };

    const saved = addPayment(newSub);
    res.json({ success: true, payment: saved, isSimulation: !hasRealToken });

  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Erro interno ao processar pagamento.' });
  }
});

// API: Fetch single payment status and check with Asaas if pending
app.get('/api/payments/status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const payments = getPayments();
    const payment = payments.find(p => p.id === id);

    if (!payment) {
      return res.status(404).json({ error: 'Pagamento não encontrado.' });
    }

    const rawApiKey = process.env.ASAAS_API_KEY || '';
    const asaasKey = rawApiKey.replace(/^["']|["']$/g, '').trim();
    const asaasEnv = (process.env.ASAAS_ENV || 'sandbox').replace(/^["']|["']$/g, '').trim().toLowerCase();
    const asaasBaseUrl = asaasEnv === 'production' ? 'https://api.asaas.com/v3' : 'https://sandbox.asaas.com/api/v3';
    const hasRealToken = asaasKey && asaasKey !== 'YOUR_ASAAS_API_KEY' && asaasKey.length > 10;

    // If local payment is pending and we have a real Asaas payment ID, poll Asaas check
    if (payment.status === 'pending' && payment.mpId && hasRealToken) {
      try {
        console.log(`[Asaas] Verificando status real para o ID: ${payment.mpId}`);
        const statusRes = await fetch(`${asaasBaseUrl}/payments/${payment.mpId}`, {
          method: 'GET',
          headers: {
            'access_token': asaasKey
          }
        });

        if (statusRes.ok) {
          const sData = await statusRes.json();
          console.log(`[Asaas] Status atual retornado: ${sData.status}`);
          
          let newStatus: 'approved' | 'pending' | 'failed' = payment.status;
          
          // Asaas statuses: PENDING, RECEIVED, CONFIRMED, OVERDUE, REFUNDED, etc.
          if (sData.status === 'RECEIVED' || sData.status === 'CONFIRMED') {
            newStatus = 'approved';
          } else if (['OVERDUE', 'REFUNDED', 'CHARGEBACK_REQUESTED', 'DUNNING_REQUESTED'].includes(sData.status)) {
            newStatus = 'failed';
          }

          if (newStatus !== payment.status) {
            updatePaymentStatus(id, newStatus);
            payment.status = newStatus;
          }
        }
      } catch (err) {
        console.error('[Asaas] Erro ao obter atualizações de status do Asaas:', err);
      }
    }

    res.json({ success: true, payment });
  } catch (error) {
    console.error('Error fetching payment status:', error);
    res.status(500).json({ error: 'Erro interno ao consultar status.' });
  }
});

// API: Verify checkout redirect callback
app.post('/api/payments/verify-redirect', async (req, res) => {
  try {
    const { id, status, paymentId } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'ID da transação local é obrigatório.' });
    }

    const payments = getPayments();
    const payment = payments.find(p => p.id === id);

    if (!payment) {
      return res.status(404).json({ error: 'Pagamento não encontrado.' });
    }

    // Update with incoming status if valid
    let newStatus: 'approved' | 'pending' | 'failed' = payment.status;
    if (status === 'approved' || status === 'RECEIVED' || status === 'CONFIRMED') {
      newStatus = 'approved';
    } else if (status === 'failed' || status === 'OVERDUE') {
      newStatus = 'failed';
    }

    if (paymentId && !payment.mpId) {
      payment.mpId = String(paymentId);
    }

    // Double check with Asaas
    const rawApiKey_red = process.env.ASAAS_API_KEY || '';
    const asaasKey_red = rawApiKey_red.replace(/^["']|["']$/g, '').trim();
    const asaasEnv_red = (process.env.ASAAS_ENV || 'sandbox').replace(/^["']|["']$/g, '').trim().toLowerCase();
    const asaasBaseUrl_red = asaasEnv_red === 'production' ? 'https://api.asaas.com/v3' : 'https://sandbox.asaas.com/api/v3';
    const hasRealToken_red = asaasKey_red && asaasKey_red !== 'YOUR_ASAAS_API_KEY' && asaasKey_red.length > 10;

    if (paymentId && hasRealToken_red) {
      try {
        const checkRes = await fetch(`${asaasBaseUrl_red}/payments/${paymentId}`, {
          method: 'GET',
          headers: {
            'access_token': asaasKey_red
          }
        });
        if (checkRes.ok) {
          const sData = await checkRes.json();
          if (sData.status === 'RECEIVED' || sData.status === 'CONFIRMED') {
            newStatus = 'approved';
          }
        }
      } catch (err) {
        console.error('[Asaas] Erro ao auditar status via callback redirect:', err);
      }
    }

    if (newStatus !== payment.status || paymentId) {
      payment.status = newStatus;
      const all = getPayments();
      const idx = all.findIndex(p => p.id === id);
      if (idx !== -1) {
        all[idx].status = newStatus;
        if (paymentId) all[idx].mpId = String(paymentId);
        savePayments(all);
      }
    }

    res.json({ success: true, payment });
  } catch (error) {
    console.error('Error verifying redirect payments:', error);
    res.status(500).json({ error: 'Erro ao verificar faturamento.' });
  }
});

// API: List Transactions
app.get('/api/admin/payments', (req, res) => {
  res.json(getPayments());
});

// API: Update status
app.post('/api/admin/payments/update-status', (req, res) => {
  const { id, status } = req.body;
  if (!id || !status) {
    return res.status(400).json({ error: 'Campos ID e Status são obrigatórios.' });
  }

  const updated = updatePaymentStatus(id, status);
  if (updated) {
    res.json({ success: true, payment: updated });
  } else {
    res.status(404).json({ error: 'Transação não encontrada.' });
  }
});

// Vite Middleware integration for Fullstack applet
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Suzana Personal] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
