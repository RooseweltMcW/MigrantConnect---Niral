const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const workerRoutes = require('./routes/worker');
const employerRoutes = require('./routes/employer');
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB error:', err));

// app.use('/api/auth', require('./routes/auth'));
// app.use('/api', require('./routes/auth')); 
// app.use('/',()=>{console.log("Hello World!")});

app.use('/api/worker', workerRoutes);
app.use('/api/employer', employerRoutes);

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));


