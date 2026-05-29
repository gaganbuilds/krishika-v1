export interface ExpertProfile {
  name: string;
  specialization: string;
  location: string;
  bio: string;
  avatarUrl?: string;
}

export interface BlogComment {
  id: string;
  userName: string;
  text: string;
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string; // using markdown-like or simple HTML strings for rendering
  expert: ExpertProfile;
  category: string;
  publishDate: string;
  readTime: number;
  imageUrl: string;
  likes: number;
  comments: BlogComment[];
  shares: number;
}

export const CATEGORIES = [
  'Crops',
  'Soil Health',
  'Market Prices',
  'Pest Management',
  'Organic Farming',
  'Irrigation',
  'Government Schemes',
  'Sustainable Farming'
];

export const mockBlogs: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Optimizing Wheat Yields in Black Soil: A Comprehensive Guide',
    excerpt: 'Discover advanced techniques for maximizing wheat production while maintaining soil health in black soil regions.',
    content: `
      <p>Wheat cultivation in black soil presents unique opportunities and challenges. The high moisture retention capacity is beneficial, but improper management can lead to waterlogging.</p>
      <h3>1. Seed Selection</h3>
      <p>Choosing the right variety is crucial. Varieties like HD 2967 and PBW 343 have shown remarkable resilience in black soil conditions.</p>
      <h3>2. Nutrient Management</h3>
      <p>Black soil is typically rich in calcium and magnesium but can be deficient in nitrogen. A balanced application of NPK (120:60:40) split across the vegetative and flowering stages ensures optimal growth.</p>
      <h3>3. Irrigation Scheduling</h3>
      <p>Due to the soil's water-holding capacity, over-irrigation must be avoided. The critical stages for irrigation are crown root initiation (CRI), late jointing, and flowering.</p>
    `,
    expert: {
      name: 'Dr. Vikram Sharma',
      specialization: 'Soil Scientist',
      location: 'Ludhiana, Punjab',
      bio: 'Dr. Sharma has over 20 years of experience researching soil dynamics and crop optimization in Northern India.',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&auto=format&fit=crop'
    },
    category: 'Soil Health',
    publishDate: '2026-05-25',
    readTime: 6,
    imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=800&auto=format&fit=crop',
    likes: 124,
    shares: 45,
    comments: [
      { id: 'c1', userName: 'Ramesh Patel', text: 'Very insightful article, thank you!', date: '2026-05-26' }
    ]
  },
  {
    id: 'blog-2',
    title: 'Natural Pest Management: The Neem Extract Method',
    excerpt: 'How to protect your crops from common pests using locally sourced neem extracts without harming beneficial insects.',
    content: `
      <p>Chemical pesticides have long been the go-to solution, but the shift towards sustainable farming brings neem back into focus. Neem extract is a broad-spectrum bio-pesticide that targets over 200 species of pests.</p>
      <h3>Preparation</h3>
      <p>To prepare a 5% Neem Seed Kernel Extract (NSKE), you need 5 kg of powdered neem seed kernels per 100 liters of water. Soak the powder overnight, filter it, and add a mild soap to help it stick to the leaves.</p>
      <h3>Application</h3>
      <p>Spray during the early morning or late evening. Direct sunlight breaks down the active ingredient, azadirachtin, too quickly.</p>
      <h3>Benefits</h3>
      <p>Unlike synthetic chemicals, neem does not instantly kill pests. Instead, it acts as an antifeedant, repellent, and growth regulator, ensuring that beneficial insects like bees and ladybugs are unharmed.</p>
    `,
    expert: {
      name: 'Anjali Desai',
      specialization: 'Crop Protection Specialist',
      location: 'Pune, Maharashtra',
      bio: 'Anjali advocates for sustainable pest control and works with farmer cooperatives to implement organic solutions.',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop'
    },
    category: 'Pest Management',
    publishDate: '2026-05-22',
    readTime: 4,
    imageUrl: 'https://images.unsplash.com/photo-1628183210338-958b4f0b24dc?q=80&w=800&auto=format&fit=crop',
    likes: 89,
    shares: 22,
    comments: []
  },
  {
    id: 'blog-3',
    title: 'Understanding Drip Irrigation Subsidies for 2026',
    excerpt: 'A complete breakdown of the latest government schemes for micro-irrigation and how you can apply.',
    content: `
      <p>Water scarcity is a growing concern, and the government is pushing hard for micro-irrigation adoption. Under the PMKSY (Pradhan Mantri Krishi Sinchayee Yojana) 2026 updates, subsidies have been increased.</p>
      <h3>What is Covered?</h3>
      <p>The scheme covers the installation of drip and sprinkler systems. Small and marginal farmers can avail up to 55% subsidy, while other farmers can get up to 45%.</p>
      <h3>How to Apply</h3>
      <p>Applications can be submitted through the state agriculture portal. You will need your Aadhaar card, land records (RTC), and a quotation from an authorized dealer.</p>
      <h3>Why Drip?</h3>
      <p>Drip irrigation saves up to 50% water compared to flood irrigation and increases yield by delivering nutrients directly to the root zone (fertigation).</p>
    `,
    expert: {
      name: 'Rajiv Menon',
      specialization: 'Agricultural Policy Analyst',
      location: 'New Delhi',
      bio: 'Rajiv breaks down complex government schemes into actionable steps for farmers across India.',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&auto=format&fit=crop'
    },
    category: 'Government Schemes',
    publishDate: '2026-05-20',
    readTime: 5,
    imageUrl: 'https://images.unsplash.com/photo-1586771107445-d3af9e170c66?q=80&w=800&auto=format&fit=crop',
    likes: 215,
    shares: 110,
    comments: [
      { id: 'c2', userName: 'Gurpreet Singh', text: 'Does this apply to leased land?', date: '2026-05-21' }
    ]
  },
  {
    id: 'blog-4',
    title: 'Global Soybean Demand: What Indian Farmers Should Know',
    excerpt: 'Market analysis on the rising global demand for soybeans and how local farmers can capitalize on the trend.',
    content: `
      <p>The global soybean market is experiencing unprecedented demand, driven by animal feed requirements and the rise of plant-based proteins. For Indian farmers, this presents a lucrative opportunity.</p>
      <h3>Market Trends</h3>
      <p>Prices at major mandis have stabilized at higher-than-average rates. The upcoming festive season is expected to drive edible oil prices up, further supporting soybean rates.</p>
      <h3>Quality Matters</h3>
      <p>To get the best prices, maintaining moisture content below 10% is critical. Buyers are increasingly strict about foreign matter and damaged seeds.</p>
    `,
    expert: {
      name: 'Priya Verma',
      specialization: 'Market Analyst',
      location: 'Indore, Madhya Pradesh',
      bio: 'Priya tracks global agricultural commodity markets and provides localized insights for farmers.',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=256&auto=format&fit=crop'
    },
    category: 'Market Prices',
    publishDate: '2026-05-18',
    readTime: 3,
    imageUrl: 'https://images.unsplash.com/photo-1590680373809-5e16dafbdb4c?q=80&w=800&auto=format&fit=crop',
    likes: 76,
    shares: 18,
    comments: []
  }
];

export const getBlogs = (): BlogPost[] => {
  return mockBlogs;
};

// Local storage helpers for interactions
export const getLocalInteractions = (blogId: string) => {
  if (typeof window === 'undefined') return { liked: false, saved: false };
  const stored = localStorage.getItem(`blog_interactions_${blogId}`);
  return stored ? JSON.parse(stored) : { liked: false, saved: false };
};

export const toggleLocalInteraction = (blogId: string, type: 'liked' | 'saved') => {
  if (typeof window === 'undefined') return;
  const current = getLocalInteractions(blogId);
  current[type] = !current[type];
  localStorage.setItem(`blog_interactions_${blogId}`, JSON.stringify(current));
  return current[type];
};
