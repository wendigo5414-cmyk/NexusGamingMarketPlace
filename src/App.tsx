/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, Menu, X, ChevronRight, Star, Shield, Zap, 
  Bitcoin, Wallet, CreditCard, CheckCircle2, Gamepad2, 
  TrendingUp, Users, Clock
} from 'lucide-react';

// --- Mock Data ---
const ITEMS = [
  { id: 1, name: 'Chroma Darkbringer', game: 'MM2', price: 14.99, image: 'https://picsum.photos/seed/mm2dark/400/400?blur=2', rarity: 'Godly' },
  { id: 2, name: 'Corrupt Set', game: 'MM2', price: 29.99, image: 'https://picsum.photos/seed/mm2corrupt/400/400?blur=2', rarity: 'Ancient' },
  { id: 3, name: 'Icebreaker', game: 'MM2', price: 9.99, image: 'https://picsum.photos/seed/mm2ice/400/400?blur=2', rarity: 'Godly' },
  { id: 4, name: 'Neon Dragon', game: 'SAB', price: 19.99, image: 'https://picsum.photos/seed/sabdragon/400/400?blur=2', rarity: 'Legendary' },
  { id: 5, name: 'Shadow Blade', game: 'SAB', price: 24.99, image: 'https://picsum.photos/seed/sabshadow/400/400?blur=2', rarity: 'Mythic' },
  { id: 6, name: 'Frost Aura', game: 'SAB', price: 12.99, image: 'https://picsum.photos/seed/sabfrost/400/400?blur=2', rarity: 'Epic' },
];

const ROBUX_TIERS = [
  { id: 'r1', amount: '1,000', price: 8.99, bonus: '0%' },
  { id: 'r2', amount: '5,000', price: 39.99, bonus: '10%' },
  { id: 'r3', amount: '10,000', price: 74.99, bonus: '20%', popular: true },
  { id: 'r4', amount: '50,000', price: 349.99, bonus: '35%' },
];

const ACCOUNTS = [
  { id: 'a1', title: 'Premium Scriptblox', desc: 'Lifetime access, all features unlocked.', price: 49.99, stock: 5 },
  { id: 'a2', title: '2010 Aged Account', desc: 'Clean history, rare badges included.', price: 89.99, stock: 2 },
  { id: 'a3', title: 'Stacked MM2 Alt', desc: 'Level 100+, 50+ Godlies.', price: 129.99, stock: 1 },
];

const CRYPTO_OPTIONS = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', icon: Bitcoin, color: 'text-orange-500' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', icon: Wallet, color: 'text-blue-400' },
  { id: 'ltc', name: 'Litecoin', symbol: 'LTC', icon: Wallet, color: 'text-gray-300' },
  { id: 'sol', name: 'Solana', symbol: 'SOL', icon: Zap, color: 'text-purple-400' },
  { id: 'usdt', name: 'Tether', symbol: 'USDT', icon: Wallet, color: 'text-green-500' },
];

const RECENT_TX = [
  "User xX_Slayer_Xx just bought Chroma Darkbringer",
  "User Guest1337 just bought 10,000 Robux",
  "User ProGamer99 just bought Premium Scriptblox",
  "User Ninja_01 just bought Corrupt Set",
  "User AlphaWolf just bought 5,000 Robux",
];

// --- Components ---

