import { useState, useEffect, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Shield, Plus, Trash2, Edit2, LogOut, Settings, Package, CreditCard, ShoppingBag } from 'lucide-react';

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [password, setPassword] = useState('');

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
  const [token, setToken] = useState<string | null>(localStorage.getItem('adminToken'));

  const [showProductModal, setShowProductModal] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '', price: 0, category: 'items', game: '', image: '', rarity: '', stock: 100
  });

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    name: '', symbol: '', address: '', qrCodeUrl: '', color: 'text-neon-blue'
  });

  const handleImageUpload = (e: any, field: string, isProduct: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isProduct) {
          setProductForm(prev => ({ ...prev, [field]: reader.result as string }));
        } else {
          setPaymentForm(prev => ({ ...prev, [field]: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (token) {
      setIsAdmin(true);
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const [productsRes, paymentsRes, ordersRes, configRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/payment-methods'),
        fetch('/api/orders', { headers }),
        fetch('/api/config')
      ]);

      if (productsRes.ok) setProducts(await productsRes.json());
      if (paymentsRes.ok) setPaymentMethods(await paymentsRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (configRes.ok) setCheckoutConfig(await configRes.json());
    } catch (error) {
      console.error("Failed to fetch admin data", error);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('adminToken', data.token);
        setToken(data.token);
        setIsAdmin(true);
      } else {
        alert('Invalid password');
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setIsAdmin(false);
  };

  const saveConfig = async () => {
    try {
      await fetch('/api/config', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(checkoutConfig)
      });
      alert('Checkout config saved!');
    } catch (error) {
      console.error("Failed to save config", error);
    }
  };

  const submitProduct = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productForm)
      });
      if (res.ok) {
        fetchData();
        setShowProductModal(false);
        setProductForm({ name: '', price: 0, category: 'items', game: '', image: '', rarity: '', stock: 100 });
      }
    } catch (error) {
      console.error("Failed to add product", error);
    }
  };

  const deleteProduct = async (id: string) => {
    if (confirm('Are you sure?')) {
      try {
        const res = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) fetchData();
      } catch (error) {
        console.error("Failed to delete product", error);
      }
    }
  };

  const submitPaymentMethod = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/payment-methods', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentForm)
      });
      if (res.ok) {
        fetchData();
        setShowPaymentModal(false);
        setPaymentForm({ name: '', symbol: '', address: '', qrCodeUrl: '', color: 'text-neon-blue' });
      }
    } catch (error) {
      console.error("Failed to add payment method", error);
    }
  };

  const deletePaymentMethod = async (id: string) => {
    if (confirm('Are you sure?')) {
      try {
        const res = await fetch(`/api/payment-methods/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) fetchData();
      } catch (error) {
        console.error("Failed to delete payment method", error);
      }
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Failed to update order status", error);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#05050a] text-white flex items-center justify-center">
        <div className="glass-panel p-8 rounded-2xl text-center max-w-md w-full">
          <Shield className="w-16 h-16 text-neon-purple mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin Password"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-blue"
            />
            <button type="submit" className="w-full px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors">
              Login
            </button>
          </form>
        </div>
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
              <button onClick={() => setShowProductModal(true)} className="flex items-center gap-2 px-4 py-2 bg-neon-blue/20 text-neon-blue rounded-lg hover:bg-neon-blue hover:text-black transition-colors">
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
              <button onClick={() => setShowPaymentModal(true)} className="flex items-center gap-2 px-4 py-2 bg-neon-blue/20 text-neon-blue rounded-lg hover:bg-neon-blue hover:text-black transition-colors">
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

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="glass-panel p-6 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Add Product</h2>
            <form onSubmit={submitProduct} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <input required type="text" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded p-2 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Price</label>
                  <input required type="number" step="0.01" value={productForm.price} onChange={e => setProductForm({...productForm, price: parseFloat(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded p-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Stock</label>
                  <input required type="number" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: parseInt(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded p-2 text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Category</label>
                <select value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded p-2 text-white [&>option]:bg-[#05050a]">
                  <option value="items">Items</option>
                  <option value="currency">Currency</option>
                  <option value="accounts">Accounts</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Game (e.g., MM2)</label>
                <input type="text" value={productForm.game} onChange={e => setProductForm({...productForm, game: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded p-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Rarity</label>
                <input type="text" value={productForm.rarity} onChange={e => setProductForm({...productForm, rarity: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded p-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Image URL or Upload</label>
                <input type="text" placeholder="https://..." value={productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded p-2 text-white mb-2" />
                <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'image', true)} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-neon-blue/20 file:text-neon-blue hover:file:bg-neon-blue/30" />
                {productForm.image && <img src={productForm.image} alt="Preview" className="mt-2 h-20 rounded object-cover" />}
              </div>
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setShowProductModal(false)} className="flex-1 py-2 bg-white/10 rounded hover:bg-white/20">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-neon-blue text-black font-bold rounded hover:bg-neon-blue/80">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="glass-panel p-6 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Add Payment Method</h2>
            <form onSubmit={submitPaymentMethod} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name (e.g., Bitcoin)</label>
                <input required type="text" value={paymentForm.name} onChange={e => setPaymentForm({...paymentForm, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded p-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Symbol (e.g., BTC)</label>
                <input type="text" value={paymentForm.symbol} onChange={e => setPaymentForm({...paymentForm, symbol: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded p-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Wallet Address</label>
                <input required type="text" value={paymentForm.address} onChange={e => setPaymentForm({...paymentForm, address: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded p-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">QR Code URL or Upload</label>
                <input type="text" placeholder="https://..." value={paymentForm.qrCodeUrl} onChange={e => setPaymentForm({...paymentForm, qrCodeUrl: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded p-2 text-white mb-2" />
                <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'qrCodeUrl', false)} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-neon-blue/20 file:text-neon-blue hover:file:bg-neon-blue/30" />
                {paymentForm.qrCodeUrl && <img src={paymentForm.qrCodeUrl} alt="QR Preview" className="mt-2 h-20 rounded object-cover" />}
              </div>
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setShowPaymentModal(false)} className="flex-1 py-2 bg-white/10 rounded hover:bg-white/20">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-neon-blue text-black font-bold rounded hover:bg-neon-blue/80">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
