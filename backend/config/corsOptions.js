const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || process.env.CORS_ORIGIN.includes(origin)) 
        {
            callback(null, true)
        } 
        else 
            {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}

module.exports = corsOptions;