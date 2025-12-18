import Header from '@/components/Header';
import Hero from '@/components/Hero';
import PostCard from '@/components/PostCard';
import AudioCard from '@/components/AudioCard';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { posts, categories, getRecentPosts } from '@/data/posts';
import { getRecentAudio } from '@/data/audio';
import styles from './page.module.css';

export default function Home() {
  const recentPosts = getRecentPosts(4);
  const recentAudio = getRecentAudio(4);
  const sidebarCategories = categories.slice(0, 6);

  return (
    <>
      <Header />
      <main>
        <Hero />

        {/* Posts Section */}
        <section className={`section ${styles.postsSection}`}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>সাম্প্রতিক প্রবন্ধ</h2>
                <p className={styles.sectionSubtitle}>ইসলামী জ্ঞান ও জীবনের পথনির্দেশ</p>
              </div>
              <a href="/posts" className="btn btn-outline">সব দেখুন</a>
            </div>

            <div className={styles.contentGrid}>
              <div className={styles.postsGrid}>
                {recentPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>

              <Sidebar
                categories={sidebarCategories}
                recentPosts={posts.slice(0, 4).map(p => ({
                  title: p.title,
                  slug: p.slug,
                  date: p.date,
                  hasAudio: p.hasAudio
                }))}
              />
            </div>
          </div>
        </section>

        {/* Audio Section */}
        <section className={`section ${styles.audioSection}`}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>অডিও লেকচার</h2>
                <p className={styles.sectionSubtitle}>শুনুন ইসলামী বয়ান ও তিলাওয়াত</p>
              </div>
              <a href="/audio" className="btn btn-primary">সব অডিও</a>
            </div>

            <div className={styles.audioGrid}>
              {recentAudio.map((audio) => (
                <AudioCard key={audio.id} audio={audio} />
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className={`section ${styles.categoriesSection}`}>
          <div className="container">
            <div className={styles.sectionHeaderCenter}>
              <h2 className={styles.sectionTitle}>বিভাগসমূহ</h2>
              <p className={styles.sectionSubtitle}>বিষয়ভিত্তিক ইসলামী জ্ঞান অন্বেষণ করুন</p>
            </div>

            <div className={styles.categoriesGrid}>
              {categories.map((category, index) => (
                <a
                  key={index}
                  href={`/category/${category.slug}`}
                  className={styles.categoryCard}
                >
                  <span className={styles.categoryName}>{category.name}</span>
                  <span className={styles.categoryCount}>{category.count} প্রবন্ধ</span>
                  <p className={styles.categoryDesc}>{category.description}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
