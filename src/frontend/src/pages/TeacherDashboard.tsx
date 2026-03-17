import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  BookOpen,
  Calendar,
  GraduationCap,
  Link2,
  Loader2,
  LogOut,
  Plus,
  Star,
  Users,
  Video,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AIChatbot from "../components/AIChatbot";
import ChatPanel from "../components/ChatPanel";
import DarkModeToggle from "../components/DarkModeToggle";
import NotesPanel from "../components/NotesPanel";
import NotificationsDrawer from "../components/NotificationsDrawer";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateSession,
  useMyGroup,
  useMyGroupSessions,
  useMyUser,
  useNotifications,
  useTeacherReviews,
} from "../hooks/useQueries";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { identity, clear } = useInternetIdentity();
  const { data: myUser, isLoading: loadingUser } = useMyUser();
  const { data: myGroup, isLoading: loadingGroup } = useMyGroup();
  const { data: sessions = [], isLoading: loadingSessions } =
    useMyGroupSessions();
  const teacherPrincipal = identity?.getPrincipal().toString();
  const { data: reviews = [] } = useTeacherReviews(teacherPrincipal);
  const { data: notifications = [] } = useNotifications();
  const createSessionMutation = useCreateSession();

  const [notifOpen, setNotifOpen] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    topic: "",
    scheduledTime: "",
    googleMeetLink: "",
  });

  useEffect(() => {
    if (!identity && !loadingUser) navigate({ to: "/login" });
  }, [identity, loadingUser, navigate]);

  const avgRating = reviews.length
    ? (
        reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length
      ).toFixed(1)
    : "—";

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myGroup) {
      toast.error("No group assigned yet");
      return;
    }
    if (!sessionForm.topic || !sessionForm.scheduledTime) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await createSessionMutation.mutateAsync({
        groupId: myGroup.id,
        topic: sessionForm.topic,
        scheduledTime: sessionForm.scheduledTime,
        googleMeetLink: sessionForm.googleMeetLink,
      });
      toast.success("Session created!");
      setSessionForm({ topic: "", scheduledTime: "", googleMeetLink: "" });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create session",
      );
    }
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-white/20 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg btn-gradient flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-gradient">
              Aikya
            </span>
            <Badge variant="secondary" className="ml-2 text-xs">
              Teacher
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <DarkModeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setNotifOpen(true)}
              data-ocid="teacher.notifications_button"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-violet-500" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                clear();
                navigate({ to: "/" });
              }}
              data-ocid="teacher.logout_button"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display font-bold text-3xl text-foreground">
            Welcome back,{" "}
            <span className="text-gradient">
              {myUser?.username || "Teacher"}
            </span>{" "}
            👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Subject:{" "}
            <span className="font-medium text-foreground">
              {myUser?.subject}
            </span>
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Sessions",
              value: sessions.length,
              icon: Calendar,
              color: "text-violet-600",
            },
            {
              label: "Avg Rating",
              value: avgRating,
              icon: Star,
              color: "text-amber-500",
            },
            {
              label: "Learners",
              value: myGroup ? myGroup.learners.length : 0,
              icon: Users,
              color: "text-blue-500",
            },
            {
              label: "Reviews",
              value: reviews.length,
              icon: BarChart3,
              color: "text-emerald-500",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="font-display font-bold text-2xl text-foreground">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Group */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-violet-500" /> My Group
              </h2>
              {loadingGroup ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 rounded-xl" />
                  ))}
                </div>
              ) : !myGroup ? (
                <div
                  className="text-center py-8"
                  data-ocid="teacher.group.empty_state"
                >
                  <Users className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">
                    Waiting for group assignment...
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    You'll be notified when your group is ready.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div
                    className="glass rounded-xl p-3 flex items-center gap-3"
                    data-ocid="teacher.group.item.1"
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="btn-gradient text-white text-sm">
                        ME
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-sm">
                        {myUser?.username}
                      </div>
                      <Badge className="text-xs bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300">
                        Teacher
                      </Badge>
                    </div>
                  </div>
                  {myGroup.learners.map((learner, i) => (
                    <div
                      key={learner.toString()}
                      className="glass rounded-xl p-3 flex items-center gap-3"
                      data-ocid={`teacher.group.item.${i + 2}`}
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm">
                          {String.fromCharCode(65 + i)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-sm truncate max-w-[120px]">
                          {learner.toString().slice(0, 12)}...
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          Learner
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Create Session */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-violet-500" /> Create Session
              </h2>
              <form onSubmit={handleCreateSession} className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-1 block">
                    Topic *
                  </Label>
                  <Input
                    value={sessionForm.topic}
                    onChange={(e) =>
                      setSessionForm((p) => ({ ...p, topic: e.target.value }))
                    }
                    placeholder="e.g. Introduction to Quadratic Equations"
                    className="glass border-border/50"
                    data-ocid="teacher.session.input"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium mb-1 block">
                    Scheduled Time *
                  </Label>
                  <Input
                    type="datetime-local"
                    value={sessionForm.scheduledTime}
                    onChange={(e) =>
                      setSessionForm((p) => ({
                        ...p,
                        scheduledTime: e.target.value,
                      }))
                    }
                    className="glass border-border/50"
                    data-ocid="teacher.session.time_input"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium mb-1 block">
                    Google Meet Link
                  </Label>
                  <Input
                    value={sessionForm.googleMeetLink}
                    onChange={(e) =>
                      setSessionForm((p) => ({
                        ...p,
                        googleMeetLink: e.target.value,
                      }))
                    }
                    placeholder="https://meet.google.com/xxx-xxxx-xxx"
                    className="glass border-border/50"
                    data-ocid="teacher.session.meet_input"
                  />
                </div>
                <Button
                  type="submit"
                  className="btn-gradient w-full"
                  disabled={createSessionMutation.isPending}
                  data-ocid="teacher.session.submit_button"
                >
                  {createSessionMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />{" "}
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 w-4 h-4" /> Create Session
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Sessions List */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-violet-500" /> My Sessions
              </h2>
              {loadingSessions ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-20 rounded-xl" />
                  ))}
                </div>
              ) : sessions.length === 0 ? (
                <div
                  className="text-center py-6"
                  data-ocid="teacher.sessions.empty_state"
                >
                  <Calendar className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">
                    No sessions yet. Create your first one!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sessions.map((session, i) => (
                    <div
                      key={session.id.toString()}
                      className="glass rounded-xl p-4"
                      data-ocid={`teacher.sessions.item.${i + 1}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm">
                            {session.topic}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {session.scheduledTime}
                          </div>
                        </div>
                        {session.googleMeetLink && (
                          <a
                            href={session.googleMeetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button size="sm" className="btn-gradient text-xs">
                              <Video className="mr-1 w-3 h-3" /> Join
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reviews */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" /> My Reviews
              </h2>
              {reviews.length === 0 ? (
                <div
                  className="text-center py-6"
                  data-ocid="teacher.reviews.empty_state"
                >
                  <Star className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">
                    No reviews yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reviews.map((review, i) => (
                    <div
                      key={`rev-${review.reviewer.toString()}-${i}`}
                      className="glass rounded-xl p-4"
                      data-ocid={`teacher.reviews.item.${i + 1}`}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((starVal) => (
                          <Star
                            key={starVal}
                            className={`w-4 h-4 ${starVal <= Number(review.rating) ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"}`}
                          />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">
                          {Number(review.rating)}/5
                        </span>
                      </div>
                      <p className="text-sm text-foreground/80">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Progress */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-500" /> Progress
              </h2>
              <div className="space-y-3">
                {[
                  {
                    label: "Sessions Completed",
                    value: Math.min(sessions.length, 10),
                    max: 10,
                  },
                  {
                    label: "Reviews Received",
                    value: Math.min(reviews.length, 5),
                    max: 5,
                  },
                  { label: "Community Engagement", value: 6, max: 10 },
                ].map((item, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: fixed progress items
                  <div key={i}>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>{item.label}</span>
                      <span>
                        {item.value}/{item.max}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full btn-gradient transition-all duration-700"
                        style={{ width: `${(item.value / item.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <NotesPanel />

            {/* Chat */}
            {myGroup && (
              <ChatPanel
                groupId={myGroup.id}
                username={myUser?.username || "Teacher"}
              />
            )}
          </div>
        </div>
      </main>

      <NotificationsDrawer
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
      />
      <AIChatbot />

      {/* Footer */}
      <footer className="py-6 px-4 text-center border-t border-border/30 mt-8">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
