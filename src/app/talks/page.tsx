import { Metadata } from "next";
import { FileText, Video, ExternalLink, FileCode, Sparkles } from "lucide-react";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { talks, Talk } from "@/app/lib/talks";

export const metadata: Metadata = {
  title: "Talks | CodeColorist",
  description: "Conference talks and presentations on security research",
};

function TalkCard({ talk }: { talk: Talk }) {
  const linkItems = [
    { key: "slides", icon: FileText, label: "Slides" },
    { key: "paper", icon: FileCode, label: "Paper" },
    { key: "recording", icon: Video, label: "Recording" },
    { key: "parody", icon: Sparkles, label: "Parody" },
  ] as const;

  return (
    <article className="group relative bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between gap-4 mb-3">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
          {talk.conference} {talk.year}
        </span>
        {talk.links.event && (
          <a
            href={talk.links.event}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="Event page"
          >
            <ExternalLink size={16} />
          </a>
        )}
      </div>

      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 leading-snug">
        {talk.links.event ? (
          <a
            href={talk.links.event}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {talk.title}
          </a>
        ) : (
          talk.title
        )}
      </h2>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {talk.speakers.join(", ")}
      </p>

      <div className="flex flex-wrap gap-2">
        {linkItems.map(
          ({ key, icon: Icon, label }) =>
            talk.links[key] && (
              <a
                key={key}
                href={talk.links[key]}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Icon size={14} />
                {label}
              </a>
            )
        )}
      </div>
    </article>
  );
}

export default function Page() {
  // Group talks by year
  const talksByYear = talks.reduce(
    (acc, talk) => {
      if (!acc[talk.year]) {
        acc[talk.year] = [];
      }
      acc[talk.year].push(talk);
      return acc;
    },
    {} as Record<number, Talk[]>
  );

  const years = Object.keys(talksByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="font-sans min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Header />

      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Talks & Presentations
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Conference presentations on iOS/macOS security research, sandbox
              escapes, and vulnerability exploitation.
            </p>
          </div>

          <div className="space-y-12">
            {years.map((year) => (
              <section key={year}>
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 sticky top-0 bg-gray-50 dark:bg-gray-950 py-2">
                  {year}
                </h2>
                <div className="space-y-4">
                  {talksByYear[year].map((talk, index) => (
                    <TalkCard key={index} talk={talk} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
