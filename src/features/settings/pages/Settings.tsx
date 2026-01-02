import { useState } from "react";
import { http } from "@/lib/http";
import { Lock, Save, Eye, EyeOff } from "lucide-react";
import { useSnackbar } from "@/components/ui/SnackbarProvider";
import { Button, Card, CardBody, CardHeader, Input, Spacer } from "@heroui/react";
import KPICards from "@/components/hero-ui/statsKPI/KPICards";

export default function Settings() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
        <p className="text-default-500 text-sm mt-1">Manage your account security preferences</p>
      </div>

      {/* Content Area */}
      <Card className="border border-default-200 dark:border-default-100 bg-background/60 dark:bg-default-50/50 backdrop-blur-md shadow-sm">
        <CardHeader className="flex gap-3 px-6 py-4 border-b border-default-200 dark:border-default-100 bg-default-100/50 dark:bg-default-50/20">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Lock size={20} />
          </div>
          <div className="flex flex-col">
            <p className="text-md font-semibold text-foreground">Change Password</p>
            <p className="text-small text-default-500">Ensure your account is using a long, random password to stay secure.</p>
          </div>
        </CardHeader>

        <CardBody className="px-6 py-8">
          <form onSubmit={handleSubmit} className="max-w-md space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-default-700 dark:text-default-300">
                New Password <span className="text-danger">*</span>
              </label>
              <Input
                placeholder="Enter new password"
                type={showPassword ? "text" : "password"}
                variant="bordered"
                color="primary"
                value={password}
                onValueChange={setPassword}
                isRequired
                startContent={
                  <Lock className="text-default-400 pointer-events-none flex-shrink-0" size={16} />
                }
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="text-default-400 pointer-events-none" size={18} />
                    ) : (
                      <Eye className="text-default-400 pointer-events-none" size={18} />
                    )}
                  </button>
                }
                classNames={{
                  inputWrapper: "bg-default-100/50 dark:bg-default-50/50 group-data-[focus=true]:bg-default-100/80 dark:group-data-[focus=true]:bg-default-50/80",
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-default-700 dark:text-default-300">
                Confirm New Password <span className="text-danger">*</span>
              </label>
              <Input
                placeholder="Confirm new password"
                type={showConfirmPassword ? "text" : "password"}
                variant="bordered"
                color="primary"
                value={confirmPassword}
                onValueChange={setConfirmPassword}
                isRequired
                startContent={
                  <Lock className="text-default-400 pointer-events-none flex-shrink-0" size={16} />
                }
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="text-default-400 pointer-events-none" size={18} />
                    ) : (
                      <Eye className="text-default-400 pointer-events-none" size={18} />
                    )}
                  </button>
                }
                classNames={{
                  inputWrapper: "bg-default-100/50 dark:bg-default-50/50 group-data-[focus=true]:bg-default-100/80 dark:group-data-[focus=true]:bg-default-50/80",
                }}
              />
            </div>

            <Spacer y={2} />

            <div className="flex justify-start">
              <Button
                type="submit"
                color="primary"
                isLoading={loading}
                startContent={!loading && <Save size={18} />}
                className="font-medium"
              >
                Update Password
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

    </div>
  );
}
