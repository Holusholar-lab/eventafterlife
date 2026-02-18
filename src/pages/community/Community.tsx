import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Search, MessageSquare, Eye, Pin, ThumbsUp, Bookmark, Flag, ArrowLeft, Bold, Italic, Link as LinkIcon, Image as ImageIcon, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { getCurrentUser, getCurrentUserAsync, waitForAuth } from "@/lib/auth";
import { formatDistanceToNow } from "date-fns";

interface Discussion {
  id: string;
  title: string;
  author: string;
  authorId: string;
  category: string;
  content: string;
  replies: number;
  views: number;
  likes: number;
  tags: string[];
  createdAt: number;
  lastReplyAt: number;
  lastReplyBy: string;
  pinned: boolean;
}

interface Reply {
  id: string;
  discussionId: string;
  author: string;
  authorId: string;
  content: string;
  createdAt: number;
  likes: number;
  parentId?: string; // For nested replies
}

// Mock data - in production this would come from Supabase
const mockDiscussions: Discussion[] = [
  {
    id: "1",
    title: "How to implement feedback loops in teams",
    author: "john_doe",
    authorId: "user1",
    category: "Leadership",
    content: "I recently attended the Leadership Summit and learned about continuous feedback systems. I'm curious how others are implementing this in their organizations. What's worked for you?",
    replies: 45,
    views: 320,
    likes: 24,
    tags: ["Leadership", "Management", "Teams"],
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    lastReplyAt: Date.now() - 5 * 60 * 1000,
    lastReplyBy: "jane_smith",
    pinned: true,
  },
  {
    id: "2",
    title: "Strategies for digital transformation",
    author: "tech_guru",
    authorId: "user2",
    category: "Innovation",
    content: "Digital transformation is crucial for staying competitive. Let's discuss best practices and common pitfalls.",
    replies: 23,
    views: 180,
    likes: 15,
    tags: ["Innovation", "Technology"],
    createdAt: Date.now() - 1 * 60 * 60 * 1000,
    lastReplyAt: Date.now() - 1 * 60 * 60 * 1000,
    lastReplyBy: "innovator",
    pinned: false,
  },
];

const mockReplies: Reply[] = [
  {
    id: "r1",
    discussionId: "1",
    author: "jane_smith",
    authorId: "user3",
    content: "Great question! We've been using weekly 1-on-1s and it's made a huge difference. The key is consistency and making sure feedback flows both ways.",
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    likes: 12,
  },
  {
    id: "r2",
    discussionId: "1",
    author: "john_doe",
    authorId: "user1",
    content: "Thanks! How often do you do these?",
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    likes: 3,
    parentId: "r1",
  },
];

const categories = [
  {
    id: "leadership",
    name: "Leadership & Management",
    icon: "🎯",
    description: "Discussions on leading teams, management...",
    discussions: 245,
    posts: 1200,
    lastActivity: Date.now() - 2 * 60 * 1000,
  },
  {
    id: "politics",
    name: "Politics & Governance",
    icon: "🏛️",
    description: "Policy, governance, civic engagement...",
    discussions: 189,
    posts: 890,
    lastActivity: Date.now() - 15 * 60 * 1000,
  },
  {
    id: "innovation",
    name: "Innovation & Tech",
    icon: "💡",
    description: "Technology, innovation, digital transformation...",
    discussions: 156,
    posts: 678,
    lastActivity: Date.now() - 30 * 60 * 1000,
  },
];

