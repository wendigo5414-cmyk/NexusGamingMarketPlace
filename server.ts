import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = parseInt(process.env.PORT || '3000', 10);
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nexus';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Schemas ---
const ProductSchema = new mongoose.Schema({
  name: String,
  game: String,
  price: Number,
  image: String,
  rarity: String,
  category: String,
  stock: Number,
  amount: String,
  bonus: String,
  popular: Boolean,
  desc: String,
  title: String
}, { timestamps: true });
const Product = mongoose.model('Product', ProductSchema);

const PaymentMethodSchema = new mongoose.Schema({
  name: String,
  symbol: String,
  address: String,
  qrCodeUrl: String,
  color: String
}, { timestamps: true });
const PaymentMethod = mongoose.model('PaymentMethod', PaymentMethodSchema);

const ConfigSchema = new mongoose.Schema({
  requireRobloxUsername: Boolean,
  requireDisplayName: Boolean,
  requireRealName: Boolean,
  requireMobile: Boolean,
  requireEmail: Boolean
});
const Config = mongoose.model('Config', ConfigSchema);

const OrderSchema = new mongoose.Schema({
  items: Array,
  totalAmount: Number,
  exactAmount: Number,
  paymentMethodId: String,
  customerInfo: Object,
  status: String
}, { timestamps: true });
const Order = mongoose.model('Order', OrderSchema);

// --- Auth Middleware ---
const auth = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// --- API Routes ---
app.post('/api/admin/login', (req, res) => {
  if (req.body.password === ADMIN_PASSWORD) {
    const token = jwt.sign({ admin: true }, JWT_SECRET);
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

app.get('/api/products', async (req, res) => res.json(await Product.find()));
app.post('/api/products', auth, async (req, res) => res.json(await Product.create(req.body)));
app.delete('/api/products/:id', auth, async (req, res) => res.json(await Product.findByIdAndDelete(req.params.id)));

app.get('/api/payment-methods', async (req, res) => res.json(await PaymentMethod.find()));
app.post('/api/payment-methods', auth, async (req, res) => res.json(await PaymentMethod.create(req.body)));
app.delete('/api/payment-methods/:id', auth, async (req, res) => res.json(await PaymentMethod.findByIdAndDelete(req.params.id)));

app.get('/api/config', async (req, res) => {
  let config = await Config.findOne();
  if (!config) {
    config = await Config.create({ 
      requireRobloxUsername: true, 
      requireDisplayName: false, 
      requireRealName: false, 
      requireMobile: false, 
      requireEmail: true 
    });
  }
  res.json(config);
});
app.put('/api/config', auth, async (req, res) => {
  let config = await Config.findOne();
  if (config) {
    Object.assign(config, req.body);
    await config.save();
  } else {
    config = await Config.create(req.body);
  }
  res.json(config);
});

app.get('/api/orders', auth, async (req, res) => res.json(await Order.find().sort({ createdAt: -1 })));
app.post('/api/orders', async (req, res) => res.json(await Order.create(req.body)));
app.put('/api/orders/:id/status', auth, async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(order);
});

// --- Vite Integration ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
