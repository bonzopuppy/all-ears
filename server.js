const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import and use API routes
const authRoutes = require('./api/auth/callback');
const loginRoutes = require('./api/auth/login');
const refreshRoutes = require('./api/auth/refresh');

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', loginRoutes);
app.use('/api/auth', refreshRoutes);

// In development, proxy React app requests to the dev server
if (process.env.NODE_ENV !== 'production') {
  app.use('/', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    ws: true, // Enable WebSocket proxying for hot reload
    logLevel: 'debug'
  }));
} else {
  // Serve static files from the React app build directory in production
  app.use(express.static(path.join(__dirname, 'build')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
  console.log(`API routes available at http://127.0.0.1:${PORT}/api/auth/`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Proxying React app from http://localhost:3001`);
  }
});
