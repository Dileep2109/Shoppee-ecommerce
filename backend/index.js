const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: ["https://deploy-mern-1whq.vercel.app"],
  methods: ["POST", "GET"],
  credentials: true
}));

// MongoDB Connection
mongoose.connect("mongodb+srv://<username>:<password>@cluster0.zttmw3g.mongodb.net/e-commerce", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// Image Storage Engine 
const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage: storage });
app.post("/upload", upload.single('product'), (req, res) => {
  res.json({
    success: true,
    image_url: `/images/${req.file.filename}`
  });
});

// Serve static files from the 'upload/images' directory
app.use('/images', express.static('upload/images'));

// Middleware to fetch user from token
const fetchuser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send({ error: "Please authenticate using a valid token" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_ecom');
    req.user = decoded.user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).send({ error: "Invalid Token" });
  }
};

// User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  cartData: { type: Object },
  date: { type: Date, default: Date.now }
});
const User = mongoose.model("User", UserSchema);

// Product Schema
const ProductSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number },
  old_price: { type: Number },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true }
});
const Product = mongoose.model("Product", ProductSchema);

// Routes
app.get("/", (req, res) => {
  res.send("Root");
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    if (password !== user.password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET || 'secret_ecom');
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
});

app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }
    let cartData = {};
    for (let i = 0; i < 300; i++) {
      cartData[i] = 0;
    }
    user = new User({
      name,
      email,
      password,
      cartData
    });
    await user.save();
    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET || 'secret_ecom');
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
});

app.get("/allproducts", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
});

app.post("/addtocart", fetchuser, async (req, res) => {
  try {
    const { itemId } = req.body;
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.cartData[itemId] = (user.cartData[itemId] || 0) + 1;
    await user.save();
    res.send("Added to cart");
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
});

// Other endpoints like '/removefromcart', '/getcart', '/addproduct', '/removeproduct' are similar in structure

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
