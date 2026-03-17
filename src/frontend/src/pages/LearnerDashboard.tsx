import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  BookOpen,
  Calendar,
  GraduationCap,
  Loader2,
  LogOut,
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
import StarRatingInput from "../components/StarRatingInput";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddReview,
  useMyGroup,
  useMyGroupSessions,
  useMyUser,
  useNotifications,
  useTeacherReviews,
} from "../hooks/useQueries";

export default function LearnerDashboard() {
  const navigate = useNavigate();
  const { identity, clear } = useInternetIdentity();
  const { data: myUser, isLoading: loadingUser } = useMyUser();
  const { data: myGroup, isLoading: loadingGroup } = useMyGroup();
  const { data: sessions = [], isLoading: loadingSessions } =
    useMyGroupSessions();
  const teacherPrincipal = myGroup?.teacher?.toString();
  const { data: teacherReviews = [] } = useTeacherReviews(teacherPrincipal);
  const { data: notifications = [] } = useNotifications();
  const addReviewMutation = useAddReview();

  const [notifOpen, setNotifOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    if (!identity && !loadingUser) navigate({ to: "/login" });
  }, [identity, loadingUser, navigate]);

  const avgRating = teacherReviews.length
    ? (
        teacherReviews.reduce((sum, r) => sum + Number(r.rating), 0) /
        teacherReviews.length
      ).toFixed(1)
    : "—";

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherPrincipal) {
      toast.error("No teacher to review");
      return;
    }
    if (reviewRating === 0) {
      toast.error("Please select a rating");
      return;
    }
    try {
      await addReviewMutation.mutateAsync({
        teacherPrincipal,
        rating: BigInt(reviewRating),
        comment: reviewComment,
      });
      toast.success("Review submitted!");
      setReviewRating(0);
      setReviewComment("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to submit review",
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
              Learner
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <DarkModeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setNotifOpen(true)}
              data-ocid="learner.notifications_button"
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
              data-ocid="learner.logout_button"
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
              {myUser?.username || "Learner"}
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
              label: "My Sessions",
              value: sessions.length,
              icon: Calendar,
              color: "text-violet-600",
            },
            {
              label: "Teacher Rating",
              value: avgRating,
              icon: Star,
              color: "text-amber-500",
            },
            {
              label: "Group Members",
              value: myGroup ? myGroup.learners.length + 1 : 0,
              icon: Users,
              color: "text-blue-500",
            },
            {
              label: "Reviews Given",
              value: teacherReviews.length,
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
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-12 rounded-xl" />
                  ))}
                </div>
              ) : !myGroup ? (
                <div
                  className="text-center py-8"
                  data-ocid="learner.group.empty_state"
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
                  {/* Teacher highlight */}
                  <div
                    className="glass rounded-xl p-3 flex items-center gap-3 border border-violet-300/50 dark:border-violet-700/30"
                    data-ocid="learner.group.item.1"
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="btn-gradient text-white text-sm">
                        T
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">
                        {myGroup.teacher.toString().slice(0, 12)}...
                      </div>
                      <Badge className="text-xs bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300">
                        Your Teacher
                      </Badge>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {myGroup.subject}
                    </Badge>
                  </div>
                  {myGroup.learners.map((learner, i) => (
                    <div
                      key={learner.toString()}
                      className="glass rounded-xl p-3 flex items-center gap-3"
                      data-ocid={`learner.group.item.${i + 2}`}
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

            {/* Sessions */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-violet-500" /> Upcoming
                Sessions
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
                  data-ocid="learner.sessions.empty_state"
                >
                  <Calendar className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">
                    No sessions scheduled yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sessions.map((session, i) => (
                    <div
                      key={session.id.toString()}
                      className="glass rounded-xl p-4"
                      data-ocid={`learner.sessions.item.${i + 1}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm">
                            {session.topic}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {session.scheduledTime}
                          </div>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {session.subject}
                          </Badge>
                        </div>
                        {session.googleMeetLink && (
                          <a
                            href={session.googleMeetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button size="sm" className="btn-gradient text-xs">
                              <Video className="mr-1 w-3 h-3" /> Join Meeting
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Rate Teacher */}
            {myGroup && (
              <div className="glass-card rounded-2xl p-6">
                <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" /> Rate Your Teacher
                </h2>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <StarRatingInput
                    value={reviewRating}
                    onChange={setReviewRating}
                  />
                  <Textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience with your teacher..."
                    className="glass border-border/50 resize-none"
                    rows={3}
                    data-ocid="learner.review.textarea"
                  />
                  <Button
                    type="submit"
                    className="btn-gradient w-full"
                    disabled={addReviewMutation.isPending}
                    data-ocid="learner.review.submit_button"
                  >
                    {addReviewMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />{" "}
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Star className="mr-2 w-4 h-4" /> Submit Review
                      </>
                    )}
                  </Button>
                </form>
              </div>
            )}
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
                    label: "Sessions Attended",
                    value: Math.min(sessions.length, 10),
                    max: 10,
                  },
                  { label: "Notes Taken", value: 3, max: 10 },
                  {
                    label: "Reviews Given",
                    value: Math.min(teacherReviews.length, 5),
                    max: 5,
                  },
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
                username={myUser?.username || "Learner"}
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
