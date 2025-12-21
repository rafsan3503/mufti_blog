import Header from '@/components/Header';
import Hero from '@/components/Hero';
import PostCard from '@/components/PostCard';
import AudioCard from '@/components/AudioCard';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getRecentPosts, getCategories, getRecentAudio, getStats } from '@/lib/data';
import { getDailyHadith } from '@/data/hadith';
import styles from './page.module.css';

// Static data fallback
import { posts as staticPosts, categories as staticCategories } from '@/data/posts';
import { audioContent as staticAudio } from '@/data/audio';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  // Try to fetch from Supabase, fallback to static data
  let recentPosts = await getRecentPosts(6);
  let categories = await getCategories();
  let recentAudio = await getRecentAudio(3);
  let stats = await getStats();

  // Fallback to static data if Supabase returns empty
  if (recentPosts.length === 0) {
    recentPosts = staticPosts.slice(0, 6);
  }
  if (categories.length === 0) {
    categories = staticCategories;
  }
  if (recentAudio.length === 0) {
    recentAudio = staticAudio?.slice(0, 3) || [];
  }

  const sidebarCategories = categories.slice(0, 6);
  const dailyHadith = getDailyHadith();

  return (
    <>
      <Header />
      <main>
        <Hero stats={stats} />

        {/* Posts Section */}
        <section className={styles.postsSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>সাম্প্রতিক প্রবন্ধ</h2>
                <p className={styles.sectionSubtitle}>ইসলামী জ্ঞান ও জীবনের পথনির্দেশ</p>
              </div>
              <Link href="/posts" className="btn btn-outline">সব দেখুন</Link>
            </div>

            <div className={styles.contentGrid}>
              <div className={styles.postsGrid}>
                {recentPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>

              <Sidebar
                categories={sidebarCategories}
                recentPosts={recentPosts.slice(0, 4).map(p => ({
                  title: p.title,
                  slug: p.slug,
                  date: p.date,
                  hasAudio: p.hasAudio
                }))}
              />
            </div>
          </div>
        </section>

        {/* Daily Hadith Section */}
        <section className={styles.hadithSection}>
          <div className="container">
            <div className={styles.hadithCard}>
              <div className={styles.hadithHeader}>
                <span className={styles.hadithLabel}>আজকের হাদীস</span>
                <span className={styles.hadithSource}>{dailyHadith.source}</span>
              </div>
              <div className={styles.hadithContent}>
                <p className={styles.hadithArabic}>{dailyHadith.arabic}</p>
                <p className={styles.hadithBangla}>{dailyHadith.bangla}</p>
              </div>
              <div className={styles.hadithFooter}>
                <span className={styles.hadithNarrator}>— {dailyHadith.narrator}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Audio Section */}
        <section className={styles.audioSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>অডিও লেকচার</h2>
                <p className={styles.sectionSubtitle}>শুনুন ইসলামী বয়ান ও তিলাওয়াত</p>
              </div>
              <Link href="/audio" className="btn btn-primary">সব অডিও</Link>
            </div>

            <div className={styles.audioGrid}>
              {recentAudio.map((audio) => (
                <AudioCard key={audio.id} audio={audio} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
