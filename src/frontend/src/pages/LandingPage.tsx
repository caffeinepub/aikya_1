import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Globe,
  GraduationCap,
  MessageCircle,
  Star,
  Users,
  Video,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import DarkModeToggle from "../components/DarkModeToggle";

const features = [
  {
    icon: Users,
    title: "Smart Grouping",
    description:
      "AI-powered team formation ensures the perfect balance of 1 teacher and 3 learners per group based on subject and learning style.",
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-950/30",
  },
  {
    icon: Video,
    title: "Live Sessions",
    description:
      "Seamlessly schedule and join Google Meet sessions directly from your dashboard with one click.",
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
  },
  {
    icon: Star,
    title: "Peer Reviews",
    description:
      "Build credibility with a robust review system. Rate teachers, leave detailed feedback, and grow together.",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    icon: MessageCircle,
    title: "Group Chat",
    description:
      "Real-time group chat keeps your team connected. Share ideas, ask questions, and collaborate effortlessly.",
    color: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-50 dark:bg-cyan-950/30",
  },
  {
    icon: BookOpen,
    title: "Offline Notes",
    description:
      "Capture and store study notes directly on the platform. Access your knowledge base anytime, anywhere.",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    icon: Brain,
    title: "AI Assistant",
    description:
      "Your personal AI tutor is always available to answer questions and provide guidance on any topic.",
    color: "text-pink-600 dark:text-pink-400",
    bg: "bg-pink-50 dark:bg-pink-950/30",
  },
];

const stats = [
  { label: "Active Learners", value: "2,400+" },
  { label: "Sessions Completed", value: "8,700+" },
  { label: "Subjects Covered", value: "24+" },
  { label: "Avg. Rating", value: "4.8 ★" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen gradient-bg">
      {/* Nav */}
      <nav className="sticky top-0 z-50 glass border-b border-white/20 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg btn-gradient flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-gradient">
              Aikya
            </span>
          </div>
          <div className="flex items-center gap-3">
            <DarkModeToggle />
            <Link to="/login">
              <Button variant="ghost" size="sm" data-ocid="nav.link">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button
                size="sm"
                className="btn-gradient"
                data-ocid="nav.primary_button"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4 sm:px-6">
        {/* Decorative orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-400/20 dark:bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-700/50 font-body">
              <Zap className="w-3 h-3 mr-1" /> Peer-to-Peer Learning Platform
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-foreground mb-6 leading-tight"
          >
            <span className="text-gradient">Aikya</span>
            <br />
            <span className="text-3xl sm:text-4xl lg:text-5xl font-medium text-foreground/80">
              Learn Together, Grow Together
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-body"
          >
            Join small, focused groups of 4 where one student teaches and three
            learn. Powered by smart matching, live sessions, and real-time
            collaboration.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/register">
              <Button
                size="lg"
                className="btn-gradient px-8 py-6 text-base font-semibold"
                data-ocid="hero.primary_button"
              >
                Get Started Free <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-base font-semibold glass"
                data-ocid="hero.secondary_button"
              >
                Sign In
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Floating cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-4xl mx-auto mt-20 grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass-card rounded-2xl p-5 text-center"
            >
              <div className="font-display font-bold text-2xl text-gradient">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground mt-1 font-body">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display font-bold text-4xl text-foreground mb-4">
              Everything you need to{" "}
              <span className="text-gradient">learn smarter</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Aikya brings together the best of collaborative learning in one
              beautiful platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass-card rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}
                >
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-body">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display font-bold text-4xl text-foreground mb-4">
              How <span className="text-gradient">Aikya</span> works
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create your profile",
                desc: "Sign up and choose your role — teach what you know or learn from peers.",
                icon: Globe,
              },
              {
                step: "02",
                title: "Get matched",
                desc: "Our smart algorithm groups you with the perfect team based on your subject and goals.",
                icon: Users,
              },
              {
                step: "03",
                title: "Start learning",
                desc: "Join live sessions, chat with your group, and track your progress — all in one place.",
                icon: GraduationCap,
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl btn-gradient flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <div className="font-display font-bold text-4xl text-gradient mb-2">
                  {item.step}
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm font-body">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto glass-card rounded-3xl p-12 text-center"
        >
          <h2 className="font-display font-bold text-4xl text-foreground mb-4">
            Ready to <span className="text-gradient">unite</span> and learn?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join thousands of students already learning smarter with Aikya.
          </p>
          <Link to="/register">
            <Button
              size="lg"
              className="btn-gradient px-10 py-6 text-base font-semibold"
              data-ocid="cta.primary_button"
            >
              Start Learning Today <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md btn-gradient flex items-center justify-center">
              <GraduationCap className="w-3 h-3 text-white" />
            </div>
            <span className="font-display font-semibold text-sm text-gradient">
              Aikya
            </span>
          </div>
          <p className="text-sm text-muted-foreground font-body">
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
        </div>
      </footer>
    </div>
  );
}
