require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const chalk = require('chalk');
const flash = require('connect-flash');
const mongooseConnect = require('./config/database');
const User = require('./models/user');
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
store.on('error', (error) =>
  console.error(chalk.redBright(`Error in store: ${error}`))
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 60 * 24, sameSite: 'lax' },
    resave: false,
    saveUninitialized: false,
    store,
  })
);

const csrfProtection = csrf({ cookie: true });

// ✅ CORS Setup (for frontend communication)
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'CSRF-TOKEN'],
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) return next();
  if (!req.user) {
    User.findById(req.session.user._id)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((e) => console.error(chalk.redBright(`Error in user save: ${e}`)));
  } else {
    next();
  }
});

app.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use((req, res, next) => {
  //get it on all pages - every rendered view
  res.locals.isAuthenticated = req.session.isAuthenticated || false;
  res.locals.csrfToken = req.csrfToken ? req.csrfToken() : null;
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
app.get('*', (req, res) =>
  res.sendFile(path.join(clientBuildPath, 'index.html'))
);

// ✅ Connect to Database and Start Server
mongooseConnect(() => {
  console.info(chalk.blueBright(`🔋 Connected to Mongoose 🔋`));
  app.listen(PORT, () => {
    console.info(
      chalk.cyanBright(`📡 Server running on http://localhost:${PORT} 📡`)
    );
  });
}).catch((e) =>
  console.error(chalk.redBright(`Error in connecting to the server: ${e}`))
);
