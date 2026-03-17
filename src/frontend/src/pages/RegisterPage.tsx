import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { BookOpen, GraduationCap, Loader2, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { UserRole } from "../backend";
import DarkModeToggle from "../components/DarkModeToggle";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useRegisterUser } from "../hooks/useQueries";

const SUBJECTS = [
  "Mathematics",
  "Science",
  "English",
  "History",
  "Programming",
  "Art",
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const [username, setUsername] = useState("");
  const [subject, setSubject] = useState("");
  const [role, setRole] = useState<UserRole | null>(null);
  const [bio, setBio] = useState("");

  const registerMutation = useRegisterUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) {
      toast.error("Please sign in first");
      login();
      return;
    }
    if (!username.trim() || !subject || !role) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await registerMutation.mutateAsync({
        username,
        subject,
        role,
        profileInfo: bio,
      });
      toast.success("Profile created successfully!");
      if (role === UserRole.teacher) {
        navigate({ to: "/dashboard/teacher" });
      } else {
        navigate({ to: "/dashboard/learner" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <DarkModeToggle />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="glass-card rounded-3xl p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl btn-gradient flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-display font-bold text-2xl text-gradient">
              Create Your Profile
            </h1>
            <p className="text-muted-foreground text-sm mt-1 font-body">
              Join the Aikya learning community
            </p>
          </div>

          {!identity && (
            <div className="glass rounded-xl p-4 mb-6 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                You need to sign in to create a profile
              </p>
              <Button
                className="btn-gradient"
                onClick={login}
                size="sm"
                data-ocid="register.login_button"
              >
                Sign in with Internet Identity
              </Button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="font-semibold text-sm">
                Username *
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a unique username"
                className="glass border-border/50"
                data-ocid="register.input"
              />
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label className="font-semibold text-sm">Subject *</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger
                  className="glass border-border/50"
                  data-ocid="register.select"
                >
                  <SelectValue placeholder="Select your subject" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Role selector */}
            <div className="space-y-2">
              <Label className="font-semibold text-sm">I want to... *</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole(UserRole.teacher)}
                  data-ocid="register.teacher_toggle"
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    role === UserRole.teacher
                      ? "border-violet-500 bg-violet-50 dark:bg-violet-950/40"
                      : "border-border glass hover:border-violet-300"
                  }`}
                >
                  <BookOpen
                    className={`w-6 h-6 mb-2 ${role === UserRole.teacher ? "text-violet-600" : "text-muted-foreground"}`}
                  />
                  <div
                    className={`font-semibold text-sm ${role === UserRole.teacher ? "text-violet-700 dark:text-violet-300" : "text-foreground"}`}
                  >
                    Teach
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Share knowledge with peers
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole(UserRole.learner)}
                  data-ocid="register.learner_toggle"
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    role === UserRole.learner
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40"
                      : "border-border glass hover:border-blue-300"
                  }`}
                >
                  <Users
                    className={`w-6 h-6 mb-2 ${role === UserRole.learner ? "text-blue-600" : "text-muted-foreground"}`}
                  />
                  <div
                    className={`font-semibold text-sm ${role === UserRole.learner ? "text-blue-700 dark:text-blue-300" : "text-foreground"}`}
                  >
                    Learn
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Join groups and grow
                  </div>
                </button>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio" className="font-semibold text-sm">
                Bio (optional)
              </Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself, your learning goals..."
                className="glass border-border/50 resize-none"
                rows={3}
                data-ocid="register.textarea"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="btn-gradient w-full py-5 font-semibold"
              disabled={registerMutation.isPending || !identity}
              data-ocid="register.submit_button"
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Creating
                  Profile...
                </>
              ) : (
                "Join Aikya"
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
