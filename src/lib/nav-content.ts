import type { NavItem } from "@/types/content";

/**
 * Navigation content, transcribed from the live header's DOM
 * (docs/research/html/00-header.html). Labels and hrefs are verbatim —
 * the header renders `.text--eyebrow`, which uppercases them in CSS, so the
 * casing here is the source casing ("Products", not "PRODUCTS").
 */

export const PRODUCTS_MENU = [
  {
    heading: "Websites",
    links: [
      { label: "Websites", href: "/website-design" },
      { label: "Website Templates", href: "/templates" },
      { label: "AI Website Builder", href: "/websites/ai-website-builder" },
      { label: "Design Intelligence", href: "/design-intelligence" },
      { label: "Ecommerce", href: "/ecommerce-website" },
      { label: "Portfolios", href: "/websites/create-a-portfolio" },
      { label: "Blogs", href: "/websites/create-a-blog" },
      { label: "Analytics", href: "/websites/analytics" },
    ],
  },
  {
    heading: "Business",
    links: [
      { label: "Services", href: "/services" },
      { label: "Online Stores", href: "/online-stores" },
      { label: "Invoicing", href: "/invoicing" },
      { label: "Scheduling", href: "/scheduling" },
      { label: "Limited Releases", href: "/ecommerce/limited-release-selling" },
      { label: "Content & Memberships", href: "/content" },
      { label: "Donations", href: "/donations" },
      { label: "Financial Solutions", href: "/financial-solutions" },
    ],
  },
  {
    heading: "Marketing",
    links: [
      { label: "Marketing Tools", href: "/website-marketing" },
      { label: "Email Campaigns", href: "/email-marketing" },
      { label: "SMS Campaigns", href: "/sms-marketing" },
      { label: "SEO Tools", href: "/marketing/seo" },
      { label: "AI Visibility", href: "/ai-visibility" },
      { label: "Free Tools", href: "/tools" },
    ],
  },
  {
    heading: "Business Tools",
    links: [
      { label: "Domain Search", href: "https://domains.squarespace.com" },
      {
        label: "Domain Transfer",
        href: "https://domains.squarespace.com/transfer-a-domain",
      },
      { label: "Business Email", href: "/professional-email" },
      { label: "View All Features", href: "/feature-index" },
    ],
  },
  {
    heading: "For scaling businesses",
    links: [
      {
        label: "Squarespace Premium",
        href: "/premium",
        description: "Our most advanced features",
      },
      {
        label: "Squarespace for Pros",
        href: "/professionals",
        description: "Powerful enough for professionals",
      },
      {
        label: "Circle",
        href: "/circle",
        description: "The partner program for freelancers and agencies",
      },
    ],
  },
];

/**
 * Solutions is a two-pane menu: a pill rail of ten industries on the left, and
 * the selected industry's six sub-pages on the right.
 */
