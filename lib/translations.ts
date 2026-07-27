export type Lang = 'fr' | 'en'

interface NavTranslations {
  home: string
  about: string
  how: string
  contact: string
  login: string
  register: string
  chat: string
  logout: string
  account: string
}

interface CommonTranslations {
  officialSource: string
  backendOffline: string
  loading: string
}

interface HomeTranslations {
  badge: string
  heroEyebrow: string
  heroTitle: string
  heroSubtitle: string
  heroCta: string
  heroSecondary: string
  sourceTitle: string
  sourceText: string
  trust1Title: string
  trust1Text: string
  trust2Title: string
  trust2Text: string
  trust3Title: string
  trust3Text: string
  previewTitle: string
  previewUser: string
  previewAi: string
  previewSource: string
  benefitsTitle: string
  benefitsSubtitle: string
  benefit1Title: string
  benefit1Text: string
  benefit2Title: string
  benefit2Text: string
  benefit3Title: string
  benefit3Text: string
  benefit4Title: string
  benefit4Text: string
  stat1Label: string
  stat2Label: string
  stat3Label: string
  cultureTitle: string
  cultureText: string
  cultureCaption1: string
  cultureCaption2: string
  cultureCaption3: string
  mapTitle: string
  mapText: string
  domainDigital: string
  domainLabor: string
  domainFamily: string
  domainLand: string
  domainCriminal: string
  domainLiveLabel: string
  domainSoonLabel: string
  finalCtaTitle: string
  finalCtaText: string
  finalCta: string
}

interface AboutTranslations {
  title: string
  intro: string
  problemTitle: string
  problemText: string
  approachTitle: string
  approachText: string
  milTitle: string
  milText: string
  visionTitle: string
  visionText: string
  valuesTitle: string
  value1: string
  value2: string
  value3: string
  audienceTitle: string
  audienceSubtitle: string
  audience1Title: string
  audience1Text: string
  audience2Title: string
  audience2Text: string
  audience3Title: string
  audience3Text: string
  roadmapTitle: string
  roadmapText: string
}

interface HowTranslations {
  title: string
  subtitle: string
  step1Title: string
  step1Text: string
  step2Title: string
  step2Text: string
  step3Title: string
  step3Text: string
  step4Title: string
  step4Text: string
  sourceTitle: string
  sourceName: string
  sourceLink: string
  exampleTitle: string
  exampleSubtitle: string
  exampleJargonLabel: string
  exampleJargonText: string
  examplePlainLabel: string
  examplePlainText: string
  exampleSource: string
  notTitle: string
  not1: string
  not2: string
  not3: string
}

interface ChatTranslations {
  countryLabel: string
  placeholder: string
  send: string
  emptyTitle: string
  emptyText: string
  suggestion1: string
  suggestion2: string
  suggestion3: string
  sources: string
  article: string
  viewSource: string
  guestBanner: string
  guestBannerCta: string
  disclaimer: string
  thinking: string
  errorGeneric: string
}

interface AuthTranslations {
  registerTitle: string
  registerSubtitle: string
  individual: string
  individualDesc: string
  institution: string
  institutionDesc: string
  firstName: string
  lastName: string
  email: string
  password: string
  institutionName: string
  sector: string
  employees: string
  passwordHint: string
  passwordWeak: string
  passwordMedium: string
  passwordStrong: string
  submitRegister: string
  haveAccount: string
  loginLink: string
  changeType: string
  loginTitle: string
  loginSubtitle: string
  submitLogin: string
  noAccount: string
  registerLink: string
  errEmailExists: string
  errInvalid: string
  errValidation: string
  errRequired: string
  errPasswordShort: string
  errEmailInvalid: string
}

interface ContactTranslations {
  title: string
  subtitle: string
  name: string
  email: string
  message: string
  submit: string
  successTitle: string
  successText: string
  panelTitle: string
  panelText: string
  reason1Title: string
  reason1Text: string
  reason2Title: string
  reason2Text: string
  reason3Title: string
  reason3Text: string
}

interface PrivacyTranslations {
  title: string
  updated: string
  introTitle: string
  introText: string
  collectTitle: string
  collectText: string
  useTitle: string
  useText: string
  rightsTitle: string
  rightsText: string
}

