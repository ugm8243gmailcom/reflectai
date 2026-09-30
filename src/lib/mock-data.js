export const MOODS = [
  { id: "happy", emoji: "😊", label: "Happy", color: "text-mood-happy" },
  { id: "calm", emoji: "😌", label: "Calm", color: "text-mood-calm" },
  { id: "neutral", emoji: "😐", label: "Neutral", color: "text-mood-neutral" },
  { id: "sad", emoji: "😔", label: "Sad", color: "text-mood-sad" },
  { id: "angry", emoji: "😡", label: "Angry", color: "text-mood-angry" },
];
export const moodBg = {
  happy: "bg-mood-happy/15 text-mood-happy",
  calm: "bg-mood-calm/15 text-mood-calm",
  neutral: "bg-mood-neutral/15 text-mood-neutral",
  sad: "bg-mood-sad/15 text-mood-sad",
  angry: "bg-mood-angry/15 text-mood-angry",
};
export const ENTRIES = [
  {
    id: "e1",
    title: "The quiet before the storm",
    excerpt:
      "Today was surprisingly calm despite the upcoming product launch. I spent thirty minutes by the window watching the rain settle on the rooftops…",
    content:
      "Today was surprisingly calm despite the upcoming product launch. I spent thirty minutes by the window watching the rain settle on the rooftops. There's something grounding about weather you can't control.\n\nI noticed I wasn't reaching for my phone as much. Maybe that's progress.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    mood: "calm",
    tags: ["mindfulness", "career"],
    pinned: true,
  },
  {
    id: "e2",
    title: "Long run, longer thoughts",
    excerpt:
      "Pushed past the 10k mark this morning. The first three kilometers always feel impossible, then the body forgets to argue…",
    content:
      "Pushed past the 10k mark this morning. The first three kilometers always feel impossible, then the body forgets to argue. By kilometer eight I had outlined the entire roadmap for Q1 in my head.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    mood: "happy",
    tags: ["fitness", "running"],
    favorite: true,
  },
  {
    id: "e3",
    title: "Conversation with Mom",
    excerpt:
      "Called her after dinner. She mentioned the garden looks tired this year. I don't know why that line stayed with me…",
    content:
      "Called her after dinner. She mentioned the garden looks tired this year. I don't know why that line stayed with me. Sometimes the smallest things carry the most weight.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(),
    mood: "sad",
    tags: ["family", "relationships"],
  },
  {
    id: "e4",
    title: "Shipping day",
    excerpt: "Pushed the new pricing page live. Three months of work. Now we wait and listen…",
    content: "Pushed the new pricing page live. Three months of work. Now we wait and listen.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 80).toISOString(),
    mood: "happy",
    tags: ["career", "shipping"],
  },
  {
    id: "e5",
    title: "Too many tabs, too few answers",
    excerpt: "Felt scattered all day. Twelve tabs open, nothing actually moved forward…",
    content:
      "Felt scattered all day. Twelve tabs open, nothing actually moved forward. Need to start tomorrow with the worst task first.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 110).toISOString(),
    mood: "neutral",
    tags: ["focus", "career"],
  },
  {
    id: "e6",
    title: "Late night re-read of old notes",
    excerpt:
      "Found a journal entry from two Decembers ago. I was worried about the exact same things…",
    content:
      "Found a journal entry from two Decembers ago. I was worried about the exact same things — and none of them happened.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 140).toISOString(),
    mood: "calm",
    tags: ["reflection"],
    favorite: true,
  },
];
export const HABITS = [
  {
    id: "h1",
    name: "Morning Meditation",
    emoji: "🧘",
    streak: 14,
    progress: 80,
    color: "emerald",
    doneToday: true,
  },
  {
    id: "h2",
    name: "Drink 2L Water",
    emoji: "💧",
    streak: 6,
    progress: 60,
    color: "blue",
    doneToday: false,
  },
  {
    id: "h3",
    name: "Read 30 min",
    emoji: "📖",
    streak: 22,
    progress: 90,
    color: "violet",
    doneToday: true,
  },
  {
    id: "h4",
    name: "Run",
    emoji: "🏃",
    streak: 4,
    progress: 55,
    color: "orange",
    doneToday: false,
  },
  {
    id: "h5",
    name: "No phone after 10pm",
    emoji: "🌙",
    streak: 9,
    progress: 70,
    color: "blue",
    doneToday: false,
  },
];
export const GOALS = [
  {
    id: "g1",
    title: "Run a Half Marathon",
    description: "Train consistently and finish under 2 hours.",
    targetDate: "2026-04-12",
    progress: 62,
    category: "Fitness",
  },
  {
    id: "g2",
    title: "Ship ReflectAI v1",
    description: "Launch the public beta and reach 500 users.",
    targetDate: "2026-02-28",
    progress: 78,
    category: "Career",
  },
  {
    id: "g3",
    title: "Read 20 Books",
    description: "Mix of fiction and non-fiction. Reflect on each.",
    targetDate: "2026-12-31",
    progress: 35,
    category: "Growth",
  },
  {
    id: "g4",
    title: "Visit Japan",
    description: "Two weeks in spring. Kyoto, Tokyo, Naoshima.",
    targetDate: "2026-05-01",
    progress: 20,
    category: "Life",
  },
];
export const WEEK_MOOD = [
  { day: "Mon", score: 3 },
  { day: "Tue", score: 4 },
  { day: "Wed", score: 2 },
  { day: "Thu", score: 4 },
  { day: "Fri", score: 5 },
  { day: "Sat", score: 5 },
  { day: "Sun", score: 4 },
];
export const MONTH_MOOD = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  score: Math.round(3 + Math.sin(i / 2.4) * 1.4 + (i % 5 === 0 ? -0.6 : 0.2)),
}));
export const TOPIC_BREAKDOWN = [
  { name: "Fitness", value: 35 },
  { name: "Career", value: 25 },
  { name: "Education", value: 20 },
  { name: "Relationships", value: 10 },
  { name: "Other", value: 10 },
];
export const PROMPTS = [
  "What went well today?",
  "What challenged you today?",
  "What did you learn about yourself?",
  "What will you improve tomorrow?",
  "What are you grateful for right now?",
  "What did you say no to today — and why?",
];
export const MEMORIES = [
  { id: "m1", category: "Achievements", title: "First public talk", date: "2024-09-14" },
  { id: "m2", category: "Life Lessons", title: "Patience compounds", date: "2025-01-22" },
  { id: "m3", category: "Dreams", title: "A house with a writing room", date: "2025-03-02" },
  { id: "m4", category: "Important Moments", title: "Anna said yes", date: "2025-06-18" },
  {
    id: "m5",
    category: "Favorite Memories",
    title: "Sunrise from Mount Bromo",
    date: "2024-08-30",
  },
];
export const COACH_GREETING =
  "Hi John — I've read through your entries from the last two weeks. There's a quiet pattern of focus in your mornings and tension in your late afternoons. Want to start there?";
