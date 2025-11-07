import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

interface PreferencesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  onProfileUpdate: () => void;
}

export const PreferencesDialog = ({ open, onOpenChange, profile, onProfileUpdate }: PreferencesDialogProps) => {
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleUpdateProfile = async () => {
    if (!profile) return;
    
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", profile.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: error.message,
      });
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      onProfileUpdate();
    }
    
    setLoading(false);
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Password must be at least 6 characters",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error updating password",
        description: error.message,
      });
    } else {
      toast({
        title: "Success",
        description: "Password updated successfully",
      });
      setNewPassword("");
      setConfirmPassword("");
    }
    
    setLoading(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !profile) return;

    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${profile.id}-${Math.random()}.${fileExt}`;

    setLoading(true);

    // For now, we'll just show a placeholder message since storage isn't set up
    toast({
      title: "Image upload",
      description: "Image upload functionality will be available soon",
    });

    setLoading(false);
  };

  const getInitials = () => {
    if (!profile?.full_name) return "U";
    return profile.full_name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Preferences</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6 mt-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || "User"} />
                <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
              </Avatar>
              <div>
                <Input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                <Label htmlFor="avatar-upload">
                  <Button variant="outline" className="cursor-pointer" asChild>
                    <span>
                      <Upload className="mr-2 h-4 w-4" />
                      Change Picture
                    </span>
                  </Button>
                </Label>
              </div>
            </div>

            {/* Name Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input
                  id="full-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              <Button onClick={handleUpdateProfile} disabled={loading}>
                {loading ? "Updating..." : "Update Profile"}
              </Button>
            </div>

            {/* Password Section */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-semibold">Change Password</h3>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
              <Button onClick={handleUpdatePassword} disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
