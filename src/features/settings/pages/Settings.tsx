import { useState } from "react";
import { http } from "@/lib/http";
import { Lock, Save } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useSnackbar } from "@/components/ui/SnackbarProvider";

export default function Settings() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      showSnackbar({
        title: "Validation Error",
        message: "Password must be at least 6 characters long",
        variant: "error",
      });
      return;
    }

    if (password !== confirmPassword) {
      showSnackbar({
        title: "Validation Error",
        message: "Passwords do not match",
        variant: "error",
      });
      return;
    }

    setLoading(true);
    try {
      await http.post("/users/change-password", { password });
      showSnackbar({
        title: "Success",
        message: "Password updated successfully",
        variant: "success",
      });
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      showSnackbar({
        title: "Error",
        message: err.response?.data?.error || "Failed to update password",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full p-6 max-w-3xl mx-auto w-full text-foreground">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account security preferences</p>
      </div>

      {/* Content Area */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Lock size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Change Password</h2>
              <p className="text-sm text-muted-foreground">Ensure your account is using a long, random password to stay secure.</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="max-w-md space-y-4">
            <div className="space-y-2">
              <label htmlFor="new-password" className="block text-sm font-medium text-foreground">
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Enter new password"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm-password" className="block text-sm font-medium text-foreground">
                Confirm New Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Confirm new password"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? <LoadingSpinner size="sm" className="text-primary-foreground" /> : <Save size={16} />}
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
