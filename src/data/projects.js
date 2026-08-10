export const projects = [
  {
    id: 5,
    slug: 'edible-table',
    title: 'Edible Table',
    year: 2026,
    category: {
      en: 'Private Chef',
      fr: 'Cheffe privée',
    },
    url: 'https://www.edible-table.com/',
    description: {
      en: 'Showcase & portfolio site for Laurine, a private chef. Bespoke, local and seasonal cuisine, tuned to the tastes of every table.',
      fr: "Site vitrine & portfolio pour Laurine, cheffe privée. Une cuisine sur mesure, locale et de saison, au plus près des envies de chaque table.",
    },
    about: {
      en: 'The site conveys refined, high-end cooking through a clean art direction and a hand-written wordmark. Built on pre-rendered Astro 5 with no front-end framework: every animation is hand-crafted (CSS transitions, IntersectionObserver reveals, requestAnimationFrame parallax) for maximum lightness and zero superfluous dependencies. Natively bilingual FR/EN, WebP images optimised at build, self-hosted fonts, and a full SEO foundation (FoodEstablishment JSON-LD, sitemap). Contact runs through a backend-less Web3Forms form with honeypot anti-spam and a mailto fallback.',
      fr: "Le site incarne une cuisine haut de gamme par une direction artistique épurée et une typographie manuscrite. Construit en Astro 5 pré-rendu, sans framework front : toutes les animations sont faites main (transitions CSS, reveals à l'IntersectionObserver, parallax au requestAnimationFrame) pour une légèreté maximale et zéro dépendance superflue. Bilingue FR/EN natif, images WebP optimisées au build, polices auto-hébergées, et un socle SEO complet (JSON-LD FoodEstablishment, sitemap). La prise de contact passe par un formulaire Web3Forms sans backend, avec anti-spam honeypot et repli mailto.",
    },
    tags: {
      en: ['Design', 'Showcase', 'Portfolio'],
      fr: ['Design', 'Vitrine', 'Portfolio'],
    },
    projectType: {
      en: 'Front-end',
      fr: 'Front-end',
    },
    services: {
      en: ['Design', 'Development', 'i18n (FR / EN)', 'SEO / JSON-LD', 'Contact form', 'Responsive'],
      fr: ['Design', 'Développement', 'i18n (FR / EN)', 'SEO / JSON-LD', 'Formulaire de contact', 'Responsive'],
    },
    stack: ['Astro 5', 'HTML / CSS / JS', 'Web3Forms', 'sharp / WebP', 'Railway'],
    accentColor: '#ff3900',
    gradient: 'linear-gradient(140deg, #140300 0%, #300a00 55%, #4d1200 100%)',
    screenshot: '/projects/edible.png',
    video: '/projects/edible_table.mp4',
    clips: [],
  },
  {
    id: 1,
    slug: 'myshampouineuse',
    title: 'My Shampouineuse',
    year: 2025,
    category: {
      en: 'Home Services',
      fr: 'Services à domicile',
    },
    url: 'https://www.myshampouineuse.com/',
    description: {
      en: 'Showcase website for a professional sofa, carpet and mattress cleaning company in Corsica. Over 6,000 clients and 300+ verified reviews.',
      fr: 'Site vitrine pour une entreprise de nettoyage professionnel de canapés, moquettes et matelas en Corse. Plus de 6 000 clients et 300+ avis vérifiés.',
    },
    about: {
      en: 'The project covered the full stack: UI design, custom booking back-end, and an SEO strategy that brought the site to the first page on its key search queries. Automation of confirmations and client reminders reduced operational overhead. The analytics setup (GSC, GA4 and Clarity) gave the client a live reading of performance and user behaviour.',
      fr: "La mission a couvert l'intégralité du spectre : design UI, développement d'un back-end de réservation sur-mesure, et une stratégie SEO qui a propulsé le site en première page sur ses requêtes clés. L'automatisation des confirmations et rappels clients a allégé la charge opérationnelle. Le suivi analytique (GSC, GA4 et Clarity) donne au client une lecture en temps réel des performances et du comportement utilisateur.",
    },
    tags: {
      en: ['Design', 'Showcase', 'SEO'],
      fr: ['Design', 'Vitrine', 'SEO'],
    },
    projectType: {
      en: 'Full stack',
      fr: 'Full stack',
    },
    services: {
      en: ['Design', 'Development', 'SEO / Analytics', 'Booking / Back-end', 'Automation', 'Responsive'],
      fr: ['Design', 'Développement', 'SEO / Analytics', 'Booking / Back-end', 'Automation', 'Responsive'],
    },
    stack: ['Webflow', 'GSC / GA4 / Clarity', 'GSAP', 'Custom back-end'],
    accentColor: '#c9964a',
    gradient: 'linear-gradient(140deg, #120d00 0%, #2e1e00 55%, #4a3200 100%)',
    screenshot: '/projects/myshampouineuse.png',
    video: '/projects/myshampouineuse.mp4',
    clips: [],
  },
  {
    id: 2,
    slug: 'undamassage',
    title: 'Unda Massage',
    year: 2026,
    category: {
      en: 'Wellness & Sport',
      fr: 'Bien-être & Sport',
    },
    url: 'https://www.undamassage.fr/',
    description: {
      en: 'Specialist in sports massage and body sculpting in Biarritz. Premium wellness & performance positioning.',
      fr: 'Praticienne spécialisée en massage sportif et sculptage corporel à Biarritz. Positionnement premium wellness & performance.',
    },
    about: {
      en: 'The design was built to embody the brand\'s premium positioning: clean typography, a warm palette, fluid page-transition animations with Barba.js. Online booking was integrated directly into the site to reduce friction. An SEO foundation was laid from day one, enabling the practice to draw organic traffic from Biarritz and surrounding areas without relying solely on word of mouth.',
      fr: "Le design a été conçu pour incarner le positionnement premium de la marque : typographie épurée, palette chaude, animations de transition de page fluides avec Barba.js. La prise de rendez-vous en ligne a été intégrée directement au site pour réduire les frictions. Une base SEO a été posée dès le départ, permettant à la praticienne de capter du trafic organique sur Biarritz et les environs sans dépendre uniquement du bouche-à-oreille.",
    },
    tags: {
      en: ['Branding', 'Showcase', 'Booking'],
      fr: ['Branding', 'Vitrine', 'Booking'],
    },
    projectType: {
      en: 'Front-end',
      fr: 'Front-end',
    },
    services: {
      en: ['Design', 'Development', 'SEO', 'Booking', 'Responsive'],
      fr: ['Design', 'Développement', 'SEO', 'Booking', 'Responsive'],
    },
    stack: ['Calendly', 'Barba.JS', 'GSAP', 'GSC'],
    accentColor: '#ff6b35',
    gradient: 'linear-gradient(140deg, #120600 0%, #2e1000 55%, #4a1e00 100%)',
    screenshot: '/projects/undamassage.png',
    video:      '/projects/undamassage.mp4',
    videoFit:   'contain',
    videoScale: 1.18,
    clips: [],
  },
  {
    id: 3,
    slug: 'tcxa',
    title: 'TCXA Agency',
    year: 2025,
    category: {
      en: 'B2B Consulting',
      fr: 'Consulting B2B',
    },
    url: 'https://www.tcxa.agency/',
    description: {
      en: 'Customer experience consulting agency. Strategic repositioning across hospitality, retail and automotive.',
      fr: "Agence de conseil en expérience client. Repositionnement stratégique dans l'hôtellerie, le retail et l'automobile.",
    },
    about: {
      en: 'The challenge was to translate sharp consulting expertise into a credible, impactful digital identity. The design is deliberately restrained (structured layouts, precise micro-animations) to project authority in a B2B context. The analytics stack (GA4, Looker Studio) was wired up to give the team full visibility on lead sources and conversion paths.',
      fr: "L'enjeu était de traduire une expertise métier pointue en une identité digitale crédible et percutante. Le design est volontairement sobre (mise en page structurée, micro-animations précises) pour projeter de l'autorité dans un contexte B2B. La stack analytique (GA4, Looker Studio) a été connectée pour donner à l'équipe une visibilité complète sur les sources de leads et les parcours de conversion.",
    },
    tags: {
      en: ['Corporate', 'B2B', 'UX Strategy'],
      fr: ['Corporate', 'B2B', 'UX Strategy'],
    },
    projectType: {
      en: 'Front-end',
      fr: 'Front-end',
    },
    services: {
      en: ['Design', 'Development', 'SEO / Analytics', 'Booking', 'Responsive'],
      fr: ['Design', 'Développement', 'SEO / Analytics', 'Booking', 'Responsive'],
    },
    stack: ['Webflow', 'GSC / GA4 / Looker', 'GSAP', 'Calendly'],
    accentColor: '#e8b800',
    gradient: 'linear-gradient(140deg, #0d0c00 0%, #262200 55%, #403800 100%)',
    screenshot: '/projects/tcxa.png',
    video: '/projects/tcxa.mp4',
    clips: [],
  },
  {
    id: 4,
    slug: 'sportofkings',
    title: 'Sport of Kings',
    year: 2026,
    category: {
      en: 'Sustainable Fashion',
      fr: 'Mode durable',
    },
    url: 'https://www.sportofkings.eu/',
    description: {
      en: 'Sustainable clothing brand based in Biarritz. GOTS & OEKO-TEX certified organic cotton, against fast fashion.',
      fr: 'Marque de vêtements durables basée à Biarritz. Coton organique certifié GOTS & OEKO-TEX, contre le fast-fashion.',
    },
    about: {
      en: 'Beyond the e-commerce design, the project required careful organisation of the product catalogue and inventory management on Shopify. Each product page was crafted to highlight GOTS & OEKO-TEX certifications and speak directly to conscious consumers. The visual direction reinforces the brand\'s core message: quality over quantity, built to last.',
      fr: "Au-delà du design e-commerce, le projet a demandé une organisation rigoureuse du catalogue produit et de la gestion des stocks sur Shopify. Chaque fiche produit a été travaillée pour mettre en valeur les certifications GOTS & OEKO-TEX et s'adresser directement aux consommateurs engagés. La direction visuelle renforce le message central de la marque : la qualité plutôt que la quantité, fait pour durer.",
    },
    tags: {
      en: ['E-commerce', 'Fashion', 'Sustainable'],
      fr: ['E-commerce', 'Mode', 'Durable'],
    },
    projectType: {
      en: 'E-commerce',
      fr: 'E-commerce',
    },
    services: {
      en: ['Design', 'Development', 'Product & Stock Management', 'E-commerce', 'Responsive'],
      fr: ['Design', 'Développement', 'Gestion fiches produits et stocks', 'E-commerce', 'Responsive'],
    },
    stack: ['Shopify'],
    accentColor: '#72a872',
    gradient: 'linear-gradient(140deg, #010d01 0%, #071507 55%, #0d2010 100%)',
    screenshot: '/projects/sportofkings.png',
    clips: [],
  },
]
