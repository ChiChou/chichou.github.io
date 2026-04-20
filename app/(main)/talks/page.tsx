import type { Metadata } from "next";
import { OptimizedImage } from "@/components/optimized-image";
import { getAllTalks, type Talk } from "@/lib/talks";
import { FileText, Video, Calendar, FileCode, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Talks | CodeColorist",
};

const linkIcons: Record<string, React.ReactNode> = {
  event: <Calendar className="w-4 h-4" />,
  slides: <FileText className="w-4 h-4" />,
  paper: <FileCode className="w-4 h-4" />,
  recording: <Video className="w-4 h-4" />,
  parody: <Sparkles className="w-4 h-4" />,
};

const linkLabels: Record<string, string> = {
  event: "Event",
  slides: "Slides",
  paper: "Paper",
  recording: "Video",
  parody: "Parody",
};

function FeaturedTalkCard({ talk }: { talk: Talk }) {
  return (
    <article className="group lg:col-span-12 relative aspect-[21/9] max-lg:aspect-video overflow-hidden rounded-2xl">
      {talk.cover ? (
        <>
          <OptimizedImage
            src={talk.cover}
            alt={talk.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-cyber/0 group-hover:bg-cyber/5 transition-colors duration-500" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50" />
      )}
      <div className="relative z-10 h-full flex flex-col justify-end p-6 lg:p-10 text-white">
        <div className="flex items-center gap-2 text-sm lg:text-base opacity-70 tracking-wide uppercase">
          <span className="font-medium">{talk.conference}</span>
          <span>/</span>
          <span>{talk.year}</span>
        </div>
        <h2 className="mt-2 text-2xl lg:text-4xl 2xl:text-5xl font-bold leading-tight max-w-4xl">
          {talk.title}
        </h2>
        <p className="mt-2 text-base lg:text-lg opacity-80">
          {talk.speakers.join(", ")}
        </p>
        {Object.keys(talk.links).length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
            {(Object.entries(talk.links) as [string, string][])
              .filter(([, url]) => url)
              .map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-cyber/20 text-sm text-white hover:text-cyber transition-colors"
                >
                  {linkIcons[key]}
                  <span>{linkLabels[key]}</span>
                </a>
              ))}
          </div>
        )}
      </div>
    </article>
  );
}

function TalkCard({ talk }: { talk: Talk }) {
  return (
    <article className="group lg:col-span-4 relative aspect-[4/3] overflow-hidden rounded-xl">
      {talk.cover ? (
        <>
          <OptimizedImage
            src={talk.cover}
            alt={talk.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-cyber/0 group-hover:bg-cyber/10 transition-colors duration-300" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {talk.conference}
          </span>
        </div>
      )}
      <div className="relative z-10 h-full flex flex-col justify-end p-5 text-white">
        <div className="flex items-center gap-2 text-xs opacity-70 tracking-wide uppercase">
          <span className="font-medium">{talk.conference}</span>
          <span>/</span>
          <span>{talk.year}</span>
        </div>
        <h2 className="mt-1.5 text-lg 2xl:text-xl font-semibold leading-snug line-clamp-2">
          {talk.title}
        </h2>
        <p className="mt-1 text-sm opacity-80 line-clamp-1">
          {talk.speakers.join(", ")}
        </p>
        {Object.keys(talk.links).length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {(Object.entries(talk.links) as [string, string][])
              .filter(([, url]) => url)
              .map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-white/70 hover:text-cyber transition-colors"
                >
                  {linkIcons[key]}
                  <span>{linkLabels[key]}</span>
                </a>
              ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default async function TalksPage() {
  const talks = await getAllTalks();
  const [featured, ...rest] = talks;

  return (
    <main className="max-w-2xl lg:max-w-5xl 2xl:max-w-7xl mx-auto px-4 2xl:px-8 py-8 lg:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
        {featured && <FeaturedTalkCard talk={featured} />}
        {rest.map((talk) => (
          <TalkCard key={talk.slug} talk={talk} />
        ))}
      </div>
    </main>
  );
}
