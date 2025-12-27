import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Format date in Bangla
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('bn-BD', options);
}

// Get all published posts
export async function getPosts() {
    const { data, error } = await supabase
        .from('posts')
        .select('*, categories(name, slug)')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching posts:', error);
        return [];
    }

    return data.map(post => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.categories?.name || '',
        categorySlug: post.categories?.slug || '',
        tags: post.tags || [],
        date: formatDate(post.created_at),
        readTime: post.read_time || 5,
        viewCount: post.view_count || 0,
        coverImage: post.cover_image || '',
        hasAudio: false
    }));
}

// Get recent posts
export async function getRecentPosts(count = 6) {
    const { data, error } = await supabase
        .from('posts')
        .select('*, categories(name, slug)')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(count);

    if (error) {
        console.error('Error fetching recent posts:', error);
        return [];
    }

    return data.map(post => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.categories?.name || '',
        categorySlug: post.categories?.slug || '',
        tags: post.tags || [],
        date: formatDate(post.created_at),
        readTime: post.read_time || 5,
        viewCount: post.view_count || 0,
        coverImage: post.cover_image || '',
        hasAudio: false
    }));
}

// Get post by slug
export async function getPostBySlug(slug) {
    const { data, error } = await supabase
        .from('posts')
        .select('*, categories(name, slug)')
        .eq('slug', slug)
        .single();

    if (error || !data) {
        return null;
    }

    return {
        id: data.id,
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        category: data.categories?.name || '',
        categorySlug: data.categories?.slug || '',
        tags: data.tags || [],
        date: formatDate(data.created_at),
        readTime: data.read_time || 5,
        viewCount: data.view_count || 0,
        coverImage: data.cover_image || '',
        hasAudio: false
    };
}

// Get posts by category
export async function getPostsByCategory(categorySlug) {
    const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .single();

    if (!category) return [];

    const { data, error } = await supabase
        .from('posts')
        .select('*, categories(name, slug)')
        .eq('category_id', category.id)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

    if (error) return [];

    return data.map(post => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.categories?.name || '',
        categorySlug: post.categories?.slug || '',
        tags: post.tags || [],
        date: formatDate(post.created_at),
        readTime: post.read_time || 5,
        hasAudio: false
    }));
}

// Get all categories with post counts
export async function getCategories() {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }

    // Get post counts for each category
    const categoriesWithCounts = await Promise.all(
        data.map(async (cat) => {
            const { count } = await supabase
                .from('posts')
                .select('id', { count: 'exact', head: true })
                .eq('category_id', cat.id)
                .eq('status', 'published');

            return {
                id: cat.id,
                name: cat.name,
                slug: cat.slug,
                description: cat.description || '',
                count: count || 0
            };
        })
    );

    return categoriesWithCounts;
}

// Get single category by slug
export async function getCategoryBySlug(slug) {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !data) return null;

    return {
        id: data.id,
        name: data.name,
        slug: data.slug,
        description: data.description || ''
    };
}

// Get all audio
export async function getAudio() {
    const { data, error } = await supabase
        .from('audio')
        .select('*, categories(name, slug)')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching audio:', error);
        return [];
    }

    return data.map(audio => ({
        id: audio.id,
        slug: audio.slug,
        title: audio.title,
        description: audio.description,
        src: audio.file_url,
        duration: audio.duration || '',
        category: audio.categories?.name || '',
        categorySlug: audio.categories?.slug || '',
        date: formatDate(audio.created_at)
    }));
}

// Get recent audio
export async function getRecentAudio(count = 3) {
    const { data, error } = await supabase
        .from('audio')
        .select('*, categories(name, slug)')
        .order('created_at', { ascending: false })
        .limit(count);

    if (error) {
        console.error('Error fetching recent audio:', error);
        return [];
    }

    return data.map(audio => ({
        id: audio.id,
        slug: audio.slug,
        title: audio.title,
        description: audio.description,
        src: audio.file_url,
        duration: audio.duration || '',
        category: audio.categories?.name || '',
        categorySlug: audio.categories?.slug || ''
    }));
}

// Get all post slugs (for static generation)
export async function getAllPostSlugs() {
    const { data } = await supabase
        .from('posts')
        .select('slug')
        .eq('status', 'published');

    return data?.map(p => p.slug) || [];
}

// Get all category slugs (for static generation)
export async function getAllCategorySlugs() {
    const { data } = await supabase
        .from('categories')
        .select('slug');

    return data?.map(c => c.slug) || [];
}

