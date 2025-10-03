const express = require('express')
const app = express()
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const cors = require('cors');

require('dotenv').config();

app.use(express.json());
//middleware for cookies
app.use(cookieParser());

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

const authRoutes = require('./route/AuthRoute')
const productRoutes = require('./route/ProductRoute')

// ROUTES
app.use("/api/auth", authRoutes);

app.use(verifyJWT);

app.use('/api/products', productRoutes);

app.get('/ok', (req, res) => {
  res.json('Hello World!')
})

// Error Handler
app.use((err, req, res, next) => {
  if (err) {
    res.status(400)
      .json({
        error: err,
        message: err.message
      });
  }
  else {
    next();
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
