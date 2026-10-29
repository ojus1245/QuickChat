const express = require("express");
const cors = require("cors");
const { cloudinary } = require("./cloudinary");

const app = express();

//  Configure CORS to allow frontend domains
const allowedOrigins = [
  "https://chatapp-gravitek.netlify.app",
  "https://chat-app-cd37a.web.app",
  "https://chat-app-cd37a.firebaseapp.com",
  "http://localhost:5173",
  "http://localhost:3000"
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true); // Alternatively allow all or callback(new Error("CORS blocked"))
  },
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

// Route for generating signature for signed upload
app.post("/get-signature", (req, res) => {
  const { public_id, folder } = req.body;
  const timestamp = Math.round(Date.now() / 1000);

  const paramsToSign = {
    folder,
    overwrite: "true",
    public_id,
    timestamp
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET
  );

  res.json({
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));