const Navbar = ({ cartCount, onOpenCart }: { cartCount: number, onOpenCart: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Items', href: '#items' },
    { name: 'Currency', href: '#currency' },
    { name: 'Accounts', href: '#accounts' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass-panel py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-8 h-8 text-neon-blue" />
            <span className="font-display font-bold text-2xl tracking-wider text-white">
              NEXUS<span className="text-neon-purple">.GG</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-gray-300 hover:text-neon-blue transition-colors font-medium">
                {link.name}
              </a>
            ))}
            <button 
              onClick={onOpenCart}
              className="relative p-2 text-gray-300 hover:text-neon-purple transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-neon-blue text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center transform translate-x-1 -translate-y-1">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={onOpenCart} className="relative p-2 text-gray-300">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-neon-blue text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center transform translate-x-1 -translate-y-1">
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-300">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-panel border-t-0"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-neon-blue hover:bg-white/5 rounded-md"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-purple/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon-blue/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 border-neon-blue/30 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
          >
            <span className="flex h-2 w-2 rounded-full bg-neon-blue animate-pulse shadow-[0_0_8px_#00f0ff]"></span>
            <span className="text-sm font-medium text-neon-blue">Live Crypto Processing Active</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6"
          >
            LEVEL UP YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple neon-text-blue">
              GAME ARSENAL
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto"
          >
            The premier digital marketplace for premium gaming assets, aged accounts, and currency. Instant delivery, secure crypto checkout.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <a 
              href="#items" 
              className="px-8 py-4 rounded-lg bg-neon-blue/10 text-neon-blue font-bold border border-neon-blue neon-border-blue hover:bg-neon-blue hover:text-black transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)]"
            >
              Shop Now <ChevronRight className="w-5 h-5" />
            </a>
            <a 
              href="#currency" 
              className="px-8 py-4 rounded-lg glass-panel text-white font-bold hover:bg-white/10 hover:border-white/30 transition-all duration-300 flex items-center justify-center gap-2"
            >
              View Services
            </a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-12 flex flex-col items-center justify-center gap-2"
          >
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <div key={star} className="bg-green-500 p-1 rounded-sm">
                  <Star className="w-4 h-4 text-white fill-white" />
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-400">
              Rated <span className="font-bold text-white">4.9/5</span> from over <span className="font-bold text-white">10,000+</span> reviews
            </p>
          </motion.div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto border-t border-white/10 pt-10">
            <div className="flex flex-col items-center gap-2 group">
              <div className="p-3 rounded-full bg-neon-blue/10 group-hover:bg-neon-blue/20 transition-colors">
                <Zap className="w-6 h-6 text-neon-blue" />
              </div>
              <span className="font-medium text-gray-300">Instant Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-2 group">
              <div className="p-3 rounded-full bg-neon-purple/10 group-hover:bg-neon-purple/20 transition-colors">
                <Shield className="w-6 h-6 text-neon-purple" />
              </div>
              <span className="font-medium text-gray-300">Secure Crypto</span>
            </div>
            <div className="flex flex-col items-center gap-2 group">
              <div className="p-3 rounded-full bg-yellow-400/10 group-hover:bg-yellow-400/20 transition-colors">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="font-medium text-gray-300">5-Star Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ItemsGrid = ({ onAddToCart }: { onAddToCart: (item: any) => void }) => {
  return (
    <section id="items" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Trending <span className="text-neon-blue">Items</span></h2>
            <p className="text-gray-400">Rare drops from MM2, SAB, and more.</p>
          </div>
          <div className="hidden md:flex gap-2">
            <button className="px-4 py-2 rounded-full glass-panel text-sm font-medium hover:text-neon-blue transition-colors">All</button>
            <button className="px-4 py-2 rounded-full glass-panel text-sm font-medium hover:text-neon-blue transition-colors">MM2</button>
            <button className="px-4 py-2 rounded-full glass-panel text-sm font-medium hover:text-neon-blue transition-colors">SAB</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ITEMS.map((item) => (
            <motion.div 
              key={item.id}
              whileHover={{ y: -5 }}
              className="glass-panel rounded-2xl overflow-hidden group hover:border-neon-purple/50 transition-colors duration-300 shadow-[0_0_0_rgba(176,38,255,0)] hover:shadow-[0_0_20px_rgba(176,38,255,0.2)]"
            >
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#05050a] to-transparent z-10" />
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 z-20">
                  <span className="px-2 py-1 text-xs font-bold rounded bg-black/50 backdrop-blur-md border border-white/10 text-gray-300">
                    {item.game}
                  </span>
                </div>
                <div className="absolute top-3 right-3 z-20">
                  <span className={`px-2 py-1 text-xs font-bold rounded bg-black/50 backdrop-blur-md border border-white/10 
                    ${item.rarity === 'Godly' ? 'text-pink-400' : 
                      item.rarity === 'Ancient' ? 'text-red-500' : 
                      item.rarity === 'Mythic' ? 'text-purple-400' : 'text-blue-400'}`}
                  >
                    {item.rarity}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold mb-1">{item.name}</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-2xl font-display font-bold text-neon-blue">${item.price}</span>
                  <button 
                    onClick={() => onAddToCart(item)}
                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-neon-blue/20 text-white hover:text-neon-blue border border-white/10 hover:border-neon-blue/50 transition-all duration-300 flex items-center gap-2 shadow-[0_0_0_rgba(0,240,255,0)] hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                  >
                    <ShoppingCart className="w-4 h-4" /> Add
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Services = ({ onAddToCart }: { onAddToCart: (item: any) => void }) => {
  return (
    <section id="currency" className="py-20 relative bg-white/[0.02] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Currency & <span className="text-neon-purple">Gamepasses</span></h2>
          <p className="text-gray-400">Instant delivery via secure automated transfer systems.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ROBUX_TIERS.map((tier) => (
            <div 
              key={tier.id} 
              className={`relative glass-panel rounded-2xl p-6 flex flex-col transition-transform duration-300 hover:-translate-y-2 ${tier.popular ? 'border-neon-purple neon-border-purple shadow-[0_0_30px_rgba(176,38,255,0.2)]' : 'hover:border-white/20'}`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-neon-purple text-white text-xs font-bold rounded-full shadow-[0_0_10px_rgba(176,38,255,0.5)]">
                  MOST POPULAR
                </div>
              )}
              <div className="text-center mb-6">
                <span className="text-sm font-medium text-gray-400">Robux Package</span>
                <h3 className="text-3xl font-display font-bold mt-2 flex items-center justify-center gap-2">
                  <span className="text-green-400">R$</span> {tier.amount}
                </h3>
                <div className="mt-2 inline-block px-2 py-1 rounded bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20">
                  +{tier.bonus} BONUS
                </div>
              </div>
              
              <div className="mt-auto pt-6 border-t border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400">Price</span>
                  <span className="text-xl font-bold">${tier.price}</span>
                </div>
                <button 
                  onClick={() => onAddToCart({ ...tier, name: `${tier.amount} Robux` })}
                  className={`w-full py-3 rounded-lg font-bold transition-all duration-300 ${
                    tier.popular 
                      ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple neon-border-purple hover:bg-neon-purple hover:text-white hover:shadow-[0_0_20px_rgba(176,38,255,0.5)]' 
                      : 'bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/30'
                  }`}
                >
                  Purchase
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Accounts = ({ onAddToCart }: { onAddToCart: (item: any) => void }) => {
  return (
    <section id="accounts" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple neon-text-blue">Accounts</span></h2>
            <p className="text-gray-400">Aged accounts, loaded alts, and premium script access.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {ACCOUNTS.map((acc) => (
            <motion.div 
              key={acc.id} 
              whileHover={{ y: -5 }}
              className="glass-panel rounded-2xl p-6 flex flex-col group hover:border-neon-blue/50 transition-colors duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-lg bg-neon-blue/10 text-neon-blue group-hover:bg-neon-blue/20 transition-colors">
                  <Shield className="w-6 h-6" />
                </div>
                <span className="px-2 py-1 text-xs font-bold rounded bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                  Only {acc.stock} left
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-neon-blue transition-colors">{acc.title}</h3>
              <p className="text-gray-400 text-sm mb-6 flex-grow">{acc.desc}</p>
              
              <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/10">
                <span className="text-2xl font-display font-bold text-white group-hover:text-neon-blue transition-colors">${acc.price}</span>
                <button 
                  onClick={() => onAddToCart({ ...acc, name: acc.title })}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-neon-blue/20 text-white hover:text-neon-blue border border-white/10 hover:border-neon-blue/50 transition-all duration-300 shadow-[0_0_0_rgba(0,240,255,0)] hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CheckoutModal = ({ 
  isOpen, 
  onClose, 
  cart, 
  total,
  onRemoveFromCart
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  cart: any[], 
  total: number,
  onRemoveFromCart: (index: number) => void
}) => {
  const [selectedCrypto, setSelectedCrypto] = useState(CRYPTO_OPTIONS[0].id);
  const [step, setStep] = useState(1); // 1: Cart, 2: Payment, 3: Success
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(3);
    }, 2000);
  };

  const handleClose = () => {
    if (step === 3) {
      onRemoveFromCart(-1); // special flag to clear cart
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl glass-panel rounded-2xl overflow-hidden border-neon-blue/30 shadow-[0_0_50px_rgba(0,240,255,0.1)]"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
          <h2 className="text-xl font-display font-bold flex items-center gap-2">
            {step === 3 ? (
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            ) : (
              <ShoppingCart className="w-5 h-5 text-neon-blue" />
            )}
            {step === 1 ? 'Your Cart' : step === 2 ? 'Crypto Checkout' : 'Order Complete'}
          </h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {step === 1 ? (
            // Cart Step
            <>
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">Your cart is empty.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 rounded-lg bg-white/5 border border-white/10 group hover:border-white/20 transition-colors">
                      <div className="flex items-center gap-4">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded bg-white/10 flex items-center justify-center">
                            <Gamepad2 className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          {item.game && <span className="text-xs text-gray-400">{item.game}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold">${item.price.toFixed(2)}</span>
                        <button 
                          onClick={() => onRemoveFromCart(idx)}
                          className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-400">Total Amount</span>
                  <span className="text-3xl font-display font-bold text-neon-blue">${total.toFixed(2)}</span>
                </div>
                
                <button 
                  disabled={cart.length === 0}
                  onClick={() => setStep(2)}
                  className="w-full py-4 rounded-lg bg-neon-blue/20 text-neon-blue font-bold border border-neon-blue neon-border-blue hover:bg-neon-blue hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Proceed to Payment
                </button>
              </div>
            </>
          ) : step === 2 ? (
            // Payment Step
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">Select Cryptocurrency</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {CRYPTO_OPTIONS.map((crypto) => {
                    const Icon = crypto.icon;
                    const isSelected = selectedCrypto === crypto.id;
                    return (
                      <button
                        key={crypto.id}
                        onClick={() => setSelectedCrypto(crypto.id)}
                        className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all duration-200 ${
                          isSelected 
                            ? 'bg-neon-blue/10 border-neon-blue neon-border-blue' 
                            : 'bg-white/5 border-white/10 hover:border-white/30'
                        }`}
                      >
                        <Icon className={`w-8 h-8 mb-2 ${crypto.color}`} />
                        <span className="font-medium text-sm">{crypto.name}</span>
                        <span className="text-xs text-gray-500">{crypto.symbol}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-black/50 border border-white/10 font-mono text-sm">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Amount to send:</span>
                  <span className="text-neon-blue font-bold">
                    {(total / 65000).toFixed(6)} {CRYPTO_OPTIONS.find(c => c.id === selectedCrypto)?.symbol}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Address:</span>
                  <span className="text-xs text-gray-300 truncate ml-4">bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(1)}
                  disabled={isProcessing}
                  className="px-6 py-4 rounded-lg glass-panel text-white font-bold hover:bg-white/10 transition-all duration-300 disabled:opacity-50"
                >
                  Back
                </button>
                <button 
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="flex-1 py-4 rounded-lg bg-neon-purple/20 text-neon-purple font-bold border border-neon-purple neon-border-purple hover:bg-neon-purple hover:text-white transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-neon-purple border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" /> Confirm Payment
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            // Success Step
            <div className="text-center py-12">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="w-12 h-12 text-green-400" />
              </motion.div>
              <h3 className="text-3xl font-display font-bold mb-2">Payment Successful!</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Your payment has been verified. Your items will be delivered to your account shortly. Check your email for the receipt.
              </p>
              <button 
                onClick={handleClose}
                className="px-8 py-4 rounded-lg bg-neon-blue/20 text-neon-blue font-bold border border-neon-blue neon-border-blue hover:bg-neon-blue hover:text-black transition-all duration-300"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const TrustTicker = () => {
  return (
    <div className="fixed bottom-0 w-full bg-black/80 backdrop-blur-md border-t border-white/10 py-2 z-40 overflow-hidden flex">
      <motion.div 
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
        className="flex whitespace-nowrap gap-8 px-4 w-max"
      >
        {[...RECENT_TX, ...RECENT_TX, ...RECENT_TX, ...RECENT_TX].map((tx, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
            {tx}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const Toast = ({ message, onClose }: { message: string, onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className="fixed bottom-16 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg glass-panel border-neon-blue/50 shadow-[0_0_20px_rgba(0,240,255,0.2)]"
    >
      <div className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center">
        <ShoppingCart className="w-4 h-4 text-neon-blue" />
      </div>
      <div>
        <p className="text-sm font-bold text-white">Added to Cart</p>
        <p className="text-xs text-gray-400">{message}</p>
      </div>
      <button onClick={onClose} className="ml-2 text-gray-400 hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export default function App() {
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const addToCart = (item: any) => {
    setCart([...cart, item]);
    setToastMessage(`${item.name} added to your cart.`);
  };

  const removeFromCart = (index: number) => {
    if (index === -1) {
      setCart([]);
      return;
    }
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-[#05050a] text-white pb-12">
      <Navbar cartCount={cart.length} onOpenCart={() => setIsCartOpen(true)} />
      
      <main>
        <Hero />
        <ItemsGrid onAddToCart={addToCart} />
        <Services onAddToCart={addToCart} />
        <Accounts onAddToCart={addToCart} />
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-black/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Gamepad2 className="w-6 h-6 text-neon-blue" />
            <span className="font-display font-bold text-xl tracking-wider text-white">
              NEXUS<span className="text-neon-purple">.GG</span>
            </span>
          </div>
          <p className="text-gray-500 text-sm">
            &copy; 2026 Nexus Gaming Marketplace. All rights reserved.<br/>
            Not affiliated with any game developers or publishers.
          </p>
        </div>
      </footer>

      <AnimatePresence>
        {isCartOpen && (
          <CheckoutModal 
            isOpen={isCartOpen} 
            onClose={() => setIsCartOpen(false)} 
            cart={cart}
            total={total}
            onRemoveFromCart={removeFromCart}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toastMessage && (
          <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
        )}
      </AnimatePresence>

      <TrustTicker />
    </div>
  );
}

