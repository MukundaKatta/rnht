export type Locale =
  | "en"
  | "te"
  | "hi"
  | "ta"
  | "kn"
  | "mr"
  | "ml"
  | "gu"
  | "bn"
  | "pa";

export const localeNames: Record<Locale, string> = {
  en: "English",
  te: "తెలుగు",
  hi: "हिन्दी",
  ta: "தமிழ்",
  kn: "ಕನ್ನಡ",
  mr: "मराठी",
  ml: "മലയാളം",
  gu: "ગુજરાતી",
  bn: "বাংলা",
  pa: "ਪੰਜਾਬੀ",
};

export const localeLabels: Record<Locale, string> = {
  en: "English",
  te: "Telugu",
  hi: "Hindi",
  ta: "Tamil",
  kn: "Kannada",
  mr: "Marathi",
  ml: "Malayalam",
  gu: "Gujarati",
  bn: "Bengali",
  pa: "Punjabi",
};

type TranslationKeys = {
  // Navigation
  "nav.home": string;
  "nav.services": string;
  "nav.calendar": string;
  "nav.panchangam": string;
  "nav.donate": string;
  "nav.more": string;
  "nav.login": string;
  // Home
  "home.title": string;
  "home.subtitle": string;
  "home.bookPooja": string;
  "home.viewCalendar": string;
  "home.templeHours": string;
  "home.ourServices": string;
  "home.upcomingEvents": string;
  "home.supportTemple": string;
  "home.donateNow": string;
  // Services
  "services.title": string;
  "services.atTemple": string;
  "services.outsideTemple": string;
  "services.all": string;
  "services.search": string;
  "services.bookNow": string;
  "services.inquire": string;
  "services.duration": string;
  "services.price": string;
  // Donate
  "donate.title": string;
  "donate.subtitle": string;
  "donate.amount": string;
  "donate.fund": string;
  "donate.recurring": string;
  "donate.dollarADay": string;
  "donate.zelle": string;
  "donate.thankYou": string;
  // Common
  "common.submit": string;
  "common.cancel": string;
  "common.save": string;
  "common.close": string;
  "common.loading": string;
  "common.learnMore": string;
};

const en: TranslationKeys = {
  "nav.home": "Home",
  "nav.services": "Services",
  "nav.calendar": "Calendar",
  "nav.panchangam": "Panchangam",
  "nav.donate": "Donate",
  "nav.more": "More",
  "nav.login": "Sign In",
  "home.title": "Rudra Narayana Hindu Temple",
  "home.subtitle": "Your spiritual home in Las Vegas",
  "home.bookPooja": "Book a Pooja",
  "home.viewCalendar": "View Calendar",
  "home.templeHours": "Temple Hours",
  "home.ourServices": "Our Services",
  "home.upcomingEvents": "Upcoming Events",
  "home.supportTemple": "Support Our Temple",
  "home.donateNow": "Donate Now",
  "services.title": "Pooja & Spiritual Services",
  "services.atTemple": "At Temple",
  "services.outsideTemple": "Outside Temple",
  "services.all": "All",
  "services.search": "Search services...",
  "services.bookNow": "Book Now",
  "services.inquire": "Inquire",
  "services.duration": "Duration",
  "services.price": "Price",
  "donate.title": "Support Our Temple",
  "donate.subtitle": "Your contributions help maintain the temple and support community programs",
  "donate.amount": "Donation Amount",
  "donate.fund": "Select Fund",
  "donate.recurring": "Make this a recurring donation",
  "donate.dollarADay": "Dollar A Day Program",
  "donate.zelle": "Donate via Zelle",
  "donate.thankYou": "Thank You for Your Generosity!",
  "common.submit": "Submit",
  "common.cancel": "Cancel",
  "common.save": "Save",
  "common.close": "Close",
  "common.loading": "Loading...",
  "common.learnMore": "Learn More",
};

const te: TranslationKeys = {
  "nav.home": "హోమ్",
  "nav.services": "సేవలు",
  "nav.calendar": "క్యాలెండర్",
  "nav.panchangam": "పంచాంగం",
  "nav.donate": "విరాళం",
  "nav.more": "మరిన్ని",
  "nav.login": "సైన్ ఇన్",
  "home.title": "రుద్ర నారాయణ హిందూ దేవాలయం",
  "home.subtitle": "లాస్ వేగాస్‌లో మీ ఆధ్యాత్మిక నివాసం",
  "home.bookPooja": "పూజ బుక్ చేయండి",
  "home.viewCalendar": "క్యాలెండర్ చూడండి",
  "home.templeHours": "ఆలయ సమయాలు",
  "home.ourServices": "మా సేవలు",
  "home.upcomingEvents": "రాబోయే కార్యక్రమాలు",
  "home.supportTemple": "ఆలయానికి సహాయం",
  "home.donateNow": "ఇప్పుడు విరాళం ఇవ్వండి",
  "services.title": "పూజ మరియు ఆధ్యాత్మిక సేవలు",
  "services.atTemple": "ఆలయంలో",
  "services.outsideTemple": "ఆలయం బయట",
  "services.all": "అన్నీ",
  "services.search": "సేవలు వెతకండి...",
  "services.bookNow": "బుక్ చేయండి",
  "services.inquire": "విచారించండి",
  "services.duration": "వ్యవధి",
  "services.price": "ధర",
  "donate.title": "మా ఆలయానికి సహాయం",
  "donate.subtitle": "మీ విరాళాలు ఆలయ నిర్వహణకు మరియు సమాజ కార్యక్రమాలకు సహాయపడతాయి",
  "donate.amount": "విరాళం మొత్తం",
  "donate.fund": "ఫండ్ ఎంచుకోండి",
  "donate.recurring": "పునరావృత విరాళం చేయండి",
  "donate.dollarADay": "రోజుకు ఒక డాలర్ కార్యక్రమం",
  "donate.zelle": "Zelle ద్వారా విరాళం",
  "donate.thankYou": "మీ ఔదార్యానికి ధన్యవాదాలు!",
  "common.submit": "సమర్పించండి",
  "common.cancel": "రద్దు",
  "common.save": "భద్రపరచు",
  "common.close": "మూసివేయండి",
  "common.loading": "లోడ్ అవుతోంది...",
  "common.learnMore": "మరింత తెలుసుకోండి",
};

