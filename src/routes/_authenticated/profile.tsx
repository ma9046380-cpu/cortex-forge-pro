import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/lib/auth-store";
import { profile } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profile — Nexus AI" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuthStore();
  const update = useServerFn(profile.update);
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name, bio, avatar_url").eq("id", user.id).maybeSingle().then(({ data }) => {
      setFullName(data?.full_name ?? "");
      setBio(data?.bio ?? "");
      setAvatar(data?.avatar_url ?? "");
    });
  }, [user]);

  const onSave = async () => {
    setSaving(true);
    try {
      await update({ data: { full_name: fullName, bio, avatar_url: avatar } });
      toast.success("Profile saved");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const initials = (fullName || user?.email || "U").slice(0, 2).toUpperCase();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage how others see you on Nexus AI.</p>

      <div className="mt-8 grid max-w-3xl gap-6">
        <div className="glass flex items-center gap-4 rounded-2xl p-6">
          {avatar ? (
            <img src={avatar} alt="" className="size-16 rounded-full object-cover" />
          ) : (
            <div className="grid size-16 place-items-center rounded-full gradient-primary text-xl font-semibold text-primary-foreground glow">
              {initials}
            </div>
          )}
          <div className="flex-1">
            <div className="font-semibold">{fullName || "Unnamed"}</div>
            <div className="text-sm text-muted-foreground">{user?.email}</div>
          </div>
        </div>

        <div className="glass space-y-4 rounded-2xl p-6">
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1.5 bg-background/50" />
          </div>
          <div>
            <Label htmlFor="avatar">Avatar URL</Label>
            <Input id="avatar" value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://..." className="mt-1.5 bg-background/50" />
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="mt-1.5 bg-background/50" />
          </div>
          <Button onClick={onSave} disabled={saving} className="gradient-primary text-primary-foreground glow">
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
