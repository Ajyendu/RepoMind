export const dynamic = "force-dynamic";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { getPublishedPosts } from "@/lib/services/blog-service";
import { ArrowRight, Calendar } from "lucide-react";
import Footer from "@/components/Footer";
import { BlogPost } from "@prisma/client";
import MagazineWindow from "@/components/MagazineWindow";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Insights - RepoMind Engineering & Security Blog",
  description: "Deep dives into Agentic CAG, AI-driven code analysis, and high-speed security scanning on GitHub.",
};

export default async function BlogIndex() {
  let posts: BlogPost[] = [];
  try {
    posts = await getPublishedPosts();
  } catch (error) {
    console.warn("⚠️ Could not load published blog posts during build or runtime", error);
  }

  const featuredPost = posts[0];
  const regularPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-white text-black">
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-6 py-14">
        <div className="mb-12 flex items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-5xl mb-3">Recent posts</h1>
            <p className="text-neutral-600 max-w-xl">
              Notes on Agentic CAG, code understanding, and developer productivity.
            </p>
          </div>
          <Link href="/" className="hidden sm:inline-flex bg-black text-white text-[10px] font-bold tracking-[0.18em] uppercase px-5 py-2.5 rounded-full">
            Analyze a repo
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="py-24 text-center border-2 border-dashed border-black">
            <Calendar className="mx-auto mb-6" size={32} />
            <h2 className="font-display text-3xl mb-4">Insights coming soon</h2>
            <p className="text-neutral-600 max-w-md mx-auto">
              Check back soon for deep dives and engineering updates.
            </p>
          </div>
        ) : (
          <>
            {featuredPost && (
              <Link href={`/blog/${featuredPost.slug}`} className="block mb-12">
                <MagazineWindow label="Featured" serial="NO. 019">
                  <div className="grid md:grid-cols-2">
                    <div className="relative aspect-video md:aspect-auto md:min-h-[280px] bg-neutral-900">
                      <Image
                        src={featuredPost.image}
                        alt={featuredPost.title}
                        fill
                        className="object-cover grayscale"
                      />
                    </div>
                    <div className="p-6 md:p-8">
                      <p className="text-[11px] uppercase tracking-widest text-neutral-500 mb-3">
                        {featuredPost.category} · {featuredPost.date}
                      </p>
                      <h2 className="font-display text-3xl mb-4">{featuredPost.title}</h2>
                      <p className="text-neutral-600 mb-6 line-clamp-3">{featuredPost.excerpt}</p>
                      <span className="inline-flex items-center gap-1 text-xs font-bold tracking-[0.16em] uppercase">
                        Read <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </MagazineWindow>
              </Link>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {regularPosts.map((post, index) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <MagazineWindow label="Post" serial={`NO. 0${22 + index}`}>
                    <div className="relative aspect-video bg-neutral-200">
                      <Image src={post.image} alt={post.title} fill className="object-cover grayscale" />
                    </div>
                    <div className="p-5">
                      <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2">
                        {post.category} · {post.date}
                      </p>
                      <h3 className="font-display text-2xl leading-snug">{post.title}</h3>
                    </div>
                  </MagazineWindow>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
