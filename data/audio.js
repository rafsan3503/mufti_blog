// Sample audio content data
export const audioContent = [
    {
        id: 1,
        slug: 'taqwa-lecture',
        title: 'তাকওয়ার গুরুত্ব - বয়ান',
        description: 'তাকওয়া অর্জনের উপায় এবং বর্তমান সময়ে তাকওয়ার প্রয়োজনীয়তা সম্পর্কে আলোচনা।',
        duration: '২৫:৩০',
        durationSeconds: 1530,
        category: 'আকীদাহ',
        categorySlug: 'aqeedah',
        date: '১৫ ডিসেম্বর, ২০২৪',
        src: '/audio/taqwa-lecture.mp3'
    },
    {
        id: 2,
        slug: 'surah-yasin-tilawat',
        title: 'সূরা ইয়াসীন - তিলাওয়াত',
        description: 'সূরা ইয়াসীনের সুমধুর তিলাওয়াত।',
        duration: '১২:৪৫',
        durationSeconds: 765,
        category: 'তাফসীর',
        categorySlug: 'tafsir',
        date: '১২ ডিসেম্বর, ২০২৪',
        src: '/audio/yasin.mp3'
    },
    {
        id: 3,
        slug: 'ramadan-preparation',
        title: 'রমযানের প্রস্তুতি',
        description: 'রমযান মাসকে স্বাগত জানাতে কীভাবে প্রস্তুতি নেওয়া উচিত সে বিষয়ে আলোচনা।',
        duration: '৩৫:২০',
        durationSeconds: 2120,
        category: 'ফিকহ',
        categorySlug: 'fiqh',
        date: '১০ ডিসেম্বর, ২০২৪',
        src: '/audio/ramadan-prep.mp3'
    },
    {
        id: 4,
        slug: 'morning-evening-adhkar',
        title: 'সকাল-সন্ধ্যার যিকির',
        description: 'প্রতিদিন সকাল ও সন্ধ্যায় পড়ার জন্য সুন্নাহ সম্মত দোয়া ও যিকির।',
        duration: '১৮:১৫',
        durationSeconds: 1095,
        category: 'তাযকিয়া',
        categorySlug: 'tazkiyah',
        date: '৮ ডিসেম্বর, ২০২৪',
        src: '/audio/adhkar.mp3'
    },
    {
        id: 5,
        slug: 'sirat-nabawi-part1',
        title: 'সীরাতুন্নবী - পর্ব ১',
        description: 'রাসূলুল্লাহ সাল্লাল্লাহু আলাইহি ওয়াসাল্লামের জীবনী - প্রথম পর্ব: জন্ম ও শৈশব।',
        duration: '৪২:০০',
        durationSeconds: 2520,
        category: 'সীরাত',
        categorySlug: 'sirat',
        date: '৫ ডিসেম্বর, ২০২৪',
        src: '/audio/sirat-part1.mp3'
    },
    {
        id: 6,
        slug: 'halal-haram-income',
        title: 'হালাল-হারাম উপার্জন',
        description: 'ইসলামে হালাল উপার্জনের গুরুত্ব এবং হারাম থেকে বাঁচার উপায়।',
        duration: '২৮:৫০',
        durationSeconds: 1730,
        category: 'মুআমালাত',
        categorySlug: 'muamalat',
        date: '১ ডিসেম্বর, ২০২৪',
        src: '/audio/halal-haram.mp3'
    }
];

// Get audio by category
export function getAudioByCategory(categorySlug) {
    return audioContent.filter(audio => audio.categorySlug === categorySlug);
}

// Get audio by slug
export function getAudioBySlug(slug) {
    return audioContent.find(audio => audio.slug === slug);
}

// Get recent audio
export function getRecentAudio(count = 4) {
    return audioContent.slice(0, count);
}
