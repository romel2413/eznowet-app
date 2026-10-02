# PLAN.md — Instagram-Style Social Media App

> **Last updated**: 2026-10-02
> **Status**: Pre-development — awaiting Phase 1 kickoff

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Target Platforms](#target-platforms)
- [Project Structure](#project-structure)
- [Data Model](#data-model)
- [Auth Flow](#auth-flow)
- [Implementation Phases](#implementation-phases)
  - [Phase 1 — Project Scaffolding & Dev Environment](#phase-1--project-scaffolding--dev-environment)
  - [Phase 2 — Authentication (Clerk + Firebase)](#phase-2--authentication-clerk--firebase)
  - [Phase 3 — User Profiles](#phase-3--user-profiles)
  - [Phase 4 — Posts (Create, View, Delete)](#phase-4--posts-create-view-delete)
  - [Phase 5 — Social Graph (Follow / Unfollow)](#phase-5--social-graph-follow--unfollow)
  - [Phase 6 — Post Interactions (Likes & Comments)](#phase-6--post-interactions-likes--comments)
  - [Phase 7 — Direct Messages (Real-Time)](#phase-7--direct-messages-real-time)
  - [Phase 8 — Explore & Search](#phase-8--explore--search)
  - [Phase 9 — Notifications (In-App + Push)](#phase-9--notifications-in-app--push)
  - [Phase 10 — Moderation (Block & Report)](#phase-10--moderation-block--report)
  - [Phase 11 — Theming (Dark / Light Mode)](#phase-11--theming-dark--light-mode)
  - [Phase 12 — Polish, Edge Cases & Testing](#phase-12--polish-edge-cases--testing)
- [Dependency Graph](#dependency-graph)
- [Package Versions](#package-versions)
- [v1 Scope Boundaries](#v1-scope-boundaries)
- [Assumptions](#assumptions)
- [Open Risks](#open-risks)
- [v1 Ship Criteria](#v1-ship-criteria)

---

## Overview

An Instagram-style social media app for iOS and Android. Users share single-image posts, follow other users, interact via likes and comments, and send real-time direct messages. The UI is clean, modern, minimal, and mobile-first.

**Core features (v1):**

- Sign up / login with Google (via Clerk)
- Create single-image posts with captions
- Chronological home feed with infinite scroll
- Follow / unfollow users
- Like and comment on posts
- Delete own posts and comments
- Real-time 1-on-1 direct messages (text + images)
- Explore tab with user search and post discovery grid
- View and edit profile
- In-app + push notifications
- Block users and report posts
- Dark / light mode (system default + manual override)

**4 main tabs:** Home, Explore, Messages, Profile

---

## Tech Stack

| Layer                  | Choice                                          |
| ---------------------- | ----------------------------------------------- |
| Framework              | React Native + Expo (dev-client workflow)        |
| Language               | TypeScript                                       |
| Navigation             | React Navigation v7 (manual config)              |
| Styling                | NativeWind v4 (Tailwind CSS for React Native)    |
| State Management       | Zustand v5                                       |
| Auth                   | Clerk (Google OAuth) → Firebase custom tokens    |
| Database (main)        | Cloud Firestore                                  |
| Database (DMs)         | Firebase Realtime Database                       |
| File Storage           | Firebase Storage (Cloud Storage for Firebase)    |
| Backend Functions      | Firebase Cloud Functions (Node.js / TypeScript)  |
| Push Notifications     | Firebase Cloud Messaging (FCM)                   |
| Image Handling         | expo-image, expo-image-picker, expo-image-manipulator |
| Testing                | Jest (unit) + manual QA                          |

---

## Target Platforms

- ✅ iOS
- ✅ Android
- ❌ Web (not in scope for v1)

---

## Project Structure

```
socialapp/
├── app.json
├── babel.config.js
├── tailwind.config.js
├── global.css
├── tsconfig.json
├── package.json
├── App.tsx
│
├── src/
│   ├── navigation/
│   │   ├── RootNavigator.tsx
│   │   ├── MainTabNavigator.tsx
│   │   ├── HomeStack.tsx
│   │   ├── ExploreStack.tsx
│   │   ├── MessagesStack.tsx
│   │   └── ProfileStack.tsx
│   │
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── SignInScreen.tsx
│   │   │   └── OnboardingScreen.tsx
│   │   ├── home/
│   │   │   └── HomeScreen.tsx
│   │   ├── explore/
│   │   │   └── ExploreScreen.tsx
│   │   ├── messages/
│   │   │   ├── ConversationsScreen.tsx
│   │   │   └── ChatScreen.tsx
│   │   ├── profile/
│   │   │   ├── ProfileScreen.tsx
│   │   │   ├── EditProfileScreen.tsx
│   │   │   ├── FollowersScreen.tsx
│   │   │   ├── FollowingScreen.tsx
│   │   │   └── SettingsScreen.tsx
│   │   ├── post/
│   │   │   ├── CreatePostScreen.tsx
│   │   │   ├── PostDetailScreen.tsx
│   │   │   └── CommentsSheet.tsx
│   │   └── notifications/
│   │       └── NotificationsScreen.tsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── ErrorState.tsx
│   │   ├── post/
│   │   │   ├── PostCard.tsx
│   │   │   ├── PostGrid.tsx
│   │   │   ├── LikeButton.tsx
│   │   │   └── CommentItem.tsx
│   │   ├── profile/
│   │   │   ├── ProfileHeader.tsx
│   │   │   ├── FollowButton.tsx
│   │   │   └── UserListItem.tsx
│   │   └── messages/
│   │       ├── ConversationItem.tsx
│   │       ├── MessageBubble.tsx
│   │       └── ChatInput.tsx
│   │
│   ├── services/
│   │   ├── firebase.ts
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── posts.ts
│   │   ├── likes.ts
│   │   ├── comments.ts
│   │   ├── follows.ts
│   │   ├── messages.ts
│   │   ├── notifications.ts
│   │   ├── storage.ts
│   │   ├── blocks.ts
│   │   └── reports.ts
│   │
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── themeStore.ts
│   │   └── notificationStore.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── usePosts.ts
│   │   ├── useUserProfile.ts
│   │   ├── useFollowStatus.ts
│   │   ├── useMessages.ts
│   │   ├── useConversations.ts
│   │   ├── useNotifications.ts
│   │   └── useImagePicker.ts
│   │
│   ├── utils/
│   │   ├── imageCompression.ts
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   │
│   └── types/
│       ├── user.ts
│       ├── post.ts
│       ├── comment.ts
│       ├── message.ts
│       ├── conversation.ts
│       ├── notification.ts
│       └── navigation.ts
│
└── functions/
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── index.ts
        ├── auth/
        │   └── getFirebaseToken.ts
        ├── notifications/
        │   ├── onNewLike.ts
        │   ├── onNewComment.ts
        │   ├── onNewFollow.ts
        │   └── onNewMessage.ts
        └── utils/
            └── sendPushNotification.ts
```

---

## Data Model

### Firestore Collections

```
users/{userId}
  - uid: string (Clerk user ID / Firebase UID)
  - username: string (unique, lowercase)
  - displayName: string
  - bio: string
  - avatarUrl: string
  - followersCount: number
  - followingCount: number
  - postsCount: number
  - fcmToken: string (for push notifications)
  - createdAt: timestamp

usernames/{username}                  # Uniqueness enforcement
  - userId: string

posts/{postId}
  - userId: string (author)
  - imageUrl: string
  - caption: string
  - likesCount: number
  - commentsCount: number
  - createdAt: timestamp

posts/{postId}/likes/{userId}
  - createdAt: timestamp

posts/{postId}/comments/{commentId}
  - userId: string
  - text: string
  - createdAt: timestamp

following/{userId}/userFollowing/{targetUserId}
  - createdAt: timestamp

followers/{userId}/userFollowers/{followerUserId}
  - createdAt: timestamp

notifications/{userId}/items/{notificationId}
  - type: "like" | "comment" | "follow" | "dm"
  - fromUserId: string
  - postId?: string
  - read: boolean
  - createdAt: timestamp

reports/{reportId}
  - reportedBy: string (userId)
  - postId: string
  - reason: string
  - createdAt: timestamp

blocks/{userId}/blockedUsers/{blockedUserId}
  - createdAt: timestamp
```

### Realtime Database (DMs)

```
conversations/{conversationId}
  - participants: { userId1: true, userId2: true }
  - lastMessage: { text, senderId, timestamp }

messages/{conversationId}/{messageId}
  - senderId: string
  - text?: string
  - imageUrl?: string
  - timestamp: number

userConversations/{userId}/{conversationId}
  - otherUserId: string
  - lastMessage: string
  - timestamp: number
  - unreadCount: number
```

---

## Auth Flow

```
User taps "Sign in with Google"
  → Clerk SDK handles Google OAuth
  → App receives Clerk session token
  → App calls Cloud Function: POST /getFirebaseToken (with Clerk token)
    → Cloud Function verifies Clerk token via Clerk Backend API
    → Cloud Function calls admin.auth().createCustomToken(clerkUserId)
    → Returns Firebase custom token
  → App calls signInWithCustomToken(firebaseToken)
  → Firebase auth session established
  → App checks if user doc exists in Firestore
    → If new user → OnboardingScreen (username, avatar, bio)
    → If returning user → Home tab
```

### Username Claiming (Atomic)

```typescript
async function claimUsername(userId: string, username: string): Promise<boolean> {
  const usernameRef = doc(db, 'usernames', username.toLowerCase());
  const userRef = doc(db, 'users', userId);

  return runTransaction(db, async (transaction) => {
    const usernameDoc = await transaction.get(usernameRef);
    if (usernameDoc.exists()) {
      throw new Error('Username already taken');
    }
    transaction.set(usernameRef, { userId });
    transaction.update(userRef, { username: username.toLowerCase() });
  });
}
```

---

## Implementation Phases

### Phase 1 — Project Scaffolding & Dev Environment

**Goal:** Empty app runs on both platforms with 4 tabs, NativeWind styling, and navigation.

| #    | Task                                | Details                                                                                       |
| ---- | ----------------------------------- | --------------------------------------------------------------------------------------------- |
| 1.1  | Create Expo project                 | `npx create-expo-app socialapp --template blank-typescript`                                    |
| 1.2  | Install navigation deps             | `@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/native-stack`, `react-native-screens`, `react-native-safe-area-context` |
| 1.3  | Install & configure NativeWind v4   | `nativewind`, `tailwindcss` → `babel.config.js`, `tailwind.config.js`, `global.css`            |
| 1.4  | Install Zustand                     | `zustand`                                                                                     |
| 1.5  | Create folder structure              | All directories under `src/` as defined above                                                  |
| 1.6  | Build `RootNavigator`               | Placeholder rendering `MainTabNavigator`                                                       |
| 1.7  | Build `MainTabNavigator`            | 4 tabs (Home, Explore, Messages, Profile) with placeholder screens                            |
| 1.8  | Build stack navigators               | `HomeStack`, `ExploreStack`, `MessagesStack`, `ProfileStack` wrapping placeholders             |
| 1.9  | Create navigation types              | `src/types/navigation.ts` — typed param lists for every screen                                 |
| 1.10 | Verify on both platforms             | iOS simulator + Android emulator — tabs work, NativeWind renders                               |

**Done when:**
- [x] App opens on both platforms with 4 functional tabs
- [x] NativeWind classes render correctly
- [x] TypeScript compiles with zero errors

---

### Phase 2 — Authentication (Clerk + Firebase)

**Goal:** User can sign in with Google, get a Firebase token, and reach the home screen. New users → onboarding.

| #    | Task                                | Details                                                                                       |
| ---- | ----------------------------------- | --------------------------------------------------------------------------------------------- |
| 2.1  | Create Firebase project              | Enable Firestore, Realtime Database, Storage, Cloud Functions                                  |
| 2.2  | Install Firebase SDK                 | `@react-native-firebase/app`, `/auth`, `/firestore`, `/database`, `/storage`                   |
| 2.3  | Configure Firebase                   | Add `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)                      |
| 2.4  | Install & configure Clerk            | `@clerk/clerk-expo` — set publishable key, enable Google OAuth in Clerk Dashboard              |
| 2.5  | Build `SignInScreen`                 | Google sign-in button using Clerk's `useOAuth` hook                                            |
| 2.6  | Write Cloud Function `getFirebaseToken` | Verify Clerk token → `admin.auth().createCustomToken(uid)` → return                         |
| 2.7  | Build `src/services/auth.ts`         | Full sign-in flow: Clerk → Cloud Function → `signInWithCustomToken`                            |
| 2.8  | Build `authStore.ts`                 | Zustand: `user`, `firebaseUser`, `isLoading`, `isAuthenticated`                                |
| 2.9  | Build `useAuth` hook                 | Wraps authStore + `signIn` / `signOut` helpers                                                 |
| 2.10 | Update `RootNavigator`              | Not auth → SignIn. Auth + no user doc → Onboarding. Auth + user doc → MainTabs                 |
| 2.11 | Build `OnboardingScreen`            | Avatar picker, username, display name, bio → creates user doc in Firestore                     |
| 2.12 | Write `src/services/users.ts`       | `createUser()`, `getUser()`, `claimUsername()` (transactional)                                  |
| 2.13 | Write Firestore security rules       | Users can only write their own doc. Username claim requires transaction                        |

**Done when:**
- [ ] Sign in with Google → Clerk OAuth → Firebase auth → home screen
- [ ] New users see onboarding → pick unique username → profile saved
- [ ] Returning users skip onboarding
- [ ] Sign out returns to sign-in screen

---

### Phase 3 — User Profiles

**Goal:** Users can view/edit their own profile and view other users' profiles.

| #   | Task                          | Details                                                                 |
| --- | ----------------------------- | ----------------------------------------------------------------------- |
| 3.1 | Build `ProfileHeader`         | Avatar, name, @username, bio, follower/following/post counts, action btn |
| 3.2 | Build `ProfileScreen`         | Own → Edit btn. Others → Follow btn. User's posts in grid below header  |
| 3.3 | Build `EditProfileScreen`     | Edit display name, bio, avatar. Username is **immutable**               |
| 3.4 | Build `useUserProfile` hook   | Fetches user doc by userId from Firestore                               |
| 3.5 | Write `updateUser()` service  | Update displayName, bio, avatarUrl                                      |
| 3.6 | Build `Avatar` component      | Profile pic with fallback initials                                      |
| 3.7 | Build `SettingsScreen`        | Theme toggle (Phase 11), sign out button                                |
| 3.8 | Build `PostGrid` component    | 3-column image grid (populated in Phase 4)                              |

> **Note:** Username is immutable after onboarding. Allowing changes would require releasing the old `usernames/` doc and claiming a new one atomically — not worth the complexity for v1.

**Done when:**
- [ ] Profile tab shows your profile with all fields
- [ ] Edit Profile saves changes to Firestore
- [ ] Tapping another user's name navigates to their profile
- [ ] Settings screen has a working sign-out

---

### Phase 4 — Posts (Create, View, Delete)

**Goal:** Users can create image posts, view the home feed, and delete their own posts.

| #    | Task                          | Details                                                                    |
| ---- | ----------------------------- | -------------------------------------------------------------------------- |
| 4.1  | Install image picker           | `expo-image-picker`                                                        |
| 4.2  | Build `useImagePicker` hook    | Opens camera/gallery, returns URI                                          |
| 4.3  | Build `imageCompression.ts`    | `expo-image-manipulator` — max 1080px wide, quality 0.7                    |
| 4.4  | Build `storage.ts` service     | `uploadImage(uri, path)` → Firebase Storage → returns download URL         |
| 4.5  | Build `CreatePostScreen`       | Pick image → preview → caption → submit with progress indicator           |
| 4.6  | Write `posts.ts` service       | `createPost()`, `deletePost()` (delete doc + image + decrement count), `fetchPosts()` (paginated, `createdAt` desc) |
| 4.7  | Build `PostCard` component     | Image, author info, caption, like/comment counts, timestamp, delete option |
| 4.8  | Build `HomeScreen`             | FlatList + PostCard, infinite scroll (Firestore cursor pagination), pull-to-refresh |
| 4.9  | Build `usePosts` hook          | `posts[]`, `isLoading`, `loadMore()`, `refresh()`                          |
| 4.10 | Build `PostDetailScreen`       | Full post view + comments (wired in Phase 6)                               |
| 4.11 | Wire post grid on Profile      | Fetch user's posts → 3-column grid → tap → PostDetail                     |
| 4.12 | Add create post button          | FAB or header "+" to open CreatePostScreen                                 |
| 4.13 | Write Firestore rules for posts | Anyone reads. Only author writes/deletes. Validate required fields         |

**Pagination strategy:**

```typescript
const PAGE_SIZE = 10;

async function fetchPosts(lastDoc?: DocumentSnapshot) {
  let q = query(
    collection(db, 'posts'),
    orderBy('createdAt', 'desc'),
    limit(PAGE_SIZE)
  );
  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }
  const snapshot = await getDocs(q);
  return {
    posts: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
    lastDoc: snapshot.docs[snapshot.docs.length - 1],
    hasMore: snapshot.docs.length === PAGE_SIZE,
  };
}
```

**Done when:**
- [ ] User can pick an image, add a caption, and create a post
- [ ] Home feed shows all posts in reverse chronological order
- [ ] Infinite scroll + pull-to-refresh work
- [ ] User can delete their own posts (image removed from Storage)
- [ ] Profile shows user's posts in a grid

---

### Phase 5 — Social Graph (Follow / Unfollow)

**Goal:** Follow/unfollow users, view follower and following lists.

| #   | Task                           | Details                                                                              |
| --- | ------------------------------ | ------------------------------------------------------------------------------------ |
| 5.1 | Write `follows.ts` service     | `followUser()` / `unfollowUser()` — batch writes to `following/`, `followers/`, + both user count fields |
| 5.2 | Build `FollowButton`           | "Follow" / "Following" toggle with optimistic UI                                     |
| 5.3 | Build `useFollowStatus` hook   | Real-time listener on the follow doc                                                 |
| 5.4 | Wire FollowButton into profile | Show on other users' profiles only                                                   |
| 5.5 | Build `UserListItem`           | Avatar, name, @username, follow button — reused in followers/following/search         |
| 5.6 | Build `FollowersScreen`        | Paginated list of followers                                                          |
| 5.7 | Build `FollowingScreen`        | Paginated list of following                                                          |
| 5.8 | Make counts tappable            | Navigate to followers/following screen                                               |
| 5.9 | Write Firestore rules           | Users can only create/delete their own follow relationships                           |

> **Critical:** Follow/unfollow must use **Firestore batch writes** to atomically update 4 things: the follow doc in `following/`, the follow doc in `followers/`, and both users' counter fields.

**Done when:**
- [ ] Follow/unfollow works on other profiles
- [ ] Counts update immediately (optimistic)
- [ ] Tapping counts opens follower/following list
- [ ] Unfollow removes from both collections

---

### Phase 6 — Post Interactions (Likes & Comments)

**Goal:** Like/unlike posts and add/delete comments.

| #   | Task                          | Details                                                                  |
| --- | ----------------------------- | ------------------------------------------------------------------------ |
| 6.1 | Write `likes.ts` service      | `toggleLike()` — batch write: create/delete like doc + increment/decrement count |
| 6.2 | Build `LikeButton`            | Heart icon, filled when liked, optimistic update, shows count            |
| 6.3 | Wire LikeButton into PostCard | Check if current user liked on load                                      |
| 6.4 | Write `comments.ts` service   | `addComment()`, `deleteComment()`, `fetchComments()` (paginated)         |
| 6.5 | Build `CommentItem`           | Author avatar, name, text, timestamp, delete (own only)                  |
| 6.6 | Build `CommentsSheet`         | Bottom sheet or screen — comment list + input                            |
| 6.7 | Wire comments into PostDetail | Show comments below the post                                            |
| 6.8 | Add comment icon to PostCard  | Tap opens PostDetail scrolled to comments                                |
| 6.9 | Write Firestore rules          | Likes: user can only manage own doc. Comments: anyone creates, only author deletes |

**Done when:**
- [ ] Like/unlike with immediate visual feedback
- [ ] Like count accurate
- [ ] Add and delete comments
- [ ] Comment count accurate

---

### Phase 7 — Direct Messages (Real-Time)

**Goal:** 1-on-1 real-time text and image messaging via Firebase Realtime Database.

| #    | Task                            | Details                                                                        |
| ---- | ------------------------------- | ------------------------------------------------------------------------------ |
| 7.1  | Set up RTDB structure            | `conversations/`, `messages/`, `userConversations/`                            |
| 7.2  | Write `messages.ts` service      | `getOrCreateConversation()`, `sendMessage()`, `sendImageMessage()`             |
| 7.3  | Build `useConversations` hook    | Real-time listener on `userConversations/{myUserId}`, sorted by timestamp desc |
| 7.4  | Build `ConversationsScreen`      | FlatList of conversations — avatar, name, last msg, timestamp, unread badge    |
| 7.5  | Build `ConversationItem`         | Conversation preview row component                                             |
| 7.6  | Build `useMessages` hook         | Real-time listener on `messages/{conversationId}`, paginate older on scroll-up |
| 7.7  | Build `ChatScreen`               | Inverted FlatList, message bubbles, auto-scroll on new message                 |
| 7.8  | Build `MessageBubble`            | Text or image. Sent = right/blue. Received = left/gray. Timestamp             |
| 7.9  | Build `ChatInput`                | Text input + send + image attach                                               |
| 7.10 | Add "Message" on ProfileScreen   | Opens/creates conversation with that user                                      |
| 7.11 | Mark messages read                | Reset `unreadCount` when conversation opened                                   |
| 7.12 | Write RTDB security rules        | Only participants read/write. Validate message structure. senderId = auth.uid  |
| 7.13 | Handle blocked users              | Hide conversations with blocked users, prevent sending                         |

**RTDB security rules (key excerpt):**

```json
{
  "rules": {
    "messages": {
      "$conversationId": {
        ".read": "root.child('conversations/' + $conversationId + '/participants/' + auth.uid).val() === true",
        ".write": "root.child('conversations/' + $conversationId + '/participants/' + auth.uid).val() === true",
        "$messageId": {
          ".validate": "newData.hasChildren(['senderId', 'timestamp']) && newData.child('senderId').val() === auth.uid"
        }
      }
    }
  }
}
```

**Done when:**
- [ ] Open conversation from another user's profile
- [ ] Messages appear in real-time for both participants
- [ ] Text and image messages work
- [ ] Conversation list shows last message + unread count
- [ ] Scroll up loads older messages
- [ ] Blocked users can't exchange messages

---

### Phase 8 — Explore & Search

**Goal:** Discover posts and search for users.

| #   | Task                      | Details                                                                         |
| --- | ------------------------- | ------------------------------------------------------------------------------- |
| 8.1 | Build `ExploreScreen`     | Search bar at top + post grid below                                             |
| 8.2 | Implement user search      | Firestore prefix query on `username` field (`>=` / `<=` + `\uf8ff`), debounce 300ms |
| 8.3 | Display search results     | List of `UserListItem` — tap navigates to profile                               |
| 8.4 | Build explore post grid    | Recent posts in 3-column grid — tap → PostDetail                                |
| 8.5 | Handle empty states         | No results, no posts                                                            |

**Search implementation:**

```typescript
async function searchUsers(prefix: string) {
  const q = query(
    collection(db, 'users'),
    where('username', '>=', prefix.toLowerCase()),
    where('username', '<=', prefix.toLowerCase() + '\uf8ff'),
    limit(20)
  );
  return getDocs(q);
}
```

> **Note:** Firestore prefix search is limited but fine for v1. Full-text/fuzzy search (Algolia, Typesense) is a v2 consideration.

**Done when:**
- [ ] Search finds users by username prefix
- [ ] Results tappable → user profile
- [ ] Post grid shows recent posts
- [ ] Empty states render cleanly

---

### Phase 9 — Notifications (In-App + Push)

**Goal:** Users receive notifications for likes, comments, follows, and DMs.

| #    | Task                             | Details                                                                          |
| ---- | -------------------------------- | -------------------------------------------------------------------------------- |
| 9.1  | Install notification deps         | `expo-notifications`, `@react-native-firebase/messaging`                         |
| 9.2  | Request permissions + get FCM token | On app launch after auth → store token in user doc                              |
| 9.3  | Cloud Function: `onNewLike`       | Firestore `onCreate` trigger → notification doc + push via FCM                   |
| 9.4  | Cloud Function: `onNewComment`    | Same pattern                                                                     |
| 9.5  | Cloud Function: `onNewFollow`     | Trigger on `followers/{userId}/userFollowers/{followerId}`                        |
| 9.6  | Cloud Function: `onNewMessage`    | RTDB `onCreate` trigger → push to other participant                              |
| 9.7  | Build `sendPushNotification.ts`   | Shared utility — fetch FCM token, send via `admin.messaging().send()`            |
| 9.8  | Build `useNotifications` hook     | Real-time listener on `notifications/{myUserId}/items/`                          |
| 9.9  | Build `NotificationsScreen`       | "X liked your post", "Y followed you" — tap navigates to relevant screen         |
| 9.10 | Build `notificationStore.ts`      | Zustand — unread count for badges                                                |
| 9.11 | Add notification badges            | Badge on Messages tab + bell icon in Home header                                 |
| 9.12 | Mark as read                       | Mark all read when NotificationsScreen opens                                     |
| 9.13 | Don't notify blocked users         | Cloud Functions check block list before sending                                  |

**Done when:**
- [ ] Like/comment/follow triggers in-app notification
- [ ] Push notification when app is backgrounded
- [ ] Badge shows unread count
- [ ] Tap notification → relevant screen
- [ ] Blocked users don't receive notifications

---

### Phase 10 — Moderation (Block & Report)

**Goal:** Block users and report posts.

| #    | Task                            | Details                                                            |
| ---- | ------------------------------- | ------------------------------------------------------------------ |
| 10.1 | Write `blocks.ts` service       | `blockUser()`, `unblockUser()`, `isBlocked()`, `getBlockedUsers()` |
| 10.2 | Write `reports.ts` service       | `reportPost()` → doc in `reports/` collection                      |
| 10.3 | Add block on ProfileScreen       | Action sheet: Block / Unblock                                      |
| 10.4 | Add report on PostCard           | Three-dot menu → Report → reason → submit                         |
| 10.5 | Filter blocked from feed         | Exclude blocked users' posts from home + explore                   |
| 10.6 | Filter blocked from search       | Don't show blocked users in results                                |
| 10.7 | Filter blocked from DMs          | Hide conversations, prevent new DMs                                |
| 10.8 | Write Firestore rules             | Own block list only. Anyone can create reports                     |
| 10.9 | Blocked Users screen in Settings | List with unblock option                                           |

**Done when:**
- [ ] Block hides posts, prevents DMs, removes from search
- [ ] Unblock restores visibility
- [ ] Report saves to Firestore
- [ ] Blocked user list in Settings

---

### Phase 11 — Theming (Dark / Light Mode)

**Goal:** Dark and light mode with system detection + manual override.

| #    | Task                          | Details                                                              |
| ---- | ----------------------------- | -------------------------------------------------------------------- |
| 11.1 | Build `themeStore.ts`          | Zustand + persist to AsyncStorage. Values: `"system"` / `"dark"` / `"light"` |
| 11.2 | Create theme provider           | Reads `useColorScheme()` + user preference, sets NativeWind dark class |
| 11.3 | Configure NativeWind dark mode  | `tailwind.config.js` → `darkMode: 'class'`                           |
| 11.4 | Apply dark mode classes          | Audit all screens/components — add `dark:` variants                   |
| 11.5 | Theme toggle in Settings         | Three options: System / Light / Dark                                  |
| 11.6 | Style navigation bars            | Dark/light tab bar, headers, status bar                               |
| 11.7 | Test both platforms               | Verify on iOS and Android                                             |

**Done when:**
- [ ] App follows system theme by default
- [ ] Manual override in Settings
- [ ] Preference persists across restarts
- [ ] All screens correct in both themes

---

### Phase 12 — Polish, Edge Cases & Testing

**Goal:** Handle rough edges, write tests, and reach a shippable state.

| #     | Task                    | Details                                                                      |
| ----- | ----------------------- | ---------------------------------------------------------------------------- |
| 12.1  | Empty states             | Feed, messages, followers, search — each gets friendly illustration + message |
| 12.2  | Loading states           | Skeleton loaders on feed/profile/conversations. Spinners on actions          |
| 12.3  | Error states             | Network errors, upload failures, auth expiry — retry options                 |
| 12.4  | Optimistic UI            | Likes, follows, message sends feel instant. Revert on failure                |
| 12.5  | Input validation         | Username: 3–20 chars, alphanumeric + underscores. Caption: ≤ 2000. Bio: ≤ 150. Comment: ≤ 500 |
| 12.6  | Image size limits        | Max 10MB before compression. Reject larger with message                      |
| 12.7  | Rate limiting            | Debounce like/follow buttons. Cloud Functions: limit post creation per hour  |
| 12.8  | Keyboard handling        | Chat input above keyboard. Comment input handles keyboard                    |
| 12.9  | Unit tests               | Jest: `imageCompression`, `validators`, `formatters`, auth service, username claiming, follow batch ops |
| 12.10 | Firestore rules tests    | `@firebase/rules-unit-testing` for all security rules                        |
| 12.11 | Accessibility pass       | Labels on buttons, contrast ratios, screen reader for key flows              |
| 12.12 | Performance audit        | FlatList perf, image caching (`expo-image`), minimize re-renders             |

---

## Dependency Graph

```
Phase 1 (Scaffolding)
  └── Phase 2 (Auth)
        └── Phase 3 (Profiles)
              ├── Phase 4 (Posts)
              │     ├── Phase 6 (Likes & Comments)
              │     │     └── Phase 9 (Notifications) ──┐
              │     └── Phase 8 (Explore & Search)      │
              ├── Phase 5 (Follow/Unfollow)             │
              │     ├── Phase 8 (Explore & Search)      │
              │     ├── Phase 9 (Notifications) ────────┤
              │     └── Phase 10 (Block & Report) ──────┤
              └── Phase 7 (DMs)                         │
                    ├── Phase 9 (Notifications) ────────┤
                    └── Phase 10 (Block & Report) ──────┤
                                                        │
Phase 1 (Scaffolding)                                   │
  └── Phase 11 (Theming)                                │
                                                        │
              Phase 12 (Polish & Testing) ◄─────────────┘
```

**Parallelizable after Phase 3:**
- Phases 4 and 5 can be built in parallel
- Phase 7 (DMs) can be built in parallel with 4/5/6
- Phase 11 (Theming) can be done anytime after Phase 1

---

## Package Versions

> **IMPORTANT:** Before starting Phase 1, verify compatibility across all major deps for your Expo SDK version.

| Package                        | Target Version | Notes                                    |
| ------------------------------ | -------------- | ---------------------------------------- |
| `expo`                         | SDK 53         | Verify compatibility with all deps       |
| `nativewind`                   | v4.x           | v4 is stable; v2 is deprecated           |
| `@clerk/clerk-expo`            | Latest         | Check Expo SDK 53 compatibility          |
| `@react-navigation/*`          | v7.x           | Latest stable                            |
| `zustand`                      | v5.x           | Latest, smaller bundle                   |
| `expo-image`                   | Latest         | Use instead of `<Image>` for perf        |
| `expo-image-picker`            | Latest         | Camera/gallery access                    |
| `expo-image-manipulator`       | Latest         | Client-side compression                  |
| `@react-native-firebase/*`     | Latest         | Verify Expo SDK 53 compatibility         |

---

## v1 Scope Boundaries

### In scope

- Google sign-in via Clerk
- Single-image posts with captions
- Chronological home feed (all posts)
- Follow / unfollow
- Like and comment
- Delete own posts and comments
- Real-time 1-on-1 DMs (text + images)
- User search + explore grid
- In-app + push notifications
- Block / report
- Dark / light mode
- Public profiles only

### Out of scope (v1)

- Video posts
- Private accounts / follow requests
- Group DMs
- Stories (ephemeral posts)
- Hashtags / tagging
- Saved / bookmarked posts
- Multi-image carousel posts
- Post sharing to DMs
- Web version
- Monetization
- AI content moderation
- Admin dashboard

---

## Assumptions

| #  | Area          | Assumption                                                                                  |
| -- | ------------- | ------------------------------------------------------------------------------------------- |
| 1  | Backend       | Firebase Cloud Functions (Node.js) for token minting + push notifications                    |
| 2  | Monetization  | None in v1. Architecture flexible for future ads/premium                                     |
| 3  | Deployment    | Deferred. Focus on code first, figure out EAS Build / local builds later                     |

---

## Open Risks

| #  | Risk                                        | Impact                                                     | Mitigation                                                                |
| -- | ------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------- |
| 1  | Clerk + Firebase dual auth complexity        | Extra Cloud Function call on every sign-in. Latency risk   | Keep Cloud Function simple. Add client-side retry + error handling        |
| 2  | Firestore read costs at scale                | "All posts" feed = every post read by every user            | Fine for v1. Fan-out-on-write or "following-only" feed if needed later    |
| 3  | Username uniqueness (no native constraint)   | Race condition on username claiming                         | Transactional check-and-claim via `usernames/` collection                 |
| 4  | Push notification setup (APNs key for iOS)   | Fiddly one-time config                                      | Test with Android first. iOS config during deployment phase               |
| 5  | Image storage costs                           | Uncontrolled uploads get expensive                           | Client-side compression + max 10MB limit + consider per-day post limit   |
| 6  | RTDB security rules (less expressive)         | Harder to enforce participant-only access                    | Write and test rules early. Validate against Firebase UID                |
| 7  | NativeWind v4 + React Navigation quirks       | Occasional styling issues with headers/tab bars             | Pin NativeWind version. Test tab bar styling early in Phase 1            |

---

## v1 Ship Criteria

- [ ] Auth flow works end-to-end (sign in → onboarding → home)
- [ ] Posts: create, view, like, comment, delete
- [ ] Follow/unfollow with accurate counts
- [ ] DMs work in real-time with text and images
- [ ] Explore search finds users by username
- [ ] Push notifications for likes, comments, follows, DMs
- [ ] Block/report functional
- [ ] Dark/light mode with system + manual toggle
- [ ] All empty, loading, and error states handled
- [ ] Unit tests pass for business logic
- [ ] Firestore + RTDB security rules tested
- [ ] Smooth performance on both iOS and Android
