"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import {
  Copy,
  Check,
  Github,
  Linkedin,
  Instagram,
  Globe,
  Loader,
} from "lucide-react";

type User = {
  name?: string;
  email?: string;
  contact?: string;
  profilePhoto?: string;
  github?: string;
  linkedin?: string;
  instagram?: string;
  portfolio?: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Fetch user data
  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setPreview(data?.profilePhoto);
        setLoading(false);
      });
  }, []);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File too large! Max 2MB.");
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // Upload to Cloudinary
  const uploadImage = async () => {
    if (!image) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", image);

    try {
      const res = await fetch("/api/user/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Profile photo updated!");
        setUser((prev: User | null) =>
          prev ? { ...prev, profilePhoto: data.url } : null
        );
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch {
      toast.error("Upload error");
    } finally {
      setUploading(false);
      setImage(null);
    }
  };

  const handleCopy = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    toast.success("Copied!");
    setTimeout(() => setCopiedField(null), 2000); // reset after 2s
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center space-y-4 my-6">
        {/* Image placeholder */}
        <Skeleton className="w-[250px] h-[180px] rounded-xl shadow-md" />

        {/* Title placeholder */}
        <Skeleton className="w-[180px] h-6 rounded-md" />

        {/* Subtitle/text placeholder */}
        <Skeleton className="w-[140px] h-4 rounded-md" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar + Upload */}
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24">
              <Image
                src={preview}
                alt="Profile"
                fill
                className="rounded-full border object-cover"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="avatar">Change Profile Photo</Label>
              <Input
                type="file"
                id="avatar"
                accept="image/*"
                onChange={handleImageChange}
              />
              {image && (
                <Button
                  onClick={uploadImage}
                  className="mt-2 flex items-center gap-2"
                  disabled={uploading} // ✅ disable during upload
                >
                  {uploading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload"
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="grid gap-4">
            <Input value={user?.name || ""} readOnly placeholder="Name" />
            <Input value={user?.email || ""} readOnly placeholder="Email" />
            <Input value={user?.contact || ""} readOnly placeholder="Contact" />

            {/* GitHub */}
            <div className="flex items-center gap-2">
              <Github className="w-5 h-5 text-gray-600" />
              <Input value={user?.github || ""} readOnly placeholder="GitHub" />
              {user?.github && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopy(user.github!, "github")}
                >
                  {copiedField === "github" ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              )}
            </div>

            {/* LinkedIn */}
            <div className="flex items-center gap-2">
              <Linkedin className="w-5 h-5 text-blue-700" />
              <Input
                value={user?.linkedin || ""}
                readOnly
                placeholder="LinkedIn"
              />
              {user?.linkedin && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopy(user.linkedin!, "linkedin")}
                >
                  {copiedField === "linkedin" ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              )}
            </div>

            {/* Instagram */}
            <div className="flex items-center gap-2">
              <Instagram className="w-5 h-5 text-pink-500" />
              <Input
                value={user?.instagram || ""}
                readOnly
                placeholder="instagram"
              />
              {user?.instagram && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopy(user.instagram!, "instagram")}
                >
                  {copiedField === "instagram" ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              )}
            </div>

            {/* Portfolio */}
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-100" />
              <Input
                value={user?.portfolio || ""}
                readOnly
                placeholder="portfolio"
              />
              {user?.portfolio && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopy(user.portfolio!, "portfolio")}
                >
                  {copiedField === "portfolio" ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
