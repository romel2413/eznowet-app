import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useClerk, useUser } from "@clerk/expo";

const storyData = [
  { label: "Your Story", image: require("../../../assets/images/home/story-you.png") },
  { label: "Emma R.", image: require("../../../assets/images/home/story-emma.png") },
  { label: "Liam S.", image: require("../../../assets/images/home/story-liam.png") },
  { label: "Sophia L.", image: require("../../../assets/images/home/story-sophia.png") },
  { label: "Noah P.", image: require("../../../assets/images/home/story-noah.png") },
  { label: "Olivia T.", image: require("../../../assets/images/home/story-olivia.png") },
];

type FeedPost = {
  author: string;
  location: string;
  time: string;
  avatar: ImageSourcePropType;
  image: ImageSourcePropType;
  caption: string;
  hashtags: string[];
  likes: number;
  comments: number;
};

const posts: FeedPost[] = [
  {
    author: "Sarah K.",
    location: "Santorini, Greece",
    time: "2h",
    avatar: require("../../../assets/images/home/avatar-sarah.png"),
    image: require("../../../assets/images/home/post-santorini.png"),
    caption: "Sunsets hit different in Santorini 🌅",
    hashtags: ["#Santorini", "#Greece", "#Travel", "#EZNW"],
    likes: 342,
    comments: 24,
  },
  {
    author: "James T.",
    location: "El Nido, Philippines",
    time: "4h",
    avatar: require("../../../assets/images/home/avatar-james.png"),
    image: require("../../../assets/images/home/post-elnido.png"),
    caption: "A little more time in places like this, please.",
    hashtags: ["#ElNido", "#Philippines", "#Travel"],
    likes: 218,
    comments: 18,
  },
];

