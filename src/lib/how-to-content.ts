import type { RichRun } from "@/types/content";

/**
 * "How to build a website" steps, generated from the live DOM
 * (docs/research/html/09-how-to.html). Inline links are preserved as runs.
 */
export const HOW_TO_STEPS: Array<{ heading: string; body: RichRun[] }> = [
  {
    "heading": "Start your free website trial",
    "body": [
      " To create your own website, choose a professionally designed ",
      {
        "label": "website template",
        "href": "/templates"
      },
      " or use Squarespace’s ",
      {
        "label": "AI website builder",
        "href": "/websites/ai-website-builder"
      },
      " to get started in minutes. No credit card required. "
    ]
  },
  {
    "heading": "Customize your website design",
    "body": [
      " Make it yours with Squarespace’s intuitive ",
      {
        "label": "drag-and-drop website platform",
        "href": "/websites/fluid-engine"
      },
      " . Quickly edit layouts, update fonts and colors, and add your own images and branding. "
    ]
  },
  {
    "heading": "Add pages and features to your website",
    "body": [
      " Whether you're building a portfolio or blog, setting up an online store, or promoting professional services and experiences, choose from pre-built page layouts or create your own to fit your content needs. "
    ]
  },
  {
    "heading": "Create your content",
    "body": [
      " Generate headlines, product descriptions, SEO tags, and more with built-in AI tools, or write your own with full creative control. "
    ]
  },
  {
    "heading": "Publish and grow with business tools",
    "body": [
      " Connect a custom domain name, publish your site, and start building your audience with ",
      {
        "label": "built-in marketing tools",
        "href": "/website-marketing"
      },
      " , including SEO, email marketing, and social media connections. "
    ]
  },
  {
    "heading": "Start selling online",
    "body": [
      {
        "label": "Create an online store",
        "href": "/online-stores"
      },
      " and allow customers to browse your products or services, add items to their shopping cart, and check out securely and efficiently with Squarespace Payments. "
    ]
  }
];