interface FooterTranslations {
  tagline: string
  product: string
  about: string
  legal: string
  rights: string
  disclaimer: string
}

// Type maître : toutes les langues doivent respecter EXACTEMENT cette forme.
// Avantage sur l'ancien `as const` : si une clé manque dans une langue ou a
// un nom différent, TypeScript le signale immédiatement à la compilation,
// au lieu de laisser passer silencieusement une mauvaise traduction.
export interface Translations {
  nav: NavTranslations
  common: CommonTranslations
  home: HomeTranslations
  about: AboutTranslations
  how: HowTranslations
  chat: ChatTranslations
  auth: AuthTranslations
  contact: ContactTranslations
  privacy: PrivacyTranslations
  footer: FooterTranslations
}

// Centralized UI translations. Add new languages by extending this object.
export const translations: Record<Lang, Translations> = {
  fr: {
    nav: {
      home: 'Accueil',
      about: 'Qui sommes-nous',
      how: 'Comment ça marche',
      contact: 'Contact',
      login: 'Connexion',
      register: 'Inscription',
      chat: 'Poser une question',
      logout: 'Déconnexion',
      account: 'Mon compte',
    },
    common: {
      officialSource: 'Source officielle vérifiée',
      backendOffline:
        "Le service est momentanément indisponible. Réessayez dans un instant.",
      loading: 'Chargement…',
    },
    home: {
      badge: 'Le droit béninois, rendu accessible à tous',
      heroEyebrow: 'La vie ne laisse pas de deuxième chance',
      heroTitle: 'Comprendre la loi, c\'est se protéger.',
      heroSubtitle:
        "LexBénin traduit le droit béninois en langage clair, sourcé article par article — pour que chaque citoyen comprenne ses droits, pas seulement ceux qui peuvent payer un avocat. Nous commençons par le droit numérique, avec l'ambition de couvrir, à terme, l'ensemble du droit béninois.",
      heroCta: 'Poser une question',
      heroSecondary: 'Comment ça marche',
      sourceTitle: 'Une seule source de vérité : la loi elle-même',
      sourceText:
        "Chaque réponse s'appuie exclusivement sur des textes de loi officiels béninois. L'assistant recherche dans les articles réels, cite ses sources, et ne comble jamais un vide juridique par une supposition.",
      trust1Title: 'Réponses sourcées',
      trust1Text:
        "Chaque affirmation renvoie à un article précis de la loi, avec son extrait et un lien vers le texte officiel.",
      trust2Title: 'Langage accessible',
      trust2Text:
        "Le jargon juridique est traduit en explications simples, compréhensibles par tout citoyen.",
      trust3Title: 'Transparence sur le doute',
      trust3Text:
        "Quand une question sort du périmètre de la loi, l'assistant le dit clairement plutôt que d'inventer.",
      previewTitle: 'Un aperçu de la conversation',
      previewUser: 'Quelqu\'un a piraté mon compte en ligne, quels sont mes recours ?',
      previewAi:
        'La loi punit sévèrement l\'accès non autorisé à vos comptes et données — jusqu\'à 20 ans de réclusion si des mesures de sécurité ont été contournées.',
      previewSource: 'Article 507 — Accès et maintien illégal',
      benefitsTitle: 'Pourquoi comprendre la loi change tout',
      benefitsSubtitle:
        "Ce n'est pas un détail administratif. C'est ce qui vous protège, ce qui vous permet de faire valoir vos droits, et ce qui vous évite de vous faire avoir.",
      benefit1Title: 'Vous protéger',
      benefit1Text:
        "Connaître la loi, c'est reconnaître un abus avant qu'il ne devienne un problème — et savoir quoi faire quand ça arrive.",
      benefit2Title: 'Faire valoir vos droits',
      benefit2Text:
        "Un droit que vous ignorez est un droit que vous n'exercez jamais. La loi ne protège vraiment que ceux qui la connaissent.",
      benefit3Title: 'Décider en confiance',
      benefit3Text:
        "Signer un contrat, lancer une activité, régler un litige : comprendre les règles vous permet d'agir sans naviguer à l'aveugle.",
      benefit4Title: 'Résister à la désinformation',
      benefit4Text:
        '"On m\'a dit que..." n\'est pas une source. Face aux rumeurs juridiques, la loi elle-même reste la seule référence fiable.',
      stat1Label: 'Articles du Code du numérique déjà indexés',
      stat2Label: 'Réponses appuyées sur un article de loi réel',
      stat3Label: 'Domaines de droit visés à terme',
      cultureTitle: 'Construit pour le Bénin',
      cultureText:
        "LexBénin n'est pas un produit générique traduit pour l'Afrique — c'est un outil pensé depuis le départ pour le contexte béninois, ses citoyens, et ses réalités.",
      cultureCaption1: 'Ganvié, la cité lacustre',
      cultureCaption2: 'Marché Dantokpa, Cotonou',
      cultureCaption3: 'Porte du Non-Retour, Ouidah',
      mapTitle: 'Un droit, tout un pays',
      mapText:
        "Aujourd'hui centré sur le droit numérique, LexBénin a vocation à couvrir l'ensemble du droit béninois — pour que chaque citoyen, dans chaque département, puisse comprendre ses droits.",
      domainDigital: 'Droit numérique',
      domainLabor: 'Droit du travail',
      domainFamily: 'Droit de la famille',
      domainLand: 'Droit foncier',
      domainCriminal: 'Droit pénal',
      domainLiveLabel: 'Disponible',
      domainSoonLabel: 'À venir',
      finalCtaTitle: 'Une question sur vos droits ?',
      finalCtaText: 'Obtenez une réponse claire et sourcée en quelques secondes.',
      finalCta: 'Démarrer une conversation',
    },
    about: {
      title: 'Rendre le droit béninois compréhensible par tous.',
      intro:
        "LexBénin est né d'un constat simple : le droit existe, mais reste inaccessible à celles et ceux qu'il protège.",
      problemTitle: 'Le problème',
      problemText:
        "Au Bénin, comme ailleurs, les citoyens sont confrontés à un droit numérique de plus en plus présent dans leur vie — données personnelles, transactions en ligne, accès à internet — mais rédigé dans un langage technique. Faute de le comprendre, beaucoup se fient à des rumeurs : « on m'a dit que… », « il paraît que c'est interdit… ». Cette désinformation juridique crée de la peur et de la vulnérabilité.",
      approachTitle: 'Notre approche',
      approachText:
        "Nous combinons l'intelligence artificielle avec une recherche documentaire dans les vrais textes de loi (RAG). Concrètement, l'assistant ne répond jamais de mémoire ou par supposition : il recherche les articles réels du Code du numérique, puis formule une réponse uniquement à partir de ceux-ci, en citant systématiquement ses sources. Si l'information n'existe pas dans la loi, il le dit.",
      milTitle: "L'angle littératie de l'information",
      milText:
        "LexBénin n'est pas qu'un chatbot qui répond. C'est un outil de littératie de l'information juridique (MIL) : en montrant toujours d'où vient l'information, il apprend à chacun à distinguer un fait juridique vérifiable d'une rumeur. Savoir citer sa source, c'est apprendre à douter des affirmations sans preuve.",
      visionTitle: 'Notre vision',
      visionText:
        "Nous commençons avec le droit numérique béninois. À terme, nous voulons couvrir d'autres domaines du droit, puis d'autres pays, en gardant la même exigence de transparence. Nous envisageons également un volet de formation juridique à destination des entreprises et institutions — pour l'instant une perspective, pas encore une fonctionnalité.",
      valuesTitle: 'Ce qui nous guide',
      value1: 'Jamais de réponse sans source',
      value2: "Dire « je ne sais pas » plutôt qu'inventer",
      value3: 'Le citoyen au centre, pas le jargon',
      audienceTitle: 'Pour qui est fait LexBénin',
      audienceSubtitle:
        "Pas besoin d'être juriste. LexBénin s'adresse à quiconque a une question sur ses droits — et n'a personne de simple à qui la poser.",
      audience1Title: 'Le citoyen curieux',
      audience1Text:
        "Celui qui veut savoir ce que dit vraiment la loi avant de croire une rumeur entendue au marché ou sur les réseaux sociaux.",
      audience2Title: "L'étudiant et le jeune actif",
      audience2Text:
        "Celui qui signe ses premiers contrats, ouvre ses premiers comptes en ligne, et découvre des obligations qu'on ne lui a jamais expliquées.",
      audience3Title: "L'entrepreneur individuel",
      audience3Text:
        "Celui qui vend en ligne, gère des données de clients, et doit respecter des règles qu'aucune formation ne lui a jamais enseignées.",
      roadmapTitle: "D'un domaine de droit à tout le droit béninois",
      roadmapText:
        "Le droit numérique est notre point de départ, pas notre limite. Voici comment nous voyons la suite.",
    },
    how: {
      title: 'Comment fonctionne LexBénin',
      subtitle:
        "De votre question à une réponse fiable et sourcée, en quatre étapes.",
      step1Title: 'Vous posez votre question',
      step1Text:
        'En langage naturel, comme vous le diriez à un ami — pas besoin de vocabulaire juridique.',
      step2Title: 'Recherche dans les vrais textes',
      step2Text:
        "L'assistant parcourt les articles réels du Code du numérique pour trouver ceux qui concernent votre question.",
      step3Title: 'Réponse à partir des articles',
      step3Text:
        "L'IA rédige une réponse uniquement à partir des articles trouvés, jamais de sa propre invention.",
      step4Title: 'Citation systématique',
      step4Text:
        'Chaque réponse affiche les articles utilisés, avec leur extrait et un lien vers le texte officiel.',
      sourceTitle: 'Notre source officielle',
      sourceName:
        'Loi n°2017-20 du 20 avril 2018 portant Code du numérique en République du Bénin',
      sourceLink: 'Consulter le texte officiel (PDF)',
      exampleTitle: 'Un exemple concret',
      exampleSubtitle:
        "Voici ce que dit la loi, mot pour mot — et ce que LexBénin en fait.",
      exampleJargonLabel: 'Ce que dit la loi (Article 507)',
      exampleJargonText:
        "« Quiconque accède ou se maintient intentionnellement et sans droit, dans l'ensemble ou partie d'un système informatique est puni d'un emprisonnement d'un (01) à cinq (05) ans et d'une amende de cinq cent mille (500 000) francs CFA à un million (1 000 000) de francs CFA ou de l'une de ces peines seulement. »",
      examplePlainLabel: 'Ce que LexBénin vous explique',
      examplePlainText:
        "Si quelqu'un pirate votre compte ou votre ordinateur sans votre autorisation, il risque jusqu'à 5 ans de prison et jusqu'à 1 000 000 FCFA d'amende.",
      exampleSource: 'Article 507 — Accès et maintien illégal',
      notTitle: "Ce que cet outil n'est pas",
      not1: "Ce n'est pas un avocat. Il ne remplace pas un conseil juridique professionnel.",
      not2: "Ce n'est pas un conseil juridique définitif. Pour toute démarche officielle, consultez un professionnel.",
      not3: "Ce n'est pas exhaustif. Pour l'instant, seul le droit numérique béninois est couvert.",
    },
    chat: {
      countryLabel: 'Domaine juridique',
      placeholder: 'Posez votre question sur le droit béninois…',
      send: 'Envoyer',
      emptyTitle: 'Bienvenue sur LexBénin',
      emptyText:
        'Posez une question sur le droit béninois. Les réponses citent toujours les articles de loi utilisés.',
      suggestion1: "Une entreprise peut-elle collecter les données personnelles de ses clients sans leur consentement ?",
      suggestion2: 'Quels sont les droits d\'une personne concernant la protection de ses données personnelles au Bénin ?',
      suggestion3: 'Une signature électronique a-t-elle une valeur légale ?',
      suggestion4: 'Un site web béninois est victime d\'une fuite de données personnelles. Quelles sont les obligations légales de l\'entreprise ?',
      sources: 'Sources citées',
      article: 'Article',
      viewSource: 'Voir le texte officiel',
      guestBanner:
        'Connectez-vous pour retrouver votre historique de conversations.',
      guestBannerCta: "S'inscrire",
      disclaimer:
        "Information à but pédagogique — ne constitue pas un conseil juridique professionnel définitif.",
      thinking: 'Recherche dans les textes de loi…',
      errorGeneric: "Une erreur est survenue. Réessayez.",
    },
    auth: {
      registerTitle: 'Créer votre compte',
      registerSubtitle: 'Choisissez le type de compte qui vous correspond.',
      individual: 'Je suis un particulier',
      individualDesc: 'Pour comprendre vos droits numériques au quotidien.',
      institution: 'Je représente une institution',
      institutionDesc: 'Pour une entreprise, une administration ou une ONG.',
      firstName: 'Prénom',
      lastName: 'Nom',
      email: 'Adresse e-mail',
      password: 'Mot de passe',
      institutionName: "Nom de l'institution",
      sector: "Secteur d'activité",
      employees: "Nombre d'employés",
      passwordHint: 'Au moins 8 caractères',
      passwordWeak: 'Faible',
      passwordMedium: 'Moyen',
      passwordStrong: 'Fort',
      submitRegister: 'Créer mon compte',
      haveAccount: 'Vous avez déjà un compte ?',
      loginLink: 'Se connecter',
      changeType: 'Changer de type de compte',
      loginTitle: 'Se connecter',
      loginSubtitle: 'Accédez à votre historique de conversations.',
      submitLogin: 'Se connecter',
      noAccount: "Vous n'avez pas de compte ?",
      registerLink: 'Créer un compte',
      errEmailExists: 'Cette adresse e-mail est déjà utilisée.',
      errInvalid: 'E-mail ou mot de passe incorrect.',
      errValidation: 'Veuillez vérifier les champs du formulaire.',
      errRequired: 'Ce champ est requis.',
      errPasswordShort: 'Le mot de passe doit contenir au moins 8 caractères.',
      errEmailInvalid: 'Adresse e-mail invalide.',
    },
    contact: {
      title: 'Nous contacter',
      subtitle: 'Une question, une suggestion, un partenariat ? Écrivez-nous.',
      name: 'Nom',
      email: 'Adresse e-mail',
      message: 'Votre message',
      submit: 'Envoyer le message',
      successTitle: 'Message envoyé',
      successText: 'Merci, nous vous répondrons dès que possible.',
      panelTitle: 'Parlons-en',
      panelText:
        "LexBénin est un projet jeune, qui se construit avec ceux qu'il sert. Vos retours façonnent directement la suite.",
      reason1Title: 'Signaler une erreur',
      reason1Text: "Une réponse incorrecte, une source mal citée, un bug technique.",
      reason2Title: 'Proposer un domaine de droit',
      reason2Text: "Un sujet juridique béninois que vous aimeriez voir couvert en priorité.",
      reason3Title: 'Partenariat ou presse',
      reason3Text: "Institution, ONG, média — parlons de comment collaborer.",
    },
    privacy: {
      title: 'Confidentialité et mentions légales',
      updated: 'Dernière mise à jour : avril 2026',
      introTitle: 'Notre engagement',
      introText:
        "LexBénin explique les principes de protection des données du droit numérique béninois — nous nous appliquons à nous-mêmes ces mêmes principes.",
      collectTitle: 'Données que nous collectons',
      collectText:
        "Pour les particuliers : nom, prénom et adresse e-mail. Pour les institutions : nom de l'institution, secteur d'activité, nombre d'employés et adresse e-mail. Votre mot de passe est stocké de manière chiffrée et n'est jamais accessible en clair.",
      useTitle: 'Utilisation des données',
      useText:
        "Vos données servent uniquement à créer votre compte et à conserver votre historique de conversations. Nous ne vendons ni ne partageons vos données avec des tiers à des fins commerciales.",
      rightsTitle: 'Vos droits',
      rightsText:
        "Conformément aux principes de protection des données, vous pouvez demander l'accès, la rectification ou la suppression de vos données personnelles à tout moment.",
    },
    footer: {
      tagline: 'Le droit béninois, expliqué et sourcé.',
      product: 'Produit',
      about: 'À propos',
      legal: 'Légal',
      rights: 'Tous droits réservés.',
      disclaimer:
        "LexBénin fournit une information pédagogique et ne remplace pas un conseil juridique professionnel.",
    },
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About us',
      how: 'How it works',
      contact: 'Contact',
      login: 'Log in',
      register: 'Sign up',
      chat: 'Ask a question',
      logout: 'Log out',
      account: 'My account',
    },
    common: {
      officialSource: 'Verified official source',
      backendOffline: 'The service is temporarily unavailable. Please try again shortly.',
      loading: 'Loading…',
    },
    home: {
      badge: 'Beninese law, made accessible to everyone',
      heroEyebrow: 'Life doesn\'t give second chances',
      heroTitle: 'Understanding the law means protecting yourself.',
      heroSubtitle:
        "LexBénin translates Beninese law into clear, article-by-article sourced language — so every citizen understands their rights, not just those who can afford a lawyer. We're starting with digital law, with the ambition to eventually cover the whole of Beninese law.",
      heroCta: 'Ask a question',
      heroSecondary: 'How it works',
      sourceTitle: 'One single source of truth: the law itself',
      sourceText:
        "Every answer relies exclusively on official Beninese legal texts. The assistant searches real articles, cites its sources, and never fills a legal gap with a guess.",
      trust1Title: 'Sourced answers',
      trust1Text:
        'Every statement points to a precise article of the law, with its excerpt and a link to the official text.',
      trust2Title: 'Accessible language',
      trust2Text:
        'Legal jargon is translated into simple explanations any citizen can understand.',
      trust3Title: 'Transparent about doubt',
      trust3Text:
        "When a question falls outside the scope of the law, the assistant says so clearly instead of inventing.",
      previewTitle: 'A glimpse of the conversation',
      previewUser: 'Someone hacked my account, what can I do?',
      previewAi:
        'The law severely punishes unauthorized access to your accounts and data — up to 20 years in prison if security measures were bypassed.',
      previewSource: 'Article 507 — Unauthorized access',
      benefitsTitle: 'Why understanding the law changes everything',
      benefitsSubtitle:
        "It's not an administrative detail. It's what protects you, what lets you assert your rights, and what keeps you from being taken advantage of.",
      benefit1Title: 'Protect yourself',
      benefit1Text:
        "Knowing the law means recognizing abuse before it becomes a real problem — and knowing what to do when it happens.",
      benefit2Title: 'Assert your rights',
      benefit2Text:
        "A right you don't know about is a right you never exercise. The law only truly protects those who know it.",
      benefit3Title: 'Decide with confidence',
      benefit3Text:
        "Signing a contract, starting a business, resolving a dispute: understanding the rules lets you act without flying blind.",
      benefit4Title: 'Resist misinformation',
      benefit4Text:
        '"Someone told me..." is not a source. Against legal rumors, the law itself remains the only reliable reference.',
      stat1Label: 'Digital Code articles already indexed',
      stat2Label: 'Answers backed by a real article of law',
      stat3Label: 'Legal domains targeted long-term',
      cultureTitle: 'Built for Benin',
      cultureText:
        "LexBénin isn't a generic product translated for Africa — it's a tool designed from day one for the Beninese context, its citizens, and its realities.",
      cultureCaption1: 'Ganvié, the lake village',
      cultureCaption2: 'Dantokpa Market, Cotonou',
      cultureCaption3: 'Door of No Return, Ouidah',
      mapTitle: 'One law, a whole country',
      mapText:
        "Currently focused on digital law, LexBénin aims to eventually cover the whole of Beninese law — so that every citizen, in every department, can understand their rights.",
      domainDigital: 'Digital law',
      domainLabor: 'Labor law',
      domainFamily: 'Family law',
      domainLand: 'Land law',
      domainCriminal: 'Criminal law',
      domainLiveLabel: 'Available',
      domainSoonLabel: 'Coming soon',
      finalCtaTitle: 'A question about your rights?',
      finalCtaText: 'Get a clear, sourced answer in seconds.',
      finalCta: 'Start a conversation',
    },
    about: {
      title: 'Making Beninese law understandable for everyone.',
      intro:
        'LexBénin was born from a simple observation: the law exists, but remains out of reach for the very people it protects.',
      problemTitle: 'The problem',
      problemText:
        "In Benin, as elsewhere, citizens face a digital law increasingly present in their lives — personal data, online transactions, internet access — yet written in technical language. Unable to understand it, many rely on rumors: \"someone told me that…\", \"apparently it's forbidden…\". This legal misinformation breeds fear and vulnerability.",
      approachTitle: 'Our approach',
      approachText:
        'We combine artificial intelligence with document retrieval in the actual legal texts (RAG). Concretely, the assistant never answers from memory or assumption: it searches the real articles of the Digital Code, then answers solely from them, systematically citing its sources. If the information is not in the law, it says so.',
      milTitle: 'The information literacy angle',
      milText:
        "LexBénin is not just a chatbot that answers. It is a tool for legal information literacy (MIL): by always showing where information comes from, it teaches everyone to tell a verifiable legal fact from a rumor. Knowing how to cite a source means learning to doubt unproven claims.",
      visionTitle: 'Our vision',
      visionText:
        "We start with Beninese digital law. In time, we want to cover other areas of law, then other countries, keeping the same commitment to transparency. We also envision a legal training offering for businesses and institutions — for now a perspective, not yet a feature.",
      valuesTitle: 'What guides us',
      value1: 'Never an answer without a source',
      value2: 'Say "I don\'t know" rather than invent',
      value3: 'The citizen at the center, not the jargon',
      audienceTitle: 'Who LexBénin is built for',
      audienceSubtitle:
        "You don't need to be a lawyer. LexBénin is for anyone with a question about their rights — and no one simple to ask.",
      audience1Title: 'The curious citizen',
      audience1Text:
        'Someone who wants to know what the law actually says before believing a rumor heard at the market or on social media.',
      audience2Title: 'The student and young professional',
      audience2Text:
        'Someone signing their first contracts, opening their first online accounts, and discovering obligations no one ever explained.',
      audience3Title: 'The independent entrepreneur',
      audience3Text:
        'Someone selling online, handling customer data, and expected to follow rules no training ever taught them.',
      roadmapTitle: 'From one field of law to all of Beninese law',
      roadmapText:
        "Digital law is our starting point, not our limit. Here's how we see what comes next.",
    },
    how: {
      title: 'How LexBénin works',
      subtitle: 'From your question to a reliable, sourced answer, in four steps.',
      step1Title: 'You ask your question',
      step1Text:
        'In natural language, as you would to a friend — no legal vocabulary needed.',
      step2Title: 'Search in the real texts',
      step2Text:
        'The assistant scans the actual articles of the Digital Code to find those relevant to your question.',
      step3Title: 'Answer from the articles',
      step3Text:
        'The AI writes an answer solely from the retrieved articles, never from its own invention.',
      step4Title: 'Systematic citation',
      step4Text:
        'Every answer displays the articles used, with their excerpt and a link to the official text.',
      sourceTitle: 'Our official source',
      sourceName:
        'Law No. 2017-20 of 20 April 2018, the Digital Code of the Republic of Benin',
      sourceLink: 'View the official text (PDF)',
      exampleTitle: 'A concrete example',
      exampleSubtitle: "Here's what the law says, word for word — and what LexBénin makes of it.",
      exampleJargonLabel: 'What the law says (Article 507)',
      exampleJargonText:
        '"Anyone who intentionally and without right accesses or remains within all or part of a computer system shall be punished by imprisonment of one (01) to five (05) years and a fine of five hundred thousand (500,000) to one million (1,000,000) CFA francs, or by one of these penalties alone."',
      examplePlainLabel: 'What LexBénin explains to you',
      examplePlainText:
        'If someone hacks your account or computer without your permission, they risk up to 5 years in prison and up to 1,000,000 CFA francs in fines.',
      exampleSource: 'Article 507 — Unauthorized access',
      notTitle: 'What this tool is not',
      not1: 'It is not a lawyer. It does not replace professional legal advice.',
      not2: 'It is not definitive legal advice. For any official process, consult a professional.',
      not3: 'It is not exhaustive. For now, only Beninese digital law is covered.',
    },
    chat: {
      countryLabel: 'Legal domain',
      placeholder: 'Ask your question about Beninese law…',
      send: 'Send',
      emptyTitle: 'Welcome to LexBénin',
      emptyText:
        'Ask a question about Beninese law. Answers always cite the articles of law used.',
      suggestion1: 'Do I have the right to freely access the internet?',
      suggestion2: 'How is my personal data protected?',
      suggestion3: 'Does an electronic signature have legal value?',
      sources: 'Cited sources',
      article: 'Article',
      viewSource: 'View official text',
      guestBanner: 'Log in to keep your conversation history.',
      guestBannerCta: 'Sign up',
      disclaimer:
        'Educational information — does not constitute definitive professional legal advice.',
      thinking: 'Searching the legal texts…',
      errorGeneric: 'An error occurred. Please try again.',
    },
    auth: {
      registerTitle: 'Create your account',
      registerSubtitle: 'Choose the account type that fits you.',
      individual: 'I am an individual',
      individualDesc: 'To understand your digital rights day to day.',
      institution: 'I represent an institution',
      institutionDesc: 'For a company, an administration, or an NGO.',
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email address',
      password: 'Password',
      institutionName: 'Institution name',
      sector: 'Sector of activity',
      employees: 'Number of employees',
      passwordHint: 'At least 8 characters',
      passwordWeak: 'Weak',
      passwordMedium: 'Medium',
      passwordStrong: 'Strong',
      submitRegister: 'Create my account',
      haveAccount: 'Already have an account?',
      loginLink: 'Log in',
      changeType: 'Change account type',
      loginTitle: 'Log in',
      loginSubtitle: 'Access your conversation history.',
      submitLogin: 'Log in',
      noAccount: "Don't have an account?",
      registerLink: 'Create an account',
      errEmailExists: 'This email address is already in use.',
      errInvalid: 'Incorrect email or password.',
      errValidation: 'Please check the form fields.',
      errRequired: 'This field is required.',
      errPasswordShort: 'Password must be at least 8 characters.',
      errEmailInvalid: 'Invalid email address.',
    },
    contact: {
      title: 'Contact us',
      subtitle: 'A question, a suggestion, a partnership? Write to us.',
      name: 'Name',
      email: 'Email address',
      message: 'Your message',
      submit: 'Send message',
      successTitle: 'Message sent',
      successText: "Thank you, we'll get back to you as soon as possible.",
      panelTitle: "Let's talk",
      panelText:
        'LexBénin is a young project, built with the people it serves. Your feedback directly shapes what comes next.',
      reason1Title: 'Report an issue',
      reason1Text: 'An incorrect answer, a miscited source, a technical bug.',
      reason2Title: 'Suggest a field of law',
      reason2Text: "A Beninese legal topic you'd like to see covered as a priority.",
      reason3Title: 'Partnership or press',
      reason3Text: "Institution, NGO, media outlet — let's talk about how to collaborate.",
    },
    privacy: {
      title: 'Privacy and legal notice',
      updated: 'Last updated: April 2026',
      introTitle: 'Our commitment',
      introText:
        "LexBénin explains the data protection principles of Beninese digital law — we apply those same principles to ourselves.",
      collectTitle: 'Data we collect',
      collectText:
        'For individuals: last name, first name, and email address. For institutions: institution name, sector of activity, number of employees, and email address. Your password is stored encrypted and is never accessible in plain text.',
      useTitle: 'Use of data',
      useText:
        'Your data is used only to create your account and keep your conversation history. We do not sell or share your data with third parties for commercial purposes.',
      rightsTitle: 'Your rights',
      rightsText:
        'In line with data protection principles, you can request access, correction, or deletion of your personal data at any time.',
    },
    footer: {
      tagline: 'Beninese law, explained and sourced.',
      product: 'Product',
      about: 'About',
      legal: 'Legal',
      rights: 'All rights reserved.',
      disclaimer:
        'LexBénin provides educational information and does not replace professional legal advice.',
    },
  },
}

