import { getDictionary } from '@/i18n/get-dictionary';
import { Locale } from '@/i18n/config';
import { ChevronLeft, ChevronRight, Info, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function DocItemPage({
  params,
}: {
  params: Promise<{ lang: Locale; category: string; item: string }>;
}) {
  const { lang, category, item } = await params;
  const dict = await getDictionary(lang);
  const d = dict.docs;

  const categoryData = d.categories[category as keyof typeof d.categories];
  if (!categoryData) notFound();

  const itemTitle = categoryData.items[
    item as keyof typeof categoryData.items
  ] as string;
  if (!itemTitle) notFound();

  return (
    <article className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <Link
          href={`/${lang}/docs`}
          className="hover:text-primary transition-colors"
        >
          Docs
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-900 font-medium">
          {(categoryData.title as string).split(' ')[1] || categoryData.title}
        </span>
      </nav>

      {/* Header */}
      <div className="space-y-4 border-b border-slate-100 pb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          {itemTitle}
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Learn more about {itemTitle.toLowerCase()} and how to make the most of
          this feature in MultiplyNet.
        </p>
      </div>

      {/* Placeholder Content */}
      <div className="prose prose-slate prose-lg max-w-none">
        <p>
          This is a detailed guide about <strong>{itemTitle}</strong>. In this
          section, you will find information about:
        </p>

        <ul className="list-disc pl-6 space-y-2 text-slate-700">
          <li>Basic concepts and terminology.</li>
          <li>Step-by-step configuration guide.</li>
          <li>Best practices for church leadership.</li>
          <li>Common troubleshooting and tips.</li>
        </ul>

        <div className="my-8 p-6 rounded-2xl bg-blue-50 border border-blue-100 flex gap-4">
          <Info className="h-6 w-6 text-blue-500 shrink-0" />
          <div className="text-sm text-blue-800 leading-relaxed">
            <strong className="block mb-1">Note</strong>
            Our team is working on detailed screenshots and video tutorials for
            this specific module. Stay tuned for updates!
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6">
          Key Benefits
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 my-8">
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
            <Lightbulb className="h-5 w-5 text-amber-500 mb-2" />
            <h4 className="font-bold text-slate-900 text-sm mb-1">
              Improved Efficiency
            </h4>
            <p className="text-xs text-slate-600">
              Automate repetitive tasks and focus on pastoral care.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
            <Rocket className="h-5 w-5 text-blue-500 mb-2" />
            <h4 className="font-bold text-slate-900 text-sm mb-1">
              Better Tracking
            </h4>
            <p className="text-xs text-slate-600">
              Get real-time insights into your church growth.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6">
          Common Questions
        </h2>
        <div className="space-y-4">
          <details className="group border border-slate-100 rounded-xl overflow-hidden transition-all hover:border-slate-200">
            <summary className="flex items-center justify-between p-4 cursor-pointer bg-slate-50/50 font-medium text-slate-900">
              How do I get started with {itemTitle.toLowerCase()}?
              <ChevronRight className="h-4 w-4 group-open:rotate-90 transition-transform" />
            </summary>
            <div className="p-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
              You can access this module directly from your main dashboard
              navigation. Follow the on-screen prompts for initial setup.
            </div>
          </details>
          <details className="group border border-slate-100 rounded-xl overflow-hidden transition-all hover:border-slate-200">
            <summary className="flex items-center justify-between p-4 cursor-pointer bg-slate-50/50 font-medium text-slate-900">
              Is this feature available on the Free plan?
              <ChevronRight className="h-4 w-4 group-open:rotate-90 transition-transform" />
            </summary>
            <div className="p-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
              Most core features are available on all plans, though some
              advanced reporting metrics might require a Plus or Premium
              subscription.
            </div>
          </details>
        </div>
      </div>

      {/* Pagination */}
      <div className="pt-12 border-t border-slate-100 flex items-center justify-between gap-4">
        <Link
          href={`/${lang}/docs`}
          className="flex flex-col gap-1 px-6 py-4 rounded-2xl border border-slate-100 hover:border-primary/20 hover:bg-slate-50 transition-all text-left group"
        >
          <span className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
            <ChevronLeft className="h-3 w-3" /> Previous
          </span>
          <span className="font-bold text-slate-900 group-hover:text-primary transition-colors">
            Introduction
          </span>
        </Link>
        <div className="flex flex-col gap-1 px-6 py-4 rounded-2xl border border-slate-100 text-right opacity-50 cursor-not-allowed">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center justify-end gap-1">
            Next <ChevronRight className="h-3 w-3" />
          </span>
          <span className="font-bold text-slate-900">Next Article</span>
        </div>
      </div>
    </article>
  );
}

const Rocket = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.71.71-2.53 0-3.24L4.5 16.5z" />
    <path d="m10 10-3 3c-.71.71-2.53.71-3.24 0L3 12.26c-1.5-1.26-2-5-2-5s3.74-.5 5-2c.71-.71 2.53-.71 3.24 0L10 6" />
    <path d="M15 9h.01" />
    <path d="M16 8h.01" />
    <path d="M17 7h.01" />
    <path d="M18 6h.01" />
    <path d="M19 5h.01" />
    <path d="M20 4h.01" />
    <path d="M21 3h.01" />
    <path d="M9 15h.01" />
    <path d="M10 14h.01" />
    <path d="M11 13h.01" />
    <path d="M12 12h.01" />
    <path d="M13 11h.01" />
    <path d="M14 10h.01" />
    <path d="m15 5 6 6" />
    <path d="m11 9 4 4" />
    <path d="m13 11 6 6" />
    <path d="M17 13h.01" />
    <path d="M18 12h.01" />
    <path d="M19 11h.01" />
    <path d="M20 10h.01" />
    <path d="M21 9h.01" />
    <path d="M22 8h.01" />
  </svg>
);
