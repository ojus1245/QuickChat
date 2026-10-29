
import React from "react";
import "./ProfileUpdate.css";
import assets from "../../assets/assets";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProfileUpdate = () => {
  const [image, setImage] = React.useState(null);
  const [uploadedUrl, setUploadedUrl] = React.useState("");
  const [existingImageUrl, setExistingImageUrl] = React.useState(""); //  Previous image
  const [name, setName] = React.useState("");
  const [bio, setBio] = React.useState("");

  const navigate = useNavigate();

  //  Fetch user profile data on mount
  React.useEffect(() => {
    const fetchProfile = async () => {
      const auth = getAuth();
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      try {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setExistingImageUrl(data.profileImage || "");
          setName(data.username || "");
          setBio(data.bio || "");
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };

    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSave = async () => {
    const auth = getAuth();
    const uid = auth.currentUser?.uid;

    if (!uid) {
      toast.error("User not authenticated!");
      return;
    }

    let imageUrl = uploadedUrl || existingImageUrl;

    if (image) {
      try {
        //  Get signature from backend
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        const sigRes = await fetch(`${backendUrl}/get-signature`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ public_id: `profiles/${uid}`,folder:"profiles" }),
        });

        const { timestamp, signature, apiKey, cloudName } = await sigRes.json();

        const formData = new FormData();
        formData.append("file", image);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);
        formData.append("public_id", `profiles/${uid}`);
        formData.append("folder", "profiles");
        formData.append("overwrite", "true");

        const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: formData,
        });

        const result = await cloudRes.json();
        imageUrl = result.secure_url;
        setUploadedUrl(imageUrl);
      } catch (err) {
        console.error("Image upload failed:", err);
        toast.error("Image upload failed. Please try again.");
        return;
      }
    }
    
    // Fallback to default avatar if nothing available
    if (!imageUrl) {
      imageUrl = "https://res.cloudinary.com/dpuxwdbpt/image/upload/v1753800525/avatar_icon_taiau6.png";
    }

    //  Update Firestore
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        username: name.toLowerCase(),
        bio: bio,
        profileImage: imageUrl,
      });

      toast.success("Profile updated successfully!");
      navigate("/Chat");
    } catch (err) {
      console.error("Profile update failed:", err);
      toast.error("Failed to update profile.");
    }
  };

  //  Image logic: selected > existing > default
  const displayImage = image
    ? URL.createObjectURL(image)
    : existingImageUrl || assets.avatar_icon;

  return (
    <div className="Profile">
      <div className="Profile-container">
        <div className="profile-form">
          <h2>Profile Details</h2>

          <input
            onChange={handleImageChange}
            type="file"
            name="img-upload"
            accept="image/jpeg,image/png"
            hidden
            id="img-upload"
          />

          <label htmlFor="img-upload">
            <img src={displayImage} alt="Profile" className="avator-img" />
            <p>Upload Profile Image</p>
          </label>

          <div className="profile-details">
            <input
              type="text"
              placeholder="Your Name"
              className="name-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <textarea
              rows="5"
              cols="50"
              placeholder="Your Bio"
              className="bio-field"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            ></textarea>

            <button className="save-button" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>

        <div className="preview">
          <img src={displayImage} alt="Preview" className="preview-img" />
          <p>Preview</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdate;
