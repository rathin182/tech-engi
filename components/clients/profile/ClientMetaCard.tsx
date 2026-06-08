"use client";

import { Camera } from "lucide-react";
import React, { useRef, useState } from "react";

export default function ClientMetaCard({ user }: { user: any }) {
  if (!user) return null;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState(user?.image);

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(
        "/api/profileimage",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.success) {
        setImage(data.image);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to upload image");
    }
  };

  return (
    <div className="p-6 border border-[var(--border)] rounded-2xl bg-white flex flex-col md:flex-row items-center md:items-start gap-6 shadow-sm">
      <div className="relative shrink-0">
        <div className="w-24 h-24 rounded-full border-4 border-gray-50 bg-[var(--primary)] text-white flex items-center justify-center text-3xl font-bold overflow-hidden shadow-sm">
          {image ? (
            <img
              src={image}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            user.name?.charAt(0)?.toUpperCase() || "C"
          )}
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border shadow flex items-center justify-center hover:bg-gray-50"
        >
          <Camera size={14} />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
      </div>
      <div className="text-center md:text-left flex-1">
        <h4 className="text-2xl font-bold font-inter text-[var(--text-primary)]">{user.name}</h4>
        <p className="text-sm font-inter text-[var(--primary)] mt-1 font-semibold tracking-wide uppercase">
          Client
        </p>
        <p className="text-sm font-inter text-[var(--text-muted)] mt-3 max-w-2xl leading-relaxed">
          {user.bio || "No bio added yet. Edit your personal information to tell us about yourself!"}
        </p>
      </div>
    </div>
  );
}