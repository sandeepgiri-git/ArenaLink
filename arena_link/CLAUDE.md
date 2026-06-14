@AGENTS.md
PROJECT NAME: ArenaLink

PROJECT OVERVIEW

I want to build a modern full-stack web application called ArenaLink.

ArenaLink is a sports player matchmaking platform that helps people find teammates and join nearby matches when they don't have enough players to form a complete team.

Many people want to play sports such as Football, Cricket, Badminton, Basketball, Volleyball, Tennis, etc., but often they don't have enough friends available to form a team.

At the same time, many other players are actively looking for games but have nobody to play with.

ArenaLink bridges the gap between these two groups by connecting people who need players with people who want to play.

Example:

User A wants to play football today at 7 PM but needs 4 more players.

User B wants to play football today but doesn't have a team.

User B discovers User A's match post, sends a join request, gets accepted, and becomes part of the match.

The platform should focus on community building, easy matchmaking, real-time communication, and helping people play sports more frequently.

==================================================

TARGET USERS

- College students
- Working professionals
- Sports enthusiasts
- Local sports communities
- Casual players
- Turf players

==================================================

CORE OBJECTIVE

Enable users to:

1. Create sports match requirements.
2. Discover nearby matches.
3. Join matches.
4. Communicate with teammates.
5. Build a local sports network.
6. Track match history and reputation.

==================================================

USER ROLES

1. Player
2. Match Host

Every user can act as both Player and Host.

==================================================

CORE FEATURES

AUTHENTICATION

- Sign Up
- Login
- Google Authentication
- Forgot Password
- Protected Routes
- Session Management

USER PROFILE

Profile should contain:

- Name
- Username
- Profile Photo
- Bio
- City
- Age
- Gender
- Sports Interests
- Skill Level
- Matches Played
- Rating
- Reliability Score

SPORTS SUPPORTED

- Football
- Cricket
- Basketball
- Volleyball
- Tennis
- Badminton
- Custom Sports

==================================================

MATCH CREATION

Users should be able to create a match post.

Fields:

- Match Title
- Sport Type
- Description
- Date
- Time
- Location
- Number Of Players Needed
- Cost Per Player
- Skill Level Required

Example:

Need 3 Football Players

Date: Today
Time: 7 PM
Location: Vijay Nagar Turf
Cost: ₹150 Per Player

==================================================

MATCH DISCOVERY

Users can browse available matches.

Features:

- Match Feed
- Search Matches
- Filter By Sport
- Filter By Date
- Filter By Location
- Filter By Skill Level
- Sort By Latest

==================================================

JOIN REQUEST SYSTEM

Flow:

1. User finds match.
2. User sends join request.
3. Host receives request.
4. Host accepts or rejects request.
5. User gets notified.

==================================================

REAL-TIME PLAYER COUNT

Example:

Players Required: 10
Joined: 7
Remaining: 3

This should update instantly.

==================================================

REAL-TIME GROUP CHAT

Once accepted:

- Access match group chat
- Send messages
- Coordinate match details

==================================================

NOTIFICATIONS

Notify users when:

- Join request received
- Request accepted
- Request rejected
- Match cancelled
- Match completed

==================================================

MATCH HISTORY

Track:

- Upcoming Matches
- Completed Matches
- Cancelled Matches

==================================================

RATING SYSTEM

After a match:

- Rate Host
- Rate Players
- Leave Feedback

==================================================

RELIABILITY SCORE

Calculate using:

- Attendance Rate
- Match Participation
- No-Show Frequency

This helps build trust within the community.

==================================================

ADVANCED FEATURES

FRIEND SYSTEM

- Add Friends
- View Friend Profiles
- Invite Friends To Matches

TEAM MANAGEMENT

- Create Team
- Invite Members
- Manage Team Roster

BOOKMARK MATCHES

- Save Match
- View Saved Matches

AVAILABLE NOW STATUS

Users can set:

- Available Now
- Looking For Match
- Busy

EMERGENCY PLAYER REQUEST

Hosts can mark posts as:

"Need Player Urgently"

These should appear with higher visibility.

==================================================

LOCATION FEATURES

Use Maps and Geolocation.

Features:

- Nearby Matches
- Distance Display
- Match Location View
- Open In Google Maps

==================================================

UI/UX REQUIREMENTS

Design Style:

- Modern
- Premium
- Clean
- Sports Focused
- Startup Quality

Must support:

- Dark Theme
- Light Theme
- Mobile First Design
- Tablet Responsive
- Desktop Responsive

==================================================

TECH STACK

Frontend

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Shadcn UI
- Zustand
- React Hook Form
- Zod

Backend

- Next.js API Routes
- Server Actions

Database

- MongoDB Atlas

ODM

- Mongoose

Authentication

- Auth.js (NextAuth v5)

Real-Time Communication

- Socket.io

File Storage

- Cloudinary

Location Services

- Google Maps API
- Browser Geolocation API

==================================================

DATABASE COLLECTIONS

Users
Matches
JoinRequests
Messages
Reviews
Teams
Friends
Notifications
Bookmarks

==================================================

NON-FUNCTIONAL REQUIREMENTS

- Scalable architecture
- Reusable components
- Clean folder structure
- Type-safe code
- Secure API design
- Optimized database queries
- Fast loading UI
- Accessibility support
- Error handling
- Loading states
- Responsive layouts
- Dark/Light theme support

==================================================

IMPORTANT

Before generating any code:

1. Fully understand the product.
2. Generate complete system architecture.
3. Design database collections and relationships.
4. Define application routes.
5. Define API structure.
6. Define folder structure.
7. Define state management strategy.
8. Define authentication flow.
9. Define Socket.io architecture.
10. Define development roadmap.

Do not generate code yet.

Wait for approval before implementation.