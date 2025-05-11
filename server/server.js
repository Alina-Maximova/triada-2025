const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const serviceRoutes = require('./routes/services');
const orderRoutes = require('./routes/orders');
const photoRoutes = require('./routes/photo');
const localityRoutes = require('./routes/locality');

const authMiddleware = require('./middlewares/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/services', serviceRoutes);
app.use('/locality', localityRoutes);
app.use('/orders', authMiddleware, orderRoutes);
app.use('/photos', photoRoutes); 

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