const hi: TranslationKeys = {
  "nav.home": "होम",
  "nav.services": "सेवाएं",
  "nav.calendar": "कैलेंडर",
  "nav.panchangam": "पंचांग",
  "nav.donate": "दान करें",
  "nav.more": "और",
  "nav.login": "साइन इन",
  "home.title": "रुद्र नारायण हिंदू मंदिर",
  "home.subtitle": "लास वेगास में आपका आध्यात्मिक घर",
  "home.bookPooja": "पूजा बुक करें",
  "home.viewCalendar": "कैलेंडर देखें",
  "home.templeHours": "मंदिर समय",
  "home.ourServices": "हमारी सेवाएं",
  "home.upcomingEvents": "आगामी कार्यक्रम",
  "home.supportTemple": "मंदिर का समर्थन करें",
  "home.donateNow": "अभी दान करें",
  "services.title": "पूजा एवं आध्यात्मिक सेवाएं",
  "services.atTemple": "मंदिर में",
  "services.outsideTemple": "मंदिर के बाहर",
  "services.all": "सभी",
  "services.search": "सेवाएं खोजें...",
  "services.bookNow": "बुक करें",
  "services.inquire": "पूछताछ",
  "services.duration": "अवधि",
  "services.price": "मूल्य",
  "donate.title": "हमारे मंदिर का समर्थन करें",
  "donate.subtitle": "आपका दान मंदिर के रखरखाव और सामुदायिक कार्यक्रमों में मदद करता है",
  "donate.amount": "दान राशि",
  "donate.fund": "फंड चुनें",
  "donate.recurring": "आवर्ती दान बनाएं",
  "donate.dollarADay": "एक डॉलर एक दिन कार्यक्रम",
  "donate.zelle": "Zelle से दान करें",
  "donate.thankYou": "आपकी उदारता के लिए धन्यवाद!",
  "common.submit": "जमा करें",
  "common.cancel": "रद्द करें",
  "common.save": "सहेजें",
  "common.close": "बंद करें",
  "common.loading": "लोड हो रहा है...",
  "common.learnMore": "और जानें",
};

// Tamil translations
const ta: TranslationKeys = {
  "nav.home": "முகப்பு",
  "nav.services": "சேவைகள்",
  "nav.calendar": "நாட்காட்டி",
  "nav.panchangam": "பஞ்சாங்கம்",
  "nav.donate": "நன்கொடை",
  "nav.more": "மேலும்",
  "nav.login": "உள்நுழை",
  "home.title": "ருத்ர நாராயண இந்து கோவில்",
  "home.subtitle": "லாஸ் வேகாஸில் உங்கள் ஆன்மீக இல்லம்",
  "home.bookPooja": "பூஜை முன்பதிவு",
  "home.viewCalendar": "நாட்காட்டி பார்",
  "home.templeHours": "கோவில் நேரம்",
  "home.ourServices": "எங்கள் சேவைகள்",
  "home.upcomingEvents": "வரவிருக்கும் நிகழ்வுகள்",
  "home.supportTemple": "கோவிலுக்கு ஆதரவு",
  "home.donateNow": "இப்போது நன்கொடை",
  "services.title": "பூஜை மற்றும் ஆன்மீக சேவைகள்",
  "services.atTemple": "கோவிலில்",
  "services.outsideTemple": "கோவிலுக்கு வெளியே",
  "services.all": "அனைத்தும்",
  "services.search": "சேவைகள் தேடு...",
  "services.bookNow": "முன்பதிவு",
  "services.inquire": "விசாரி",
  "services.duration": "காலம்",
  "services.price": "விலை",
  "donate.title": "எங்கள் கோவிலுக்கு ஆதரவு",
  "donate.subtitle": "உங்கள் நன்கொடை கோவில் பராமரிப்பு மற்றும் சமூக நிகழ்ச்சிகளுக்கு உதவுகிறது",
  "donate.amount": "நன்கொடை தொகை",
  "donate.fund": "நிதியை தேர்வு",
  "donate.recurring": "தொடர் நன்கொடை",
  "donate.dollarADay": "ஒரு நாள் ஒரு டாலர்",
  "donate.zelle": "Zelle வழியாக நன்கொடை",
  "donate.thankYou": "உங்கள் தாராள மனதிற்கு நன்றி!",
  "common.submit": "சமர்ப்பி",
  "common.cancel": "ரத்து",
  "common.save": "சேமி",
  "common.close": "மூடு",
  "common.loading": "ஏற்றுகிறது...",
  "common.learnMore": "மேலும் அறிய",
};

// Stub remaining languages with English for now
const kn = { ...en };
const mr = { ...en };
const ml = { ...en };
const gu = { ...en };
const bn = { ...en };
const pa = { ...en };

export const translations: Record<Locale, TranslationKeys> = {
  en,
  te,
  hi,
  ta,
  kn,
  mr,
  ml,
  gu,
  bn,
  pa,
};

export function t(key: keyof TranslationKeys, locale: Locale = "en"): string {
  return translations[locale]?.[key] ?? translations.en[key] ?? key;
}
