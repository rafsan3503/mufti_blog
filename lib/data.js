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
