import type { FaqEntry } from "@/types/content";

/**
 * Homepage FAQ, generated from the live DOM (docs/research/html/10-faq.html).
 *
 * Answers are arrays of paragraphs, and each paragraph is a run of plain
 * strings and inline links, so the links survive verbatim rather than being
 * flattened into text.
 */
export const FAQ_ENTRIES: FaqEntry[] = [
  {
    "question": "How do I create a website with Squarespace?",
    "answer": [
      [
        " You can create your own website by starting a free trial and selecting a professionally designed website template that suits your vision, or create a fully custom website with Squarespace's ",
        {
          "label": "AI website builder",
          "href": "/websites/ai-website-builder"
        },
        " . Use our drag-and-drop editor to customize layouts, images, colors, and fonts. From there, add new pages and features using pre-built layouts or create your own. "
      ]
    ]
  },
  {
    "question": "Do I need to know how to code to build a website?",
    "answer": []
  },
  {
    "question": "What is a website builder and which one is best for me?",
    "answer": [
      [
        " A website builder is a platform or tool that allows individuals and businesses to create and manage websites without prior coding or web design experience. Look for a website creator that offers a free trial, user-friendly interface, pre-designed templates, drag-and-drop editing functionality, and various customization options. "
      ]
    ]
  },
  {
    "question": "How much does it cost to create a website?",
    "answer": [
      [
        " After a free 14-day trial, Squarespace subscriptions start at $19/mo and give you access to your own custom website and selling tools. More advanced plans offer state-of-the-art ecommerce features and lower payment processing fees. "
      ]
    ]
  },
  {
    "question": "Can I get a custom domain name for my website?",
    "answer": [
      [
        " Yes, you can get a custom domain name for your website on Squarespace. Look for a domain registrar that offers a wide variety of top-level domains (TLDs) and extensions, and that lets you manage your domain through its platform. "
      ]
    ]
  },
  {
    "question": "How can I offer services with my Squarespace website?",
    "answer": [
      [
        " Squarespace makes it easy to showcase your offerings with specific website templates catered to all types of professional services, including consultants, lawyers, designers, and photographers, as well as website templates for various experiences like camps, retreats, adventure travel, and more. "
      ],
      [
        " You can list services and packages directly on your site with a streamlined checkout process, complete with service descriptions and itineraries, pricing, and imagery. You can also let clients book time or schedule appointments directly through integrated tools like Acuity Scheduling . "
      ],
      [
        " Additionally, ",
        {
          "label": "Squarespace Invoicing",
          "href": "/invoicing"
        },
        " gives you tools to create professional branded invoices that help you win more clients, all tracked and managed from your Squarespace account. You can also accept several major payment methods directly on your site and offer a seamless checkout experience through ",
        {
          "label": "Squarespace Payments",
          "href": "/payments"
        },
        " . "
      ]
    ]
  },
  {
    "question": "Can I sell products online with a Squarespace website?",
    "answer": [
      [
        " Squarespace offers a range of tools to help sellers manage their ",
        {
          "label": "online stores",
          "href": "/online-stores"
        },
        " , including ",
        {
          "label": "payment processing",
          "href": "/payments"
        },
        " , inventory management, shipping, ",
        {
          "label": "invoicing",
          "href": "/invoicing"
        },
        " , and marketing. "
      ],
      [
        " Simple, flexible payment and checkout options make shopping on your ",
        {
          "label": "ecommerce website",
          "href": "/ecommerce-website"
        },
        " easy for customers. You'll have access to more ways to sell, from gift cards and digital downloads to offering subscriptions, as well as integrations with popular social media and search platforms that allow you to sync your product catalog to sell via other platforms like Facebook and Google. "
      ],
      [
        " Sellers can showcase their products with detailed ",
        {
          "label": "product listings",
          "href": "/ecommerce/sell-products"
        },
        " (including comprehensive descriptions, embedded videos, images, and related products); product categories; and unlimited products. Inventory tools help you manage your product stock with a simplified interface, while shipping tools let you set up flexible shipping options, print labels, and more. "
      ]
    ]
  },
  {
    "question": "Does Squarespace offer AI-powered website building tools?",
    "answer": [
      [
        " Yes, Squarespace's ",
        {
          "label": "suite of AI tools",
          "href": "/design-intelligence"
        },
        " can help you create a personalized website in minutes. Blueprint AI allows you to ",
        {
          "label": "build a website with AI",
          "href": "/websites/ai-website-builder"
        },
        " by combining powerful technology with 20 years of design expertise, generating an entire website alongside personalized content with tailored text and high-quality images that match your brand vision. You can also use Squarespace AI tools to create website copy, product descriptions, blog posts, and email campaigns. "
      ]
    ]
  },
  {
    "question": "Can I connect my website to social media and third-party apps?",
    "answer": [
      [
        " You can connect your Squarespace website to social media and third-party apps, which allows you to push content to social media platforms, display social media feeds on your website, and integrate with services like print on demand providers. "
      ],
      [
        " Automatically share your Squarespace content to your social media platforms when you publish new content. "
      ]
    ]
  },
  {
    "question": "How can I optimize my site for SEO with Squarespace?",
    "answer": [
      [
        " Squarespace features built-in, advanced ",
        {
          "label": "SEO tools",
          "href": "/marketing/seo"
        },
        " designed to help every website and online store rank in search results. "
      ],
      [
        " For example, your website comes with default SEO page titles and descriptions, which you can modify without changing the page content visitors see. You can also hide pages if you need to, and control the image people see alongside your content whenever it's shared on social media. "
      ]
    ]
  },
  {
    "question": "Does my Squarespace website come with hosting and security?",
    "answer": [
      [
        " All Squarespace websites come with both hosting and ",
        {
          "label": "security",
          "href": "/security"
        },
        " . Squarespace provides web hosting for your site, so you don't need to find a separate hosting provider. Squarespace websites are also hosted on our own servers and infrastructure, built to support high levels of traffic with consistent uptime. "
      ]
    ]
  }
];
