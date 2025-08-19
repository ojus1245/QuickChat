// backend/index.js
const express = require("express");
const cors = require("cors");
const { cloudinary } = require("./cloudinary");

const app = express();
app.use(cors());
app.use(express.json());

// Route for generating signature for signed upload
app.post("/get-signature", (req, res) => {
  const { public_id, folder } = req.body;
  const timestamp = Math.round(Date.now() / 1000);

  // MUST match exactly what will be sent in FormData
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
