import { useEffect, useState, useRef } from "react";
import { MessageSquare, Heart, Tag, ChevronRight, List, ListOrdered, AlignJustify, Type } from "lucide-react";
import speaker1 from "@/assets/speaker-1.jpg";
import speaker2 from "@/assets/speaker-2.jpg";
import speaker3 from "@/assets/speaker-3.jpg";
import speaker4 from "@/assets/speaker-4.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Comment {
  id: string;
  author: string;
  text: string;
  timeAgo: string;
}

interface ForumPost {
  id: string;
  title: string;
  author: string;
  avatar: string;
  timeAgo: string;
  replies: number;
  likes: number;
  excerpt: string;
  tags: string[];
  category: string;
  content?: string; // full content for display
}

// Initial forum posts with categories
const initialPosts: ForumPost[] = [
  { id: "1", title: "Key takeaways from 'People Who Deliver'", author: "Adaeze M.", avatar: speaker1, timeAgo: "2 hours ago", replies: 12, likes: 34, excerpt: "Just finished watching the session and I'm blown away by the framework for execution...", tags: ["Leadership", "Discussion"], category: "Leadership" },
  { id: "2", title: "How do you apply 'Rewiring Systems' in a startup context?", author: "Chidi O.", avatar: speaker2, timeAgo: "5 hours ago", replies: 8, likes: 21, excerpt: "The governance models discussed seem more suited for large orgs. How would you adapt them?", tags: ["Strategy", "Question"], category: "Politics" },
  { id: "3", title: "Building a creativity-first culture — my experience", author: "Funke A.", avatar: speaker3, timeAgo: "1 day ago", replies: 19, likes: 56, excerpt: "After watching the Building People session, I tried implementing some ideas in my team...", tags: ["Management", "Experience"], category: "Business" },
  { id: "4", title: "Book recommendations from the Innovation panel", author: "Tunde K.", avatar: speaker4, timeAgo: "2 days ago", replies: 25, likes: 72, excerpt: "The panelists mentioned several books. Here's the complete list with my notes on each...", tags: ["Innovation", "Resources"], category: "Business" },
  { id: "5", title: "Work-life balance in the modern world", author: "Sarah L.", avatar: speaker1, timeAgo: "3 hours ago", replies: 15, likes: 42, excerpt: "How do you maintain balance while pursuing career growth? Let's share strategies...", tags: ["Lifestyle", "Wellness"], category: "Lifestyle" },
  { id: "6", title: "Effective leadership in remote teams", author: "Michael T.", avatar: speaker2, timeAgo: "6 hours ago", replies: 22, likes: 58, excerpt: "Managing distributed teams requires different skills. What's worked for you?", tags: ["Leadership", "Remote Work"], category: "Leadership" },
  { id: "7", title: "Policy changes affecting small businesses", author: "Amina B.", avatar: speaker3, timeAgo: "1 day ago", replies: 18, likes: 45, excerpt: "Recent policy updates that entrepreneurs should be aware of...", tags: ["Politics", "Business"], category: "Politics" },
  { id: "8", title: "Sustainable living practices", author: "David K.", avatar: speaker4, timeAgo: "2 days ago", replies: 31, likes: 89, excerpt: "Simple changes we can make for a more sustainable lifestyle...", tags: ["Lifestyle", "Sustainability"], category: "Lifestyle" },
  { id: "9", title: "Scaling your startup: Lessons learned", author: "Grace O.", avatar: speaker1, timeAgo: "4 hours ago", replies: 14, likes: 38, excerpt: "From 5 to 50 employees - what I wish I knew earlier...", tags: ["Business", "Startup"], category: "Business" },
  { id: "10", title: "Inspiring the next generation of leaders", author: "James M.", avatar: speaker2, timeAgo: "8 hours ago", replies: 27, likes: 64, excerpt: "Mentorship programs and how they shape future leaders...", tags: ["Leadership", "Mentorship"], category: "Leadership" },
];

const categoryTabs = ["All", "Leadership", "Business", "Politics", "Lifestyle"];

const avatars = [speaker1, speaker2, speaker3, speaker4];

