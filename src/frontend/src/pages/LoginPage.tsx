import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { GraduationCap, Loader2, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { UserRole } from "../backend";
import DarkModeToggle from "../components/DarkModeToggle";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useMyUser } from "../hooks/useQueries";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, identity, isLoggingIn, isLoginSuccess, isInitializing } =
    useInternetIdentity();
  const { data: myUser, isLoading: isLoadingUser } = useMyUser();

  useEffect(() => {
    if (!identity) return;
    if (isLoadingUser) return;
    if (myUser === null) {
      navigate({ to: "/register" });
    } else if (myUser) {
      if (myUser.role === UserRole.teacher) {
        navigate({ to: "/dashboard/teacher" });
      } else {
        navigate({ to: "/dashboard/learner" });
      }
    }
  }, [identity, myUser, isLoadingUser, navigate]);

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <DarkModeToggle />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-card rounded-3xl p-10 text-center">
          {/* Logo */}
          <div className="w-16 h-16 rounded-2xl btn-gradient flex items-center justify-center mx-auto mb-6 animate-float">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>

          <h1 className="font-display font-bold text-3xl text-gradient mb-2">
            Welcome to Aikya
          </h1>
          <p className="text-muted-foreground font-body mb-8">
            Learn Together, Grow Together
          </p>

          <div className="glass rounded-2xl p-5 mb-8 text-left">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-violet-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm text-foreground mb-1">
                  Secure Authentication
                </p>
                <p className="text-xs text-muted-foreground font-body">
                  Sign in with Internet Identity — a secure, privacy-preserving
                  authentication system on the Internet Computer. No passwords,
                  no emails required.
                </p>
              </div>
            </div>
          </div>

          <Button
            size="lg"
            className="btn-gradient w-full py-6 text-base font-semibold"
            onClick={login}
            disabled={
              isLoggingIn || isInitializing || (!!identity && isLoadingUser)
            }
            data-ocid="login.primary_button"
          >
            {isLoggingIn || (isLoginSuccess && isLoadingUser) ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Connecting...
              </>
            ) : (
              "Sign in with Internet Identity"
            )}
          </Button>

          <p className="mt-6 text-sm text-muted-foreground font-body">
            New to Aikya?{" "}
            <Link
              to="/register"
              className="text-primary hover:underline font-semibold"
            >
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
