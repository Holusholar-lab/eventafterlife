import speaker1 from "@/assets/speaker-1.jpg";
import speaker2 from "@/assets/speaker-2.jpg";
import speaker3 from "@/assets/speaker-3.jpg";
import speaker4 from "@/assets/speaker-4.jpg";

export const videos = [
  {
    id: "1",
    title: "People Who Deliver: Execution & Performance",
    description: "Discover the mindset and strategies behind leaders who consistently deliver results.",
    image: speaker1,
    category: "Leadership",
    duration: "45 min",
    price: "$4.99 / 48hrs",
  },
  {
    id: "2",
    title: "Building People: Leadership & Creativity",
    description: "How to nurture talent, foster creativity, and build high-performing teams.",
    image: speaker2,
    category: "Management",
    duration: "38 min",
    price: "$3.99 / 48hrs",
  },
  {
    id: "3",
    title: "Rewiring Systems: Policy & Governance",
    description: "Exploring how systemic change can reshape organizations and communities.",
    image: speaker3,
    category: "Strategy",
    duration: "52 min",
    price: "$5.99 / 48hrs",
  },
  {
    id: "4",
    title: "The Future of Work & Innovation",
    description: "A deep dive into emerging trends shaping the modern workplace.",
    image: speaker4,
    category: "Innovation",
    duration: "41 min",
    price: "$4.99 / 48hrs",
  },
  {
    id: "5",
    title: "Emotional Intelligence in Leadership",
    description: "Why EQ matters more than IQ for effective leadership in today's world.",
    image: speaker1,
    category: "Leadership",
    duration: "35 min",
    price: "$3.99 / 48hrs",
  },
  {
    id: "6",
    title: "Scaling Culture Across Borders",
    description: "How global organizations maintain culture while expanding internationally.",
    image: speaker4,
    category: "Management",
    duration: "47 min",
    price: "$5.99 / 48hrs",
  },
];

export const categories = ["All", "Leadership", "Management", "Strategy", "Innovation"];

export const forumPosts = [
  {
    id: "1",
    title: "Key takeaways from 'People Who Deliver'",
    author: "Adaeze M.",
    avatar: speaker1,
    timeAgo: "2 hours ago",
    replies: 12,
    likes: 34,
    excerpt: "Just finished watching the session and I'm blown away by the framework for execution...",
    tags: ["Leadership", "Discussion"],
  },
  {
    id: "2",
    title: "How do you apply 'Rewiring Systems' in a startup context?",
    author: "Chidi O.",
    avatar: speaker2,
    timeAgo: "5 hours ago",
    replies: 8,
    likes: 21,
    excerpt: "The governance models discussed seem more suited for large orgs. How would you adapt them?",
    tags: ["Strategy", "Question"],
  },
  {
    id: "3",
    title: "Building a creativity-first culture — my experience",
    author: "Funke A.",
    avatar: speaker3,
    timeAgo: "1 day ago",
    replies: 19,
    likes: 56,
    excerpt: "After watching the Building People session, I tried implementing some ideas in my team...",
    tags: ["Management", "Experience"],
  },
  {
    id: "4",
    title: "Book recommendations from the Innovation panel",
    author: "Tunde K.",
    avatar: speaker4,
    timeAgo: "2 days ago",
    replies: 25,
    likes: 72,
    excerpt: "The panelists mentioned several books. Here's the complete list with my notes on each...",
    tags: ["Innovation", "Resources"],
  },
];