function FeedCard({ post, cardWidth }: { post: FeedPost; cardWidth: number }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <View style={[styles.postCard, { width: cardWidth }]}>
      <View style={styles.postHeader}>
        <Image source={post.avatar} style={styles.postAvatar} />
        <View style={styles.postIdentity}>
          <Text style={styles.postAuthor}>{post.author}</Text>
          <View style={styles.locationLine}>
            <Ionicons name="location-sharp" size={13} color="#68798D" />
            <Text style={styles.postLocation}>{post.location} · {post.time}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton} accessibilityLabel="More post options">
          <Ionicons name="ellipsis-horizontal" size={22} color="#16202C" />
        </TouchableOpacity>
      </View>

      <Image
        source={post.image}
        resizeMode="cover"
        style={[styles.postImage, { width: cardWidth - 2, height: (cardWidth - 2) * (523 / 870) }]}
      />

      <View style={styles.postDetails}>
        <Text numberOfLines={1} style={styles.caption}>{post.caption}</Text>
        <View style={styles.hashtagRow}>
          {post.hashtags.map((tag) => (
            <Text key={tag} style={styles.hashtag}>{tag}</Text>
          ))}
        </View>
        <View style={styles.postActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setLiked((value) => !value)}
            accessibilityLabel={liked ? "Unlike post" : "Like post"}
          >
            <Ionicons
              name={liked ? "heart" : "heart"}
              size={19}
              color={liked ? "#E84355" : "#EE4E5B"}
            />
            <Text style={styles.actionCount}>{post.likes + Number(liked)}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} accessibilityLabel="View comments">
            <Ionicons name="chatbubble-outline" size={19} color="#182431" />
            <Text style={styles.actionCount}>{post.comments}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} accessibilityLabel="Share post">
            <Ionicons name="arrow-redo-outline" size={20} color="#182431" />
          </TouchableOpacity>
          <View style={styles.actionSpacer} />
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => setSaved((value) => !value)}
            accessibilityLabel={saved ? "Remove bookmark" : "Bookmark post"}
          >
            <Ionicons
              name={saved ? "bookmark" : "bookmark-outline"}
              size={19}
              color="#182431"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export function HomeScreen() {
  const { width: reportedWidth } = useWindowDimensions();
  const windowWidth = Platform.OS === "web" ? Math.min(reportedWidth, 390) : reportedWidth;
  const { user } = useUser();
  const { signOut } = useClerk();
  const [activeTab, setActiveTab] = useState("Home");
  const displayName = user?.firstName || "there";

  return (
    <View style={[styles.screen, { width: windowWidth }]}>
      <StatusBar hidden />
      <ScrollView
        style={[styles.feedScroll, { width: windowWidth }]}
        contentContainerStyle={[styles.feedContent, { width: windowWidth }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.statusBar, { width: windowWidth }]}>
          <Text style={styles.statusTime}>9:41</Text>
          <View style={styles.systemIcons}>
            <Ionicons name="cellular" size={16} color="#111923" />
            <Ionicons name="wifi" size={16} color="#111923" />
            <Ionicons name="battery-full" size={19} color="#111923" />
          </View>
        </View>

        <View style={[styles.topHeader, { width: windowWidth }]}>
          <View>
            <Text style={styles.wordmark}>EZNW</Text>
            <Text style={styles.tagline}>Share moments. Connect with people.</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerIcon} accessibilityLabel="Search">
              <Ionicons name="search-outline" size={23} color="#15202C" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon} accessibilityLabel="Notifications">
              <Ionicons name="notifications-outline" size={23} color="#15202C" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={[styles.composer, { width: windowWidth - 28, alignSelf: "center" }]} activeOpacity={0.8}>
          <Image source={require("../../../assets/images/home/avatar-you.png")} style={styles.composerAvatar} />
          <Text style={styles.composerPrompt}>What’s on your mind?</Text>
          <Ionicons name="images-outline" size={22} color="#718093" />
        </TouchableOpacity>

        <View style={[styles.storiesRow, { width: windowWidth }]}>
          {storyData.map((story, index) => (
            <TouchableOpacity key={story.label} style={styles.storyItem} activeOpacity={0.8}>
              <Image source={story.image} style={styles.storyImage} />
              <Text numberOfLines={1} style={styles.storyLabel}>{story.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <FeedCard post={posts[0]} cardWidth={windowWidth - 28} />
        <FeedCard post={posts[1]} cardWidth={windowWidth - 28} />

        <TouchableOpacity onPress={() => signOut()} style={styles.signOutLink}>
          <Text style={styles.signOutText}>Signed in as {displayName} · Sign out</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={[styles.bottomBar, { width: windowWidth }]}>
        <View style={styles.tabRow}>
          <TabButton label="Home" icon="home" active={activeTab === "Home"} onPress={() => setActiveTab("Home")} />
          <TabButton label="Explore" icon="compass-outline" active={activeTab === "Explore"} onPress={() => setActiveTab("Explore")} />
          <View style={styles.createSlot} />
          <TabButton label="Messages" icon="chatbubble-ellipses-outline" active={activeTab === "Messages"} onPress={() => setActiveTab("Messages")} />
          <TabButton label="Profile" icon="person-outline" active={activeTab === "Profile"} onPress={() => setActiveTab("Profile")} />
        </View>
        <TouchableOpacity style={styles.createButton} accessibilityLabel="Create post">
          <Ionicons name="add" size={25} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.homeIndicator}>
          <View style={styles.homeIndicatorPill} />
        </View>
      </View>
    </View>
  );
}

function TabButton({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.tabButton} onPress={onPress} accessibilityLabel={label}>
      <Ionicons name={icon} size={22} color={active ? "#111923" : "#7C8998"} />
      <Text style={[styles.tabLabel, active && styles.activeTabLabel]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: "100%",
    minWidth: 0,
    overflow: "hidden",
    backgroundColor: "#F8FAFC",
  },
  feedScroll: {
    flex: 1,
    width: "100%",
    minWidth: 0,
  },
  feedContent: {
    paddingBottom: 105,
    width: "100%",
    alignItems: "stretch",
  },
  statusBar: {
    height: 32,
    paddingHorizontal: 23,
    paddingTop: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusTime: {
    color: "#101820",
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "700",
    letterSpacing: 0.1,
  },
  systemIcons: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  topHeader: {
    minHeight: 43,
    paddingHorizontal: 15,
    paddingBottom: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  wordmark: {
    color: "#14202C",
    fontSize: 26,
    lineHeight: 27,
    fontWeight: "800",
    letterSpacing: -1.1,
  },
  tagline: {
    color: "#8492A3",
    fontSize: 10.5,
    lineHeight: 14,
    marginTop: 1,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 17,
    paddingRight: 2,
  },
  headerIcon: {
    width: 28,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F04452",
    position: "absolute",
    right: 1,
    top: 3,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  composer: {
    height: 40,
    marginTop: 1,
    paddingHorizontal: 6,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E3E8EE",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#75869A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  },
  composerAvatar: {
    width: 31,
    height: 31,
    borderRadius: 16,
  },
  composerPrompt: {
    flex: 1,
    color: "#7D8999",
    fontSize: 14,
    marginLeft: 12,
  },
  storiesRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 8,
    paddingRight: 0,
    marginTop: 10,
    marginBottom: 10,
  },
  storyItem: {
    flex: 1,
    alignItems: "center",
  },
  storyImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  storyLabel: {
    color: "#17212D",
    fontSize: 10.5,
    lineHeight: 14,
    marginTop: 4,
    textAlign: "center",
    width: "100%",
  },
  postCard: {
    alignSelf: "center",
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5EAF0",
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#67798B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 7,
    elevation: 1,
  },
  postHeader: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 7,
  },
  postAvatar: {
    width: 31,
    height: 31,
    borderRadius: 16,
  },
  postIdentity: {
    flex: 1,
    marginLeft: 8,
    justifyContent: "center",
  },
  postAuthor: {
    color: "#182330",
    fontSize: 12.5,
    lineHeight: 16,
    fontWeight: "700",
  },
  locationLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 1,
  },
  postLocation: {
    color: "#718095",
    fontSize: 10,
    lineHeight: 13,
  },
  moreButton: {
    width: 28,
    height: 34,
    justifyContent: "center",
    alignItems: "center",
  },
  postImage: {
    width: "100%",
    aspectRatio: 870 / 523,
    backgroundColor: "#E6EDF3",
  },
  postDetails: {
    paddingHorizontal: 9,
    paddingTop: 5,
    paddingBottom: 3,
  },
  caption: {
    color: "#1C2733",
    fontSize: 12,
    lineHeight: 14,
  },
  hashtagRow: {
    flexDirection: "row",
    gap: 7,
    marginTop: 2,
  },
  hashtag: {
    color: "#2879E8",
    fontSize: 11.5,
    lineHeight: 13,
  },
  postActions: {
    flexDirection: "row",
    alignItems: "center",
    height: 26,
    marginTop: 1,
  },
  actionButton: {
    height: 28,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginRight: 16,
  },
  actionCount: {
    color: "#1C2733",
    fontSize: 11,
  },
  actionSpacer: {
    flex: 1,
  },
  saveButton: {
    height: 28,
    width: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  signOutLink: {
    alignSelf: "center",
    paddingVertical: 12,
  },
  signOutText: {
    color: "#8B96A4",
    fontSize: 10,
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.98)",
    borderTopWidth: 1,
    borderTopColor: "#E8EDF2",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: 4,
  },
  tabRow: {
    height: 35,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
  },
  tabLabel: {
    color: "#7C8998",
    fontSize: 9,
    lineHeight: 12,
  },
  activeTabLabel: {
    color: "#111923",
    fontWeight: "600",
  },
  createButton: {
    position: "absolute",
    left: "50%",
    top: -31,
    marginLeft: -16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#101923",
    alignItems: "center",
    justifyContent: "center",
  },
  createSlot: {
    flex: 1,
  },
  homeIndicator: {
    height: 20,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 8,
  },
  homeIndicatorPill: {
    width: 94,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#111923",
  },
});
