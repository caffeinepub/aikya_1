# Aikya - Peer-to-Peer Learning Platform

## Current State
New project, no existing implementation.

## Requested Changes (Diff)

### Add
- Landing page with hero section, tagline "Learn Together, Grow Together", CTA buttons
- Authentication with role selection (Student Teacher / Learner)
- Smart grouping system: auto-assign users into groups of 4 (1 Teacher + 3 Learners) by subject/topic
- Teacher Dashboard: create sessions (subject, topic, time, Google Meet link), view group members, receive ratings/feedback, notifications
- Learner Dashboard: view assigned group/teacher, session info, rate/review teachers (1-5 stars + comment), notifications
- Star rating & review system
- Group Chat UI per group
- AI Chatbot UI (frontend-only simulation)
- Progress Tracker UI
- Dark Mode toggle
- Smart Notifications panel (upcoming sessions/meetings)
- Offline Notes system UI (upload/download simulation)
- Scheduled Sessions with Google Meet link display

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Backend: user profiles, roles (teacher/learner), groups, sessions, ratings/reviews, chat messages, notes metadata stored in Motoko stable storage
2. Backend APIs: register/login with role, create session, join group (auto-assign), list groups/sessions, post/get chat messages, post rating, get notifications
3. Frontend: Landing page, auth/role selection flow, teacher dashboard, learner dashboard, group chat per group, AI chatbot panel (UI only), progress tracker cards, dark mode toggle, notifications panel, notes UI
