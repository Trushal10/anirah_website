'use client';

import { Calendar, Clock, ArrowRight, TrendingUp } from 'lucide-react';
import { ScrollAnimation, StaggerContainer, StaggerItem } from '@/components/ui/ScrollAnimation';
import { useAppStore } from '@/store/app';
import { richTextToPlainText } from '@/lib/rich-text';

interface BlogPost { id: string; title: string; slug: string; excerpt: string; coverImage?: string | null; category: string; readTime: string; createdAt: string }
type Props = {
  blogs: BlogPost[];
};

export default function BlogSection({blogs}: Props) {
  const { navigate } = useAppStore();

  return (
    <section className="section-pad bg-gray-50/80">
      <div className="section-shell">
        <ScrollAnimation className="text-center mb-12">
          <span className="section-kicker mb-4">
            Insights & Resources
          </span>
          <h2 className="section-heading mb-4">
            Latest from our <span className="text-brand-600">knowledge hub</span>
          </h2>
          <p className="section-copy max-w-2xl mx-auto">
            Stay informed with expert articles on business registration, compliance,
            government schemes, and industry insights to make better decisions for your business.
          </p>
        </ScrollAnimation>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" staggerDelay={0.1}>
          {blogs.map((post) => {
          const date = new Date(post.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          });

          return (
            <StaggerItem key={post.id}>
              <article onClick={() => navigate('blog-detail', post.slug)} className="surface-card surface-card-hover group h-full flex cursor-pointer flex-col overflow-hidden">
                
                {/* Thumbnail (same design) */}
                {post.coverImage ? (
                  <div className="h-48 overflow-hidden">
                    <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                ) : (
                  <div className="h-44 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center relative overflow-hidden">
                    <span className="relative text-3xl font-bold text-gray-300 tracking-widest">
                      BLOG
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  
                  {/* Category + Date */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700">
                      {post.category}
                    </span>

                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {date}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors leading-snug">
                    {post.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3 flex-1">
                    {richTextToPlainText(post.excerpt)}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>

                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 group-hover:gap-2 transition-all">
                      Read More
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>

              </article>
            </StaggerItem>
          );
        })}
        </StaggerContainer>

        <ScrollAnimation className="text-center mt-10">
          <a
            href="#"
            onClick={(event) => {
              event.preventDefault();
              navigate('blog');
            }}
            className="secondary-action"
          >
            View All Articles
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </ScrollAnimation>
      </div>
    </section>
  );
}
