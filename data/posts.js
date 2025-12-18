// Sample blog posts data
export const posts = [
    {
        id: 1,
        slug: 'taqwa-importance-in-islam',
        title: 'তাকওয়া: মুসলিম জীবনের মূল ভিত্তি',
        excerpt: 'তাকওয়া শব্দের অর্থ আল্লাহভীতি বা সতর্কতা। এটি একজন মুসলিমের জীবনের সবচেয়ে গুরুত্বপূর্ণ গুণ। কুরআনে আল্লাহ তাআলা বারবার তাকওয়া অর্জনের কথা বলেছেন।',
        content: `
      <h2>তাকওয়ার পরিচয়</h2>
      <p>তাকওয়া আরবি শব্দ যার অর্থ আল্লাহভীতি, সতর্কতা বা পরহেজগারিতা। এটি একজন মুসলিমের জীবনের সবচেয়ে গুরুত্বপূর্ণ গুণ।</p>
      
      <h2>কুরআনে তাকওয়ার গুরুত্ব</h2>
      <p>আল্লাহ তাআলা বলেন: "হে মুমিনগণ! তোমরা আল্লাহকে ভয় কর এবং সত্যবাদীদের সাথে থাক।" (সূরা তওবা: ১১৯)</p>
      
      <h2>তাকওয়া অর্জনের উপায়</h2>
      <ul>
        <li>সর্বদা আল্লাহর স্মরণে থাকা</li>
        <li>নামায ও রোযা নিয়মিত আদায় করা</li>
        <li>হারাম থেকে বিরত থাকা</li>
        <li>সৎকর্ম বেশি বেশি করা</li>
      </ul>
    `,
        category: 'আকীদাহ',
        categorySlug: 'aqeedah',
        tags: ['তাকওয়া', 'ঈমান', 'আল্লাহভীতি'],
        date: '১৫ ডিসেম্বর, ২০২৪',
        readTime: 5,
        hasAudio: true,
        audioSrc: '/audio/taqwa.mp3'
    },
    {
        id: 2,
        slug: 'benefits-of-salah',
        title: 'নামাযের ফযীলত ও উপকারিতা',
        excerpt: 'নামায ইসলামের দ্বিতীয় স্তম্ভ এবং মুসলিম জীবনের সবচেয়ে গুরুত্বপূর্ণ ইবাদত। নামাযের মাধ্যমে বান্দা সরাসরি আল্লাহর সাথে সংযোগ স্থাপন করে।',
        content: `
      <h2>নামায কেন গুরুত্বপূর্ণ?</h2>
      <p>নামায হলো দ্বীন ইসলামের স্তম্ভ। এটি মুমিন এবং কাফিরের মধ্যে পার্থক্য নির্ণয়কারী।</p>
    `,
        category: 'ফিকহ',
        categorySlug: 'fiqh',
        tags: ['নামায', 'ইবাদত', 'ফরজ'],
        date: '১২ ডিসেম্বর, ২০২৪',
        readTime: 7,
        hasAudio: false
    },
    {
        id: 3,
        slug: 'ramadan-fasting-guide',
        title: 'রমযান মাসে রোযার মাসআলা',
        excerpt: 'রমযান মাসে রোযা রাখা প্রতিটি প্রাপ্তবয়স্ক মুসলিমের উপর ফরয। রোযার বিধি-বিধান সম্পর্কে জানা প্রতিটি মুসলিমের কর্তব্য।',
        content: `
      <h2>রোযার ফরযসমূহ</h2>
      <p>রোযার দুটি ফরয রয়েছে: নিয়ত করা এবং সুবহে সাদিক থেকে সূর্যাস্ত পর্যন্ত খাওয়া-দাওয়া থেকে বিরত থাকা।</p>
    `,
        category: 'ফিকহ',
        categorySlug: 'fiqh',
        tags: ['রমযান', 'রোযা', 'সিয়াম'],
        date: '১০ ডিসেম্বর, ২০২৪',
        readTime: 10,
        hasAudio: true,
        audioSrc: '/audio/ramadan.mp3'
    },
    {
        id: 4,
        slug: 'surah-fatiha-tafsir',
        title: 'সূরা ফাতিহার তাফসীর',
        excerpt: 'সূরা ফাতিহা কুরআনের প্রথম সূরা এবং সবচেয়ে গুরুত্বপূর্ণ সূরাগুলোর একটি। প্রতিটি নামাযে এই সূরা পড়া ফরয।',
        content: `
      <h2>সূরা ফাতিহার পরিচয়</h2>
      <p>সূরা ফাতিহা মক্কায় অবতীর্ণ হয়েছে। এতে ৭টি আয়াত রয়েছে।</p>
    `,
        category: 'তাফসীর',
        categorySlug: 'tafsir',
        tags: ['কুরআন', 'তাফসীর', 'সূরা ফাতিহা'],
        date: '৮ ডিসেম্বর, ২০২৪',
        readTime: 12,
        hasAudio: true,
        audioSrc: '/audio/fatiha.mp3'
    },
    {
        id: 5,
        slug: 'prophet-sunnah-importance',
        title: 'সুন্নাহ অনুসরণের গুরুত্ব',
        excerpt: 'রাসূলুল্লাহ সাল্লাল্লাহু আলাইহি ওয়াসাল্লামের সুন্নাহ অনুসরণ করা প্রতিটি মুসলিমের জন্য অত্যাবশ্যক। সুন্নাহ ছাড়া ইসলাম অসম্পূর্ণ।',
        content: `
      <h2>সুন্নাহ কী?</h2>
      <p>সুন্নাহ বলতে রাসূলুল্লাহ সাল্লাল্লাহু আলাইহি ওয়াসাল্লামের কথা, কাজ এবং অনুমোদন বুঝায়।</p>
    `,
        category: 'হাদীস',
        categorySlug: 'hadith',
        tags: ['সুন্নাহ', 'হাদীস', 'রাসূল'],
        date: '৫ ডিসেম্বর, ২০২৪',
        readTime: 8,
        hasAudio: false
    },
    {
        id: 6,
        slug: 'halal-rizq-earning',
        title: 'হালাল রিযিক উপার্জনের গুরুত্ব',
        excerpt: 'ইসলামে হালাল উপার্জন একটি গুরুত্বপূর্ণ বিষয়। হারাম উপার্জন ইবাদত কবুল হওয়ার পথে বাধা সৃষ্টি করে।',
        content: `
      <h2>হালাল রিযিকের গুরুত্ব</h2>
      <p>আল্লাহ তাআলা পবিত্র এবং তিনি শুধু পবিত্র জিনিস গ্রহণ করেন।</p>
    `,
        category: 'মুআমালাত',
        categorySlug: 'muamalat',
        tags: ['হালাল', 'রিযিক', 'ব্যবসা'],
        date: '১ ডিসেম্বর, ২০২৪',
        readTime: 6,
        hasAudio: true,
        audioSrc: '/audio/halal-rizq.mp3'
    }
];