export const SOLUTIONS_MENU = [
  {
    heading: "Creative Services",
    href: "/solutions/creative-services",
    blurb: "Turn your passion project into a business.",
    links: [
      { label: "Photographers", href: "/solutions/creative-services/photographers" },
      { label: "Graphic Designers", href: "/solutions/creative-services/graphic-designers" },
      { label: "Artists", href: "/solutions/creative-services/artists" },
      { label: "Interior Designers", href: "/solutions/creative-services/interior-designers" },
      { label: "Architects", href: "/solutions/creative-services/architects" },
      { label: "Fashion & Apparel", href: "/solutions/creative-services/fashion-apparel" },
    ],
  },
  {
    heading: "Professional Services",
    href: "/solutions/professional-services",
    blurb: "One platform to manage your practice.",
    links: [
      { label: "Consultants", href: "/solutions/professional-services/consultants" },
      { label: "Professional Coaches", href: "/solutions/professional-services/professional-coaches" },
      { label: "Real Estate Agents", href: "/solutions/professional-services/real-estate-agents" },
      { label: "Legal Services", href: "/solutions/professional-services/legal-services" },
      { label: "Marketing Agencies", href: "/solutions/professional-services/marketing-agencies" },
      { label: "Tech & IT Services", href: "/solutions/professional-services/tech-it-services" },
    ],
  },
  {
    heading: "Education & Training",
    href: "/solutions/education",
    blurb: "Where learning meets business.",
    links: [
      { label: "Exam Prep Tutors", href: "/solutions/education/exam-prep-tutors" },
      { label: "Music Teachers", href: "/solutions/education/music-teachers" },
      { label: "Art Instruction", href: "/solutions/education/art-instruction" },
      { label: "Dance Schools", href: "/solutions/education/dance-schools" },
      { label: "Language Schools", href: "/solutions/education/language-schools" },
      { label: "Vocational Training", href: "/solutions/education/vocational-training" },
    ],
  },
  {
    heading: "Beauty",
    href: "/solutions/beauty",
    blurb: "Keep your calendar booked and your clients happy.",
    links: [
      { label: "Hair Salons", href: "/solutions/beauty/hair-salons" },
      { label: "Barbershops", href: "/solutions/beauty/barbershops" },
      { label: "Nail Studios", href: "/solutions/beauty/nail-studios" },
      { label: "Tattoos & Piercings", href: "/solutions/beauty/tattoos-piercings" },
      { label: "Makeup Artists", href: "/solutions/beauty/makeup-artists" },
      { label: "Jewelry Makers", href: "/solutions/beauty/jewelry-makers" },
    ],
  },
  {
    heading: "Sports & Fitness",
    href: "/solutions/sports",
    blurb: "Keep your classes packed.",
    links: [
      { label: "Sports Coaches", href: "/solutions/sports/sports-coaches" },
      { label: "Sporting Goods", href: "/solutions/sports/sporting-goods" },
      { label: "Fitness Centers", href: "/solutions/sports/fitness-centers" },
      { label: "Sports Camps", href: "/solutions/sports/sports-camps" },
      { label: "Personal Trainers", href: "/solutions/sports/personal-trainers" },
      { label: "Yoga Studios", href: "/solutions/sports/yoga-studios" },
    ],
  },
  {
    heading: "Health & Wellness",
    href: "/solutions/health",
    blurb: "One platform to help grow your practice.",
    links: [
      { label: "Massage Therapists", href: "/solutions/health/massage-therapists" },
      { label: "Acupuncturists", href: "/solutions/health/acupuncturists" },
      { label: "Wellness Retreats", href: "/solutions/health/wellness-retreats" },
      { label: "Recovery Centers", href: "/solutions/health/recovery-centers" },
      { label: "Nutritionists", href: "/solutions/health/nutritionists" },
      { label: "Medspas", href: "/solutions/health/medspas" },
    ],
  },
  {
    heading: "Home Services",
    href: "/solutions/home-services",
    blurb: "Book more jobs and get paid faster.",
    links: [
      { label: "Contractors", href: "/solutions/home-services/contractors" },
      { label: "Home Decor", href: "/solutions/home-services/home-decor" },
      { label: "Landscapers", href: "/solutions/home-services/landscapers" },
      { label: "Cleaning Services", href: "/solutions/home-services/cleaning-services" },
      { label: "Pet Care", href: "/solutions/home-services/pet-care" },
      { label: "Auto Repair", href: "/solutions/home-services/auto-repair" },
    ],
  },
  {
    heading: "Events & Experiences",
    href: "/solutions/events",
    blurb: "Tools to deliver great experiences.",
    links: [
      { label: "Travel Agencies", href: "/solutions/events/travel-agencies" },
      { label: "Camps", href: "/solutions/events/camps" },
      { label: "Activities", href: "/solutions/events/activities" },
      { label: "Festivals", href: "/solutions/events/festivals" },
      { label: "Concerts & Shows", href: "/solutions/events/concerts-shows" },
      { label: "Restaurants & Bars", href: "/solutions/events/restaurants-bars" },
    ],
  },
  {
    heading: "Charities & Nonprofits",
    href: "/solutions/nonprofits",
    blurb: "Inspire action, raise more.",
    links: [
      { label: "Faith Communities", href: "/solutions/nonprofits/faith-communities" },
      { label: "Philanthropy & Advocacy", href: "/solutions/nonprofits/philanthropy-advocacy" },
      { label: "Community Groups", href: "/solutions/nonprofits/community-groups" },
      { label: "Environment & Conservation", href: "/solutions/nonprofits/environment-conservation" },
      { label: "Arts & Culture", href: "/solutions/nonprofits/arts-culture" },
      { label: "Youth & Education", href: "/solutions/nonprofits/youth-education" },
    ],
  },
  {
    heading: "Personal",
    href: "/solutions/personal",
    blurb: "Share your story, showcase your work.",
    links: [
      { label: "Resumés & CVs", href: "/solutions/personal/resumes-cvs" },
      { label: "Portfolios", href: "/solutions/personal/portfolios" },
      { label: "Weddings", href: "/solutions/personal/weddings" },
      { label: "Freelancers", href: "/solutions/personal/freelancers" },
      { label: "Creators", href: "/solutions/personal/creators" },
      { label: "Podcasts", href: "/solutions/personal/podcasts" },
    ],
  },
];

export const RESOURCES_MENU = [
  {
    label: "Help Center",
    href: "https://support.squarespace.com/",
    description: "In-depth guides and videos about the platform.",
  },
  {
    label: "Forum",
    href: "https://forum.squarespace.com/",
    description: "An online community for Squarespace users and professionals.",
  },
  {
    label: "Webinars",
    href: "https://learning.squarespace.com",
    description: "Free online sessions where you'll learn the basics.",
  },
  {
    label: "Blog",
    href: "/blog",
    description: "Stories and solutions for the modern entrepreneur.",
  },
  {
    label: "Hire an Expert",
    href: "/designer/home",
    description: "Let us do the work of finding you a professional.",
  },
  {
    label: "Made with Squarespace",
    href: "/showcase",
    description: "A collection of inspiring Squarespace sites.",
  },
];

export const NAV_ITEMS: NavItem[] = [
  { label: "Products" },
  { label: "Solutions" },
  { label: "Resources" },
];

export const GET_STARTED_HREF = "/templates/get-started";
