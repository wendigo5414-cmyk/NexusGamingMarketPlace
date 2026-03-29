import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { Shield, Plus, Trash2, Edit2, LogOut, Settings, Package, CreditCard, ShoppingBag } from 'lucide-react';

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('products');

  const [products, setProducts] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [checkoutConfig, setCheckoutConfig] = useState<any>({
    requireRobloxUsername: true,
    requireDisplayName: false,
    requireRealName: false,
    requireMobile: false,
    requireEmail: true,
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      if (u) {
        // Check if admin (we assume rracfo@gmail.com is admin or we check a users collection)
        if (u.email === 'rracfo@gmail.com') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      setProducts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubPayments = onSnapshot(collection(db, 'paymentMethods'), (snapshot) => {
      setPaymentMethods(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      setOrders(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubConfig = onSnapshot(doc(db, 'config', 'checkout'), (d) => {
      if (d.exists()) {
        setCheckoutConfig(d.data());
      }
    });

    return () => {
      unsubProducts();
      unsubPayments();
      unsubOrders();
      unsubConfig();
    };
  }, [isAdmin]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const handleLogout = () => signOut(auth);

  const saveConfig = async () => {
    await setDoc(doc(db, 'config', 'checkout'), checkoutConfig);
    alert('Checkout config saved!');
  };

  const addProduct = async () => {
    const name = prompt('Product Name:');
    if (!name) return;
    const price = parseFloat(prompt('Price:') || '0');
    const category = prompt('Category (items, currency, accounts):', 'items');
    
    await addDoc(collection(db, 'products'), {
      name,
      price,
      category,
      game: prompt('Game (e.g., MM2):') || '',
      image: prompt('Image URL:') || 'https://picsum.photos/400/400?blur=2',
      rarity: prompt('Rarity (e.g., Godly):') || '',
      stock: parseInt(prompt('Stock:') || '100'),
      createdAt: Date.now()
    });
  };

  const deleteProduct = async (id: string) => {
    if (confirm('Are you sure?')) {
      await deleteDoc(doc(db, 'products', id));
    }
  };

  const addPaymentMethod = async () => {
    const name = prompt('Method Name (e.g., Bitcoin):');
    if (!name) return;
    const symbol = prompt('Symbol (e.g., BTC):') || '';
    const address = prompt('Wallet Address:') || '';
    const qrCodeUrl = prompt('QR Code Image URL (optional):') || '';
    
    await addDoc(collection(db, 'paymentMethods'), {
      name,
      symbol,
      address,
      qrCodeUrl,
      color: 'text-neon-blue',
      createdAt: Date.now()
    });
  };

  const deletePaymentMethod = async (id: string) => {
    if (confirm('Are you sure?')) {
      await deleteDoc(doc(db, 'paymentMethods', id));
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#05050a] text-white flex items-center justify-center">
        <div className="glass-panel p-8 rounded-2xl text-center">
          <Shield className="w-16 h-16 text-neon-purple mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
          <button onClick={handleLogin} className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors">
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#05050a] text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4 text-red-500">Access Denied</h1>
        <p className="mb-6">You do not have admin privileges.</p>
        <button onClick={handleLogout} className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20">
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05050a] text-white flex">
      {/* Sidebar */}
      <div className="w-64 glass-panel border-r border-white/10 p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-10">
          <Shield className="w-8 h-8 text-neon-purple" />
          <span className="font-display font-bold text-xl">Admin Panel</span>
        </div>

        <nav className="space-y-2 flex-grow">
          {[
            { id: 'products', icon: Package, label: 'Products' },
            { id: 'payments', icon: CreditCard, label: 'Payment Methods' },
            { id: 'config', icon: Settings, label: 'Checkout Config' },
            { id: 'orders', icon: ShoppingBag, label: 'Orders' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === tab.id ? 'bg-neon-purple/20 text-neon-purple' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </nav>

        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-auto">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto">
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Manage Products</h2>
              <button onClick={addProduct} className="flex items-center gap-2 px-4 py-2 bg-neon-blue/20 text-neon-blue rounded-lg hover:bg-neon-blue hover:text-black transition-colors">
                <Plus className="w-5 h-5" /> Add Product
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(p => (
                <div key={p.id} className="glass-panel p-4 rounded-xl flex items-center gap-4">
                  <img src={p.image} alt={p.name} className="w-16 h-16 rounded object-cover" />
                  <div className="flex-1">
                    <h3 className="font-bold">{p.name}</h3>
                    <p className="text-sm text-gray-400">${p.price} • {p.category}</p>
                  </div>
                  <button onClick={() => deleteProduct(p.id)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Payment Methods</h2>
              <button onClick={addPaymentMethod} className="flex items-center gap-2 px-4 py-2 bg-neon-blue/20 text-neon-blue rounded-lg hover:bg-neon-blue hover:text-black transition-colors">
                <Plus className="w-5 h-5" /> Add Method
              </button>
            </div>
            <div className="space-y-4">
              {paymentMethods.map(m => (
                <div key={m.id} className="glass-panel p-6 rounded-xl flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-xl">{m.name} ({m.symbol})</h3>
                    <p className="text-sm text-gray-400 font-mono mt-1">{m.address}</p>
                    {m.qrCodeUrl && <p className="text-xs text-neon-blue mt-2">Has QR Code</p>}
                  </div>
                  <button onClick={() => deletePaymentMethod(m.id)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'config' && (
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold mb-8">Checkout Configuration</h2>
            <div className="glass-panel p-8 rounded-xl space-y-6">
              <h3 className="text-xl font-medium mb-4">Required Customer Information</h3>
              
              {Object.keys(checkoutConfig).map(key => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-gray-300">{key.replace('require', 'Require ')}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={checkoutConfig[key]}
                      onChange={(e) => setCheckoutConfig({ ...checkoutConfig, [key]: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-blue"></div>
                  </label>
                </div>
              ))}

              <button onClick={saveConfig} className="w-full mt-8 py-3 bg-neon-purple/20 text-neon-purple font-bold rounded-lg hover:bg-neon-purple hover:text-white transition-colors">
                Save Configuration
              </button>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h2 className="text-3xl font-bold mb-8">Recent Orders</h2>
            <div className="space-y-4">
              {orders.length === 0 ? (
                <p className="text-gray-400">No orders yet.</p>
              ) : (
                orders.map(o => (
                  <div key={o.id} className="glass-panel p-6 rounded-xl">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-xs text-gray-500 font-mono">{o.id}</span>
                        <h3 className="font-bold text-lg mt-1">Total: ${o.totalAmount.toFixed(2)} (Exact: {o.exactAmount})</h3>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${o.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                        {o.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 mb-4">
                      <p><strong>Method:</strong> {o.paymentMethodId}</p>
                      <p><strong>Customer:</strong> {JSON.stringify(o.customerInfo)}</p>
                    </div>
                    <div className="space-y-2">
                      {o.items.map((item: any, i: number) => (
                        <div key={i} className="flex items-center gap-2 bg-white/5 p-2 rounded">
                          <span className="text-neon-blue">{item.name}</span> - ${item.price}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
