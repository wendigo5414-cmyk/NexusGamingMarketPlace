import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, X, ChevronLeft } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<any[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [config, setConfig] = useState<any>({});
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  
  const [step, setStep] = useState(1); // 1: Cart, 2: Details, 3: Payment, 4: Success
  const [customerInfo, setCustomerInfo] = useState({
    robloxUsername: '',
    displayName: '',
    realName: '',
    mobile: '',
    email: ''
  });
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [exactAmount, setExactAmount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetch('/api/config').then(res => res.json()).then(setConfig);
    fetch('/api/payment-methods').then(res => res.json()).then(data => {
      setPaymentMethods(data);
      if (data.length > 0) setSelectedCrypto(data[0].id);
    });
  }, []);

  useEffect(() => {
    if (step === 3) {
      const total = cart.reduce((sum, item) => sum + item.price, 0);
      const randomCents = Math.floor(Math.random() * 99) + 1;
      setExactAmount(total + (randomCents / 100));
      
      setTimeLeft(300); // 5 minutes
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, cart]);

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          totalAmount: total,
          exactAmount: exactAmount,
          paymentMethodId: selectedCrypto,
          customerInfo,
          status: 'pending'
        })
      });
    } catch (e) {
      console.error(e);
    }

    setTimeout(() => {
      setIsProcessing(false);
      setStep(4);
      setCart([]);
      localStorage.removeItem('cart');
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const selectedMethod = paymentMethods.find(m => m.id === selectedCrypto);

  return (
    <div className="min-h-screen bg-[#05050a] text-white p-4 md:p-10">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8">
        <ChevronLeft className="w-5 h-5" /> Back to Store
      </button>

      <div className="max-w-3xl mx-auto glass-panel rounded-2xl p-6 md:p-10 border border-white/10 shadow-[0_0_50px_rgba(0,240,255,0.05)]">
        <h1 className="text-3xl font-display font-bold mb-8 text-neon-blue">Checkout</h1>

        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-xl font-bold mb-4">1. Review Cart</h2>
            {cart.length === 0 ? (
              <p className="text-gray-400">Your cart is empty.</p>
            ) : (
              <div className="space-y-4">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center gap-4">
                      {item.image && <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />}
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-400">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(idx)} className="text-red-400 hover:text-red-300 p-2 bg-red-400/10 rounded-lg">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <div className="text-right text-2xl font-bold mt-6 pt-6 border-t border-white/10">
                  Total: <span className="text-neon-blue">${total.toFixed(2)}</span>
                </div>
                <button 
                  onClick={() => setStep(2)}
                  className="w-full mt-6 py-4 bg-neon-blue/20 text-neon-blue border border-neon-blue font-bold rounded-lg hover:bg-neon-blue hover:text-black transition-colors"
                >
                  Proceed to Details
                </button>
              </div>
            )}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-xl font-bold mb-4">2. Customer Details</h2>
            <div className="space-y-4">
              {config.requireRobloxUsername && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Roblox Username *</label>
                  <input type="text" required value={customerInfo.robloxUsername} onChange={e => setCustomerInfo({...customerInfo, robloxUsername: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-blue focus:outline-none" />
                </div>
              )}
              {config.requireDisplayName && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Display Name *</label>
                  <input type="text" required value={customerInfo.displayName} onChange={e => setCustomerInfo({...customerInfo, displayName: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-blue focus:outline-none" />
                </div>
              )}
              {config.requireRealName && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Real Name *</label>
                  <input type="text" required value={customerInfo.realName} onChange={e => setCustomerInfo({...customerInfo, realName: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-blue focus:outline-none" />
                </div>
              )}
              {config.requireMobile && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Mobile Number *</label>
                  <input type="tel" required value={customerInfo.mobile} onChange={e => setCustomerInfo({...customerInfo, mobile: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-blue focus:outline-none" />
                </div>
              )}
              {config.requireEmail && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Email Address *</label>
                  <input type="email" required value={customerInfo.email} onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-blue focus:outline-none" />
                </div>
              )}
              <div className="flex gap-4 mt-8">
                <button onClick={() => setStep(1)} className="px-6 py-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">Back</button>
                <button onClick={() => setStep(3)} className="flex-1 py-4 bg-neon-blue/20 text-neon-blue border border-neon-blue font-bold rounded-lg hover:bg-neon-blue hover:text-black transition-colors">Continue to Payment</button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h2 className="text-xl font-bold mb-2">3. Payment</h2>
            <p className="text-gray-400 mb-6">Please complete your payment within the time limit.</p>
            
            <div className="text-5xl font-mono font-bold text-red-400 mb-8 drop-shadow-[0_0_10px_rgba(248,113,113,0.5)]">
              {formatTime(timeLeft)}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              {paymentMethods.map(crypto => (
                <button
                  key={crypto.id}
                  onClick={() => setSelectedCrypto(crypto.id)}
                  className={`p-4 rounded-lg border transition-all ${selectedCrypto === crypto.id ? 'bg-neon-blue/20 border-neon-blue shadow-[0_0_15px_rgba(0,240,255,0.2)]' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
                >
                  <div className="font-bold">{crypto.name}</div>
                  <div className="text-sm text-gray-400">{crypto.symbol}</div>
                </button>
              ))}
            </div>

            {selectedMethod && (
              <div className="bg-black/50 p-6 rounded-xl border border-white/10 inline-block text-left w-full max-w-md">
                <p className="text-gray-400 mb-1">Amount to send:</p>
                <p className="text-4xl font-bold text-neon-blue mb-6">${exactAmount.toFixed(2)} <span className="text-sm text-gray-500">{selectedMethod.symbol}</span></p>
                
                {selectedMethod.qrCodeUrl && (
                  <div className="flex justify-center mb-6">
                    <img src={selectedMethod.qrCodeUrl} alt="QR" className="w-48 h-48 rounded-lg bg-white p-2" />
                  </div>
                )}
                
                <p className="text-gray-400 mb-1">Wallet Address:</p>
                <p className="text-sm text-neon-purple break-all bg-white/5 p-3 rounded border border-white/10">{selectedMethod.address}</p>
              </div>
            )}

            <div className="flex gap-4 mt-8">
              <button onClick={() => setStep(2)} disabled={isProcessing} className="px-6 py-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50">Back</button>
              <button onClick={handlePayment} disabled={isProcessing} className="flex-1 py-4 bg-neon-purple/20 text-neon-purple border border-neon-purple font-bold rounded-lg hover:bg-neon-purple hover:text-white transition-colors flex justify-center items-center gap-2 disabled:opacity-50">
                {isProcessing ? "Processing..." : "I have sent the payment"}
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-12">
            <CheckCircle2 className="w-24 h-24 text-green-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]" />
            <h2 className="text-4xl font-display font-bold mb-4">Order Received!</h2>
            <p className="text-gray-400 mb-8 text-lg">Your payment is being verified. We will process your order shortly.</p>
            <button onClick={() => navigate('/')} className="px-8 py-4 bg-neon-blue/20 text-neon-blue border border-neon-blue font-bold rounded-lg hover:bg-neon-blue hover:text-black transition-colors">
              Return to Store
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