function NewPostEditor({
  open,
  onOpenChange,
  onSubmit,
  category,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (topic: string, content: string) => void;
  category: string;
}) {
  const [topic, setTopic] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  const execCmd = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    contentRef.current?.focus();
  };

  useEffect(() => {
    if (open && contentRef.current) {
      contentRef.current.innerHTML = "";
      contentRef.current.focus();
      document.execCommand("fontName", false, "Times New Roman");
    }
  }, [open]);

  const handleSubmit = () => {
    const content = contentRef.current?.innerHTML ?? "";
    if (!topic.trim()) return;
    onSubmit(topic.trim(), content);
    setTopic("");
    if (contentRef.current) contentRef.current.innerHTML = "";
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Post in {category}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              placeholder="Enter post topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="mt-1 font-display"
            />
          </div>
          <div>
            <Label>Content</Label>
            {/* Formatting toolbar */}
            <div className="flex flex-wrap gap-1 p-2 border border-border rounded-t-md bg-secondary">
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => execCmd("fontName", "Times New Roman")} title="Times New Roman">
                <Type className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => execCmd("justifyFull")} title="Justify">
                <AlignJustify className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => execCmd("insertUnorderedList")} title="Bullet list">
                <List className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => execCmd("insertOrderedList")} title="Numbered list">
                <ListOrdered className="h-4 w-4" />
              </Button>
            </div>
            <div
              ref={contentRef}
              contentEditable
              className="min-h-[200px] w-full rounded-b-md border border-t-0 border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground"
              style={{ fontFamily: "Times New Roman, serif" }}
              data-placeholder="Write your post content..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!topic.trim()}>Post</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const Community = () => {
  const [posts, setPosts] = useState<ForumPost[]>(initialPosts);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [commentOpenForId, setCommentOpenForId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getFilteredPosts = () => {
    if (activeCategory === "All") return posts;
    return posts.filter((post) => post.category === activeCategory);
  };

  const filteredPosts = getFilteredPosts();
  const displayedPosts = showAllPosts ? filteredPosts : filteredPosts.slice(0, 6);

  const handleNewPost = (topic: string, content: string) => {
    const excerpt = content.replace(/<[^>]*>/g, "").slice(0, 80) + (content.length > 80 ? "..." : "");
    const newPost: ForumPost = {
      id: `post_${Date.now()}`,
      title: topic,
      author: "You",
      avatar: avatars[Math.floor(Math.random() * avatars.length)],
      timeAgo: "Just now",
      replies: 0,
      likes: 0,
      excerpt,
      tags: [activeCategory],
      category: activeCategory,
      content,
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleLike = (postId: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };

  const getLikeCount = (post: ForumPost) => {
    const delta = likedIds.has(post.id) ? 1 : 0;
    return post.likes + delta;
  };

  const handleCommentClick = (postId: string) => {
    setCommentOpenForId((prev) => (prev === postId ? null : postId));
    setCommentText("");
  };

  const handleCommentSubmit = (postId: string) => {
    if (!commentText.trim()) return;
    const newComment: Comment = {
      id: `c_${Date.now()}`,
      author: "You",
      text: commentText.trim(),
      timeAgo: "Just now",
    };
    setComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment],
    }));
    setCommentText("");
    setCommentOpenForId(null);
    // Bump reply count for post
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, replies: p.replies + 1 } : p))
    );
  };

  const getReplyCount = (post: ForumPost) => {
    const extra = (comments[post.id] || []).length;
    return post.replies + extra;
  };

  return (
    <div className="pt-16">
      <section className="bg-primary py-12">
        <div className="container text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-2">Community</h1>
          <p className="text-primary-foreground/80 text-sm">Discuss, learn, and grow together</p>
        </div>
      </section>

      <section className="container py-10 max-w-5xl">
        <div className="bg-secondary px-4 py-5 rounded-t-lg border border-border border-b border-b-primary">
          <div className="flex flex-wrap gap-3">
            {categoryTabs.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    setShowAllPosts(false);
                  }}
                  className={`px-5 py-2.5 rounded-full text-sm font-display font-medium transition-colors border ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {category === "All" ? "All discussions" : category}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-card border border-t-0 border-border rounded-b-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold text-foreground">
              {activeCategory === "All" ? "All Discussions" : activeCategory}
            </h2>
            {activeCategory !== "All" && (
              <Button
                onClick={() => setNewPostOpen(true)}
                className="rounded-full"
              >
                New Post
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {displayedPosts.map((post) => (
              <article
                key={post.id}
                className="bg-secondary border border-border rounded-lg p-5 hover:border-primary/30 transition-colors group"
              >
                <div className="flex gap-4">
                  <img
                    src={post.avatar}
                    alt={post.author}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors text-sm mb-1">
                      {post.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-3">{post.excerpt}</p>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs text-muted-foreground">{post.author}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{post.timeAgo}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <button
                        type="button"
                        onClick={() => handleCommentClick(post.id)}
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        <MessageSquare className="w-3 h-3" /> {getReplyCount(post)}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLike(post.id)}
                        className={`inline-flex items-center gap-1 text-xs transition-colors ${
                          likedIds.has(post.id) ? "text-primary" : "text-muted-foreground hover:text-primary"
                        }`}
                      >
                        <Heart className={`w-3 h-3 ${likedIds.has(post.id) ? "fill-current" : ""}`} /> {getLikeCount(post)}
                      </button>
                      <div className="flex gap-1.5 ml-auto">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-background text-foreground rounded"
                          >
                            <Tag className="w-2.5 h-2.5" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments list */}
                {(comments[post.id]?.length ?? 0) > 0 && (
                  <div className="mt-4 pl-14 space-y-2 border-l-2 border-border">
                    {(comments[post.id] || []).map((c) => (
                      <div key={c.id} className="text-xs text-muted-foreground pl-3">
                        <span className="font-medium text-foreground">{c.author}</span> · {c.timeAgo}
                        <p className="text-foreground mt-0.5">{c.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment input */}
                {commentOpenForId === post.id && (
                  <div className="mt-4 pl-14 flex gap-2">
                    <Input
                      placeholder="Write a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleCommentSubmit(post.id)}
                      className="flex-1"
                    />
                    <Button size="sm" onClick={() => handleCommentSubmit(post.id)} disabled={!commentText.trim()}>
                      Reply
                    </Button>
                  </div>
                )}
              </article>
            ))}
          </div>

          {filteredPosts.length > 6 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowAllPosts(!showAllPosts)}
                className="text-sm text-primary hover:underline flex items-center gap-1 mx-auto"
              >
                {showAllPosts ? "Show less" : `View All (${filteredPosts.length})`}
                <ChevronRight className={`w-4 h-4 transition-transform ${showAllPosts ? "rotate-90" : ""}`} />
              </button>
            </div>
          )}
        </div>
      </section>

      <NewPostEditor
        open={newPostOpen}
        onOpenChange={setNewPostOpen}
        onSubmit={handleNewPost}
        category={activeCategory}
      />
    </div>
  );
};

export default Community;
