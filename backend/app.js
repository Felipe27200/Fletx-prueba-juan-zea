const express = require('express')
const app = express()
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');

require('dotenv').config();

app.use(express.json());
//middleware for cookies
app.use(cookieParser());

const authRoutes = require('./route/AuthRoute')

// ROUTES
app.use("/api/auth", authRoutes);

app.use(verifyJWT);

app.get('/ok', (req, res) => {
  res.json('Hello World!')
})

// Error Handler
app.use((err, req, res, next) => {
  if (err) 
  { 
   
    res.status(400)
      .json({ 
        error: err,
        message: err.message
      });
  }
  else
  {
    next();
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
