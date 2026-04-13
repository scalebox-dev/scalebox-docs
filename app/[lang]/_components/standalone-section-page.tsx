import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';

type SectionCard = {
  title: string;
  description: string;
};

type StandaloneSectionPageProps = {
  lang: string;
  title: string;
  description: string;
  cards: SectionCard[];
};

export function StandaloneSectionPage({
  lang,
  title,
  description,
  cards,
}: StandaloneSectionPageProps) {
  return (
    <HomeLayout {...baseOptions(lang)}>
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12">
        <section className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
          <p className="max-w-3xl text-base text-fd-muted-foreground">{description}</p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <article
              key={card.title}
              className="rounded-lg border border-fd-border bg-fd-card p-5"
            >
              <h2 className="text-base font-semibold">{card.title}</h2>
              <p className="mt-2 text-sm text-fd-muted-foreground">{card.description}</p>
            </article>
          ))}
        </section>
      </main>
    </HomeLayout>
  );
}
