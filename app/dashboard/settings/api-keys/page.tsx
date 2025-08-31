"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Plus, Copy, Trash2, Loader } from "lucide-react";
import toast from "react-hot-toast";

interface ApiKey {
  id?: string; // undefined for new unsaved keys
  variable: string;
  secret: string;
  visible: boolean;
  saving?: boolean; // local transient state
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch keys from backend
  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const res = await fetch("/api/api-keys");
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setKeys(data.map((k: any) => ({ ...k, visible: false })));
      } catch (err) {
        toast.error("Failed to load API keys.");
      } finally {
        setLoading(false);
      }
    };
    fetchKeys();
  }, []);

  const toggleVisibility = (index: number) => {
    setKeys((prev) =>
      prev.map((k, i) => (i === index ? { ...k, visible: !k.visible } : k))
    );
  };

  // Add a blank row (not saved to DB yet)
  const addNewKey = () => {
    setKeys((prev) => [
      ...prev,
      { id: undefined, variable: "", secret: "", visible: false },
    ]);
  };

  // Local-only update by index (no network call)
  const updateKey = (
    index: number,
    field: "variable" | "secret",
    value: string
  ) => {
    setKeys((prev) =>
      prev.map((k, i) => (i === index ? { ...k, [field]: value } : k))
    );
  };

  // Save to DB when user presses Enter on inputs (POST for new, PUT for existing)
  const saveKey = async (index: number) => {
    const key = keys[index];
    if (!key) return;

    if (!key.variable || !key.secret) {
      toast.error("Variable and secret are required.");
      return;
    }

    // mark saving
    setKeys((prev) =>
      prev.map((k, i) => (i === index ? { ...k, saving: true } : k))
    );

    try {
      let res: Response;
      if (key.id) {
        // update existing
        res = await fetch(`/api/api-keys/${key.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ variable: key.variable, secret: key.secret }),
        });
      } else {
        // create new
        res = await fetch(`/api/api-keys`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ variable: key.variable, secret: key.secret }),
        });
      }

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || "Failed to save");
      }

      const saved = await res.json();

      // replace the row with saved record, preserve visible
      setKeys((prev) =>
        prev.map((k, i) => (i === index ? { ...saved, visible: k.visible } : k))
      );

      toast.success("Key saved.");
    } catch (e) {
      console.error(e);
      toast.error("Failed to save key.");
    } finally {
      // clear saving flag (in case saved branch didn't replace correctly)
      setKeys((prev) =>
        prev.map((k, i) => (i === index ? { ...k, saving: false } : k))
      );
    }
  };

  const copySecret = (secret: string) => {
    if (!secret) return;
    navigator.clipboard.writeText(secret);
    toast.success("Secret copied to clipboard.");
  };

  const deleteKey = async (index: number) => {
    const key = keys[index];
    if (!key) return;

    if (!key.id) {
      // Just remove locally if unsaved
      setKeys((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    try {
      const res = await fetch(`/api/api-keys/${key.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setKeys((prev) => prev.filter((_, i) => i !== index));
      toast.success("Key deleted.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete key.");
    }
  };

  return (
    <div className="space-y-4 pt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-2 sm:items-center">
        <h1 className="text-xl font-semibold">API Keys</h1>
      </div>

      {/* API Keys Card */}
      <Card>
        <CardHeader>
          <CardTitle>Manage your API Keys</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          <div className="grid grid-cols-2 gap-4 pb-3">
            <Label className="text-sm text-muted-foreground">Variable</Label>
            <Label className="text-sm text-muted-foreground">
              Key / Secret
            </Label>
          </div>

          {loading ? (
            <div className="flex justify-center items-center pt-4 mb-3">
              <Loader className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : keys.length === 0 ? (
            <p className="pt-4 text-sm text-muted-foreground mb-3 text-center">
              No API keys found.
            </p>
          ) : (
            <div className="space-y-4 pt-4 mb-3">
              {keys.map((key, index) => (
                <div
                  key={key.id ?? index}
                  className={`grid grid-cols-2 gap-4 items-center rounded-lg ${
                    key.id ? "" : "bg-muted/50 rounded-xl"
                  }`}
                >
                  {/* Variable Name */}
                  <Input
                    placeholder="MY_API_KEY"
                    value={key.variable}
                    onChange={(e) =>
                      updateKey(
                        index,
                        "variable",
                        e.target.value.replace(/\s+/g, "_")
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        saveKey(index);
                      }
                    }}
                  />

                  {/* Secret Key + Actions */}
                  <div className="flex items-center space-x-2">
                    <Input
                      type={key.visible ? "text" : "password"}
                      value={key.secret}
                      placeholder="sk-..."
                      onChange={(e) =>
                        updateKey(index, "secret", e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          saveKey(index);
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => toggleVisibility(index)}
                    >
                      {key.visible ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>

                    {key.saving ? (
                      <div className="flex items-center justify-center w-9 h-9">
                        <Loader className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copySecret(key.secret)}
                          disabled={!key.secret}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          className="text-red-600"
                          size="icon"
                          onClick={() => deleteKey(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add another */}
          <div className="pt-4">
            <Button className="flex items-center" onClick={addNewKey}>
              <Plus className="w-4 h-4" />
              <span>Add another</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