const Community = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [discussions, setDiscussions] = useState<Discussion[]>(mockDiscussions);
  const [replies, setReplies] = useState<Record<string, Reply[]>>({ "1": mockReplies });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "replies">("latest");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [likedDiscussions, setLikedDiscussions] = useState<Set<string>>(new Set());
  const [likedReplies, setLikedReplies] = useState<Set<string>>(new Set());
  const [savedDiscussions, setSavedDiscussions] = useState<Set<string>>(new Set());
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("leadership");
  const [newPostTags, setNewPostTags] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Wait for auth initialization, then check authentication
    const checkAuth = async () => {
      // First wait for auth to initialize
      await waitForAuth();
      
      // Check if user exists
      const currentUser = getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        if (id === "new") {
          setNewPostOpen(true);
        }
        return;
      }
      
      // Try async load from Supabase
      const loadedUser = await getCurrentUserAsync();
      if (loadedUser) {
        setUser(loadedUser);
        if (id === "new") {
          setNewPostOpen(true);
        }
      } else {
        // No user found, redirect to login
        const redirectPath = id ? `/community/${id}` : "/community";
        navigate(`/login?redirect=${encodeURIComponent(redirectPath)}`, { replace: true });
      }
    };

    checkAuth();
  }, [id, navigate]);

  // Show loading or redirect if no user
  if (!user) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please sign in to access discussions</p>
          <p className="text-sm text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim() || !user) return;

    const tags = newPostTags.split(",").map((t) => t.trim()).filter(Boolean);
    const newDiscussion: Discussion = {
      id: `disc_${Date.now()}`,
      title: newPostTitle.trim(),
      author: user.fullName.split(" ")[0].toLowerCase() + "_" + user.fullName.split(" ")[1]?.slice(0, 3) || "user",
      authorId: user.id,
      category: categories.find((c) => c.id === newPostCategory)?.name || "Leadership",
      content: newPostContent.trim(),
      replies: 0,
      views: 0,
      likes: 0,
      tags: tags.length > 0 ? tags : [newPostCategory],
      createdAt: Date.now(),
      lastReplyAt: Date.now(),
      lastReplyBy: "",
      pinned: false,
    };

    setDiscussions((prev) => [newDiscussion, ...prev]);
    setNewPostTitle("");
    setNewPostContent("");
    setNewPostTags("");
    setNewPostOpen(false);
    navigate("/community");
  };

  // If viewing a specific discussion
  if (id && id !== "new") {
    const discussion = discussions.find((d) => d.id === id);
    if (!discussion) {
      return (
        <div className="pt-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Discussion not found</p>
            <Button onClick={() => navigate("/community")}>Back to Discussions</Button>
          </div>
        </div>
      );
    }

    const discussionReplies = replies[discussion.id] || [];
    const topLevelReplies = discussionReplies.filter((r) => !r.parentId);
    const nestedReplies = (parentId: string) => discussionReplies.filter((r) => r.parentId === parentId);

    return (
      <div className="pt-16 min-h-screen bg-background">
        <div className="container max-w-4xl px-4 py-8">
          {/* Back Button */}
          <Button variant="ghost" onClick={() => navigate("/community")} className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Forums
          </Button>

          {/* Discussion Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {discussion.pinned && <Pin className="w-4 h-4 text-primary" />}
                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">{discussion.title}</h1>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {discussion.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
            {discussion.pinned && (
              <Button variant="outline" size="sm" className="gap-2">
                <Pin className="w-4 h-4" />
                Pinned
              </Button>
            )}
          </div>

          {/* Original Post */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                    {discussion.author.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-foreground">@{discussion.author}</span>
                    <span className="text-sm text-muted-foreground">
                      Posted {formatDistanceToNow(new Date(discussion.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">
                    Member since {new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", year: "numeric" })} • 45 posts
                  </div>
                  <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">{discussion.content}</div>
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                    <Button variant="ghost" size="sm" className="gap-2" onClick={() => {
                      const newSet = new Set(likedDiscussions);
                      if (newSet.has(discussion.id)) newSet.delete(discussion.id);
                      else newSet.add(discussion.id);
                      setLikedDiscussions(newSet);
                    }}>
                      <ThumbsUp className={`w-4 h-4 ${likedDiscussions.has(discussion.id) ? "fill-current" : ""}`} />
                      {discussion.likes + (likedDiscussions.has(discussion.id) ? 1 : 0)} Likes
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Reply
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2"
                      onClick={() => {
                        const newSet = new Set(savedDiscussions);
                        if (newSet.has(discussion.id)) newSet.delete(discussion.id);
                        else newSet.add(discussion.id);
                        setSavedDiscussions(newSet);
                      }}
                    >
                      <Bookmark className={`w-4 h-4 ${savedDiscussions.has(discussion.id) ? "fill-current" : ""}`} />
                      Save
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2 text-destructive hover:text-destructive">
                      <Flag className="w-4 h-4" />
                      Report
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Replies Section */}
          <div className="mb-6">
            <h2 className="font-display text-xl font-bold text-foreground mb-4">
              {discussionReplies.length} {discussionReplies.length === 1 ? "Reply" : "Replies"}:
            </h2>
            <div className="space-y-4">
              {topLevelReplies.map((reply) => (
                <div key={reply.id}>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                            {reply.author.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-sm text-foreground">@{reply.author}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          <div className="text-sm text-foreground whitespace-pre-wrap mb-3">{reply.content}</div>
                          <div className="flex items-center gap-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 gap-1 text-xs"
                              onClick={() => {
                                const newSet = new Set(likedReplies);
                                if (newSet.has(reply.id)) newSet.delete(reply.id);
                                else newSet.add(reply.id);
                                setLikedReplies(newSet);
                              }}
                            >
                              <ThumbsUp className={`w-3 h-3 ${likedReplies.has(reply.id) ? "fill-current" : ""}`} />
                              {reply.likes + (likedReplies.has(reply.id) ? 1 : 0)} Likes
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => setReplyingTo(replyingTo === reply.id ? null : reply.id)}
                            >
                              Reply
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive">
                              Report
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Nested Replies */}
                  {nestedReplies(reply.id).length > 0 && (
                    <div className="ml-12 mt-2 space-y-2">
                      {nestedReplies(reply.id).map((nested) => (
                        <Card key={nested.id} className="border-l-2 border-primary/30">
                          <CardContent className="pt-4">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-7 w-7">
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                  {nested.author.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-xs text-foreground">@{nested.author}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(nested.createdAt), { addSuffix: true })}
                                  </span>
                                </div>
                                <div className="text-xs text-foreground whitespace-pre-wrap">{nested.content}</div>
                                <div className="flex items-center gap-2 mt-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 gap-1 text-xs px-2"
                                    onClick={() => {
                                      const newSet = new Set(likedReplies);
                                      if (newSet.has(nested.id)) newSet.delete(nested.id);
                                      else newSet.add(nested.id);
                                      setLikedReplies(newSet);
                                    }}
                                  >
                                    <ThumbsUp className={`w-3 h-3 ${likedReplies.has(nested.id) ? "fill-current" : ""}`} />
                                    {nested.likes + (likedReplies.has(nested.id) ? 1 : 0)}
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-6 text-xs px-2">Reply</Button>
                                  <Button variant="ghost" size="sm" className="h-6 text-xs px-2 text-destructive hover:text-destructive">
                                    Report
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Reply Form (nested) */}
                  {replyingTo === reply.id && (
                    <div className="ml-12 mt-2">
                      <Card>
                        <CardContent className="pt-4">
                          <Textarea
                            placeholder="Write your reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="min-h-[80px] mb-3"
                          />
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Bold">
                                <Bold className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Italic">
                                <Italic className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Link">
                                <LinkIcon className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Image">
                                <ImageIcon className="w-4 h-4" />
                              </Button>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => {
                                if (!replyText.trim() || !user) return;
                                const newReply: Reply = {
                                  id: `r_${Date.now()}`,
                                  discussionId: discussion.id,
                                  author: user.fullName.split(" ")[0].toLowerCase() + "_" + user.fullName.split(" ")[1]?.slice(0, 3) || "user",
                                  authorId: user.id,
                                  content: replyText.trim(),
                                  createdAt: Date.now(),
                                  likes: 0,
                                  parentId: reply.id,
                                };
                                setReplies((prev) => ({
                                  ...prev,
                                  [discussion.id]: [...(prev[discussion.id] || []), newReply],
                                }));
                                setReplyText("");
                                setReplyingTo(null);
                              }}
                              disabled={!replyText.trim() || !user}
                            >
                              <Send className="w-4 h-4 mr-2" />
                              Post Reply
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Reply Form */}
          <Card>
            <CardContent className="pt-6">
              {!user ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Sign in to reply to this discussion</p>
                  <Button onClick={() => navigate("/login?redirect=/community/" + id)}>Sign In</Button>
                </div>
              ) : (
                <>
                  <Textarea
                    placeholder="Write your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="min-h-[120px] mb-3"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Bold">
                        <Bold className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Italic">
                        <Italic className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Link">
                        <LinkIcon className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Image">
                        <ImageIcon className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      onClick={() => {
                        if (!replyText.trim()) return;
                        const newReply: Reply = {
                          id: `r_${Date.now()}`,
                          discussionId: discussion.id,
                          author: user.fullName.split(" ")[0].toLowerCase() + "_" + user.fullName.split(" ")[1]?.slice(0, 3) || "user",
                          authorId: user.id,
                          content: replyText.trim(),
                          createdAt: Date.now(),
                          likes: 0,
                        };
                        setReplies((prev) => ({
                          ...prev,
                          [discussion.id]: [...(prev[discussion.id] || []), newReply],
                        }));
                        setDiscussions((prev) =>
                          prev.map((d) => (d.id === discussion.id ? { ...d, replies: d.replies + 1, lastReplyAt: Date.now(), lastReplyBy: newReply.author } : d))
                        );
                        setReplyText("");
                      }}
                      disabled={!replyText.trim()}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Post Reply
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main Community Page
  const filteredDiscussions = useMemo(() => {
    let result = [...discussions];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.content.toLowerCase().includes(q) ||
          d.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (filterCategory !== "all") {
      result = result.filter((d) => d.category.toLowerCase() === filterCategory.toLowerCase());
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "popular") return b.likes - a.likes;
      if (sortBy === "replies") return b.replies - a.replies;
      return b.lastReplyAt - a.lastReplyAt; // Latest activity
    });

    return result;
  }, [discussions, searchQuery, filterCategory, sortBy]);

  return (
    <div className="pt-16 min-h-screen bg-background">
      {/* Header */}
      <section className="bg-primary py-6 sm:py-8 border-b border-primary/20">
        <div className="container px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
                COMMUNITY DISCUSSIONS
              </h1>
              <p className="text-primary-foreground/80 text-sm sm:text-base">Connect, share insights, and learn together</p>
            </div>
            <Button onClick={() => navigate("/community/new")} className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              New Post
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-background/50 border-primary-foreground/20 text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </section>

      <div className="container px-4 py-8">
        {/* Categories */}
        <div className="mb-8">
          <h2 className="font-display text-xl font-bold text-foreground mb-4">Categories:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <Card
                key={cat.id}
                className="hover:border-primary/40 transition-colors cursor-pointer"
                onClick={() => setFilterCategory(cat.id)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <span className="text-2xl">{cat.icon}</span>
                      <h3 className="font-semibold text-foreground">{cat.name}</h3>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implement follow functionality
                      }}
                    >
                      Follow
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{cat.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{cat.discussions} discussions</span>
                    <span>•</span>
                    <span>{cat.posts} posts</span>
                    <span>•</span>
                    <span>Last: {formatDistanceToNow(new Date(cat.lastActivity), { addSuffix: true })}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Discussions */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="font-display text-xl font-bold text-foreground">Recent Discussions:</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Latest Activity</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="replies">Most Replies</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Filter:</span>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {filteredDiscussions.map((discussion) => (
              <Card
                key={discussion.id}
                onClick={() => navigate(`/community/${discussion.id}`)}
                className="cursor-pointer hover:border-primary/40 transition-colors"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3 mb-3">
                    {discussion.pinned && <Pin className="w-4 h-4 text-primary shrink-0 mt-1" />}
                    <h3 className="font-display font-semibold text-lg text-foreground flex-1">
                      {discussion.title}
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                    <span>By @{discussion.author}</span>
                    <span>in {discussion.category}</span>
                    <span>•</span>
                    <span>{discussion.replies} replies</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {discussion.views}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      Last reply by @{discussion.lastReplyBy} {formatDistanceToNow(new Date(discussion.lastReplyAt), { addSuffix: true })}
                    </div>
                    <div className="flex gap-1">
                      {discussion.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredDiscussions.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No discussions found.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* New Post Dialog */}
      <Dialog open={newPostOpen} onOpenChange={(open) => {
        setNewPostOpen(open);
        if (!open) navigate("/community");
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Discussion</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="post-title">Title</Label>
              <Input
                id="post-title"
                placeholder="Enter discussion title"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="post-category">Category</Label>
              <Select value={newPostCategory} onValueChange={setNewPostCategory}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="post-content">Content</Label>
              <Textarea
                id="post-content"
                placeholder="Write your discussion content..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="mt-1 min-h-[200px]"
              />
            </div>
            <div>
              <Label htmlFor="post-tags">Tags (comma-separated)</Label>
              <Input
                id="post-tags"
                placeholder="e.g., Leadership, Management, Teams"
                value={newPostTags}
                onChange={(e) => setNewPostTags(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setNewPostOpen(false);
              navigate("/community");
            }}>
              Cancel
            </Button>
            <Button onClick={handleCreatePost} disabled={!newPostTitle.trim() || !newPostContent.trim()}>
              Post Discussion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Community;