// Get site statistics for Hero section
export async function getStats() {
    try {
        const [postsRes, audioRes, categoriesRes, booksRes] = await Promise.all([
            supabase.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'published'),
            supabase.from('audio').select('id', { count: 'exact', head: true }),
            supabase.from('categories').select('id', { count: 'exact', head: true }),
            supabase.from('books').select('id', { count: 'exact', head: true }).eq('is_published', true)
        ]);

        return {
            posts: postsRes.count || 0,
            audio: audioRes.count || 0,
            categories: categoriesRes.count || 0,
            books: booksRes.count || 0
        };
    } catch (error) {
        console.error('Error fetching stats:', error);
        return { posts: 0, audio: 0, categories: 0, books: 0 };
    }
}

// ============ BOOKS ============

// Get all published books
export async function getBooks() {
    const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching books:', error);
        return [];
    }

    return data.map(book => ({
        id: book.id,
        title: book.title,
        slug: book.slug,
        author: book.author || 'মুফতি আনিছুর রহমান',
        description: book.description,
        coverImage: book.cover_image,
        viewCount: book.view_count || 0,
        createdAt: formatDate(book.created_at)
    }));
}

// Get recent books
export async function getRecentBooks(count = 3) {
    const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(count);

    if (error) {
        console.error('Error fetching recent books:', error);
        return [];
    }

    return data.map(book => ({
        id: book.id,
        title: book.title,
        slug: book.slug,
        author: book.author || 'মুফতি আনিছুর রহমান',
        description: book.description,
        coverImage: book.cover_image,
        viewCount: book.view_count || 0,
        createdAt: formatDate(book.created_at)
    }));
}

// Get single book by slug with chapters
export async function getBookBySlug(slug) {
    const { data: book, error } = await supabase
        .from('books')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

    if (error || !book) return null;

    // Get chapters
    const { data: chapters } = await supabase
        .from('chapters')
        .select('id, title, chapter_number')
        .eq('book_id', book.id)
        .order('chapter_number', { ascending: true });

    return {
        id: book.id,
        title: book.title,
        subtitle: book.subtitle || '',
        slug: book.slug,
        author: book.author || 'মুফতি আনিছুর রহমান',
        description: book.description,
        coverImage: book.cover_image,
        // Front Matter
        publisher: book.publisher || '',
        publishDate: book.publish_date || '',
        price: book.price || '',
        dedication: book.dedication || '',
        publisherNote: book.publisher_note || '',
        authorPreface: book.author_preface || '',
        // Back Matter
        conclusion: book.conclusion || '',
        qaContent: book.qa_content || '',
        // Chapters
        chapters: chapters || [],
        totalChapters: chapters?.length || 0,
        // View count
        viewCount: book.view_count || 0
    };
}

// Get chapter content
export async function getChapter(bookSlug, chapterNum) {
    // First get the book
    const { data: book } = await supabase
        .from('books')
        .select('id, title, slug')
        .eq('slug', bookSlug)
        .single();

    if (!book) return null;

    // Get the chapter
    const { data: chapter, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('book_id', book.id)
        .eq('chapter_number', parseInt(chapterNum))
        .single();

    if (error || !chapter) return null;

    // Get total chapters for navigation
    const { count: totalChapters } = await supabase
        .from('chapters')
        .select('id', { count: 'exact', head: true })
        .eq('book_id', book.id);

    // Parse pages from content (stored as JSON array or split by page break)
    let pages = [];
    try {
        // If content is stored as JSON array of pages
        if (chapter.content && chapter.content.startsWith('[')) {
            pages = JSON.parse(chapter.content);
        } else {
            // Split by page break marker or treat as single page
            pages = chapter.content ? chapter.content.split('<!-- pagebreak -->').map(p => p.trim()).filter(p => p) : [''];
        }
    } catch (e) {
        pages = [chapter.content || ''];
    }

    return {
        id: chapter.id,
        title: chapter.title,
        pages: pages,
        totalPages: pages.length,
        chapterNumber: chapter.chapter_number,
        totalChapters: totalChapters || 0,
        book: {
            id: book.id,
            title: book.title,
            slug: book.slug
        }
    };
}

// ============ VIEW COUNTS ============

// Increment post view count
export async function incrementPostView(postId) {
    const { data } = await supabase
        .from('posts')
        .select('view_count')
        .eq('id', postId)
        .single();

    const currentCount = data?.view_count || 0;

    await supabase
        .from('posts')
        .update({ view_count: currentCount + 1 })
        .eq('id', postId);
}

// Increment book view count
export async function incrementBookView(bookId) {
    const { data } = await supabase
        .from('books')
        .select('view_count')
        .eq('id', bookId)
        .single();

    const currentCount = data?.view_count || 0;

    await supabase
        .from('books')
        .update({ view_count: currentCount + 1 })
        .eq('id', bookId);
}

// Get post view count
export async function getPostViewCount(postId) {
    const { data } = await supabase
        .from('posts')
        .select('view_count')
        .eq('id', postId)
        .single();

    return data?.view_count || 0;
}
