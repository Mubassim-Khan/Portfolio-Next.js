"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  // Fetch user data
  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setPreview(data?.profilePhoto || "/default-avatar.png");
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
        setUser((prev: any) => ({ ...prev, profilePhoto: data.url }));
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch (err) {
      toast.error("Upload error");
    }
  };

  if (loading)
    return <Skeleton className="w-full h-[300px] rounded-lg my-6" />;

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
                <Button onClick={uploadImage} className="mt-2">
                  Upload
                </Button>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="grid gap-4">
            <Input value={user?.name || ""} readOnly placeholder="Name" />
            <Input value={user?.email || ""} readOnly placeholder="Email" />
            <Input value={user?.contact || ""} readOnly placeholder="Contact" />
            <Input value={user?.github || ""} readOnly placeholder="GitHub" />
            <Input value={user?.twitter || ""} readOnly placeholder="Twitter" />
            <Input value={user?.linkedin || ""} readOnly placeholder="LinkedIn" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