// Categories data
export const categories = [
    { name: 'তাফসীর', slug: 'tafsir', count: 25, description: 'কুরআনুল কারীমের ব্যাখ্যা ও বিশ্লেষণ' },
    { name: 'হাদীস', slug: 'hadith', count: 30, description: 'রাসূলুল্লাহ (সা.)-এর হাদীস সংকলন' },
    { name: 'ফিকহ', slug: 'fiqh', count: 40, description: 'ইসলামী আইন ও বিধি-বিধান' },
    { name: 'আকীদাহ', slug: 'aqeedah', count: 15, description: 'ইসলামী বিশ্বাস ও ঈমান' },
    { name: 'সীরাত', slug: 'sirat', count: 20, description: 'নবী (সা.)-এর জীবনী' },
    { name: 'আখলাক', slug: 'akhlaq', count: 18, description: 'ইসলামী চরিত্র ও আচরণ' },
    { name: 'মুআমালাত', slug: 'muamalat', count: 12, description: 'লেনদেন ও ব্যবসা-বাণিজ্য' },
    { name: 'তাযকিয়া', slug: 'tazkiyah', count: 22, description: 'আত্মশুদ্ধি ও অন্তরের পরিচ্ছন্নতা' }
];

// Get posts by category
export function getPostsByCategory(categorySlug) {
    return posts.filter(post => post.categorySlug === categorySlug);
}

// Get post by slug
export function getPostBySlug(slug) {
    return posts.find(post => post.slug === slug);
}

// Get recent posts
export function getRecentPosts(count = 5) {
    return posts.slice(0, count);
}
