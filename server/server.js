require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { styleText } = require('util');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

// Import Config & Models
const mongooseConnect = require('./config/database');
const User = require('./models/user');

// Import Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3001;

//Initialize store on MongoDB
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions',
});

// Catch store related errors
store.on('error', function(error) {
  console.error(`Error in store: ${error}`);
});

// ✅ Middleware Setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 1000 * 60 * 60 * 24, sameSite: 'lax' },
  resave: false,
  saveUninitialized: false,
  store,
})); //setup sessions

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((e) => console.error(`Error in user save: ${e}`));
});

// ✅ CORS Setup (for frontend communication)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, // Allows cookies to be sent and received
}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// ✅ API Routes
app.use('/admin', adminRoutes);
app.use('/', shopRoutes);
app.use(authRoutes);

// ✅ Serve React Frontend
const clientBuildPath = path.resolve(__dirname, '../client/build');
app.use(express.static(clientBuildPath));

// Catch-all to serve React app for unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// ✅ Connect to Database and Start Server
mongooseConnect(() => {
  console.info(styleText('blueBright', `🔋 Connected to Mongoose 🔋`));
  app.listen(PORT, () => {
    console.log(styleText('cyanBright', `📡 Server running on http://localhost:${PORT} 📡`));
  });
}).catch(e => console.error(e));
