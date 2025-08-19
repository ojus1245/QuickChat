// // src/utils/uploadImageToCloudinary.js
// export const uploadImageToCloudinary = async (file, folder) => {
//   try {
//     // Create a unique public_id with folder
//     const publicId = `${folder}/${Date.now()}`;

//     // Request signature from backend
//     const sigRes = await fetch("http://localhost:5000/get-signature", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ public_id: publicId,folder }),
      
//     });

//     if (!sigRes.ok) throw new Error("Failed to get signature from backend");

//     const { timestamp, signature, apiKey, cloudName } = await sigRes.json();

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("api_key", apiKey);
//     formData.append("timestamp", timestamp);
//     formData.append("signature", signature);
//     formData.append("public_id", publicId);
//     formData.append("overwrite", "true");
//     formData.append("folder", folder);

//     const cloudRes = await fetch(
//       `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
//       {
//         method: "POST",
//         body: formData,
//       }
//     );

//     if (!cloudRes.ok) {
//       const errData = await cloudRes.text();
//       throw new Error(`Cloudinary upload failed: ${errData}`);
//     }

//     const result = await cloudRes.json();
//     return result.secure_url;
//   } catch (err) {
//     console.error("❌ Cloudinary upload failed:", err);
//     return null;
//   }
// };

