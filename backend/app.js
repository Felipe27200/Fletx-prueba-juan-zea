const express = require('express')
const app = express()
require('dotenv').config();

app.use(express.json());

const authRoutes = require('./route/AuthRoute')

// ROUTES
app.use("/api/auth", authRoutes)

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
