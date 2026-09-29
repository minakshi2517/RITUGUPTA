"use client";

import { useEffect, useRef } from "react";
import { RichText } from "@/components/site/RichText";

export type DeckCard = {
  id: string;
  number: string;
  title: string;
  body: string;
  quote?: { text: string; attribution: string };
};

function place(index: number, progress: number) {
  if (index === 0) return 0;
  const travel = progress - (index - 1);
  return Math.min(100, Math.max(0, (1 - travel) * 100));
}

export function CardDeck({ cards }: { cards: DeckCard[] }) {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    if (!root || !pin) return;
    const items = [...pin.querySelectorAll<HTMLElement>(".deck-card")];
    let frame = 0;

    const update = () => {
      frame = 0;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        items.forEach((item) => {
          item.style.transform = "none";
        });
        return;
      }
      const pinHeight = pin.offsetHeight;
      const stick = Number.parseFloat(getComputedStyle(pin).top) || 0;
      const total = Math.max(root.offsetHeight - pinHeight, 1);
      const scrolled = Math.min(Math.max(stick - root.getBoundingClientRect().top, 0), total);
      const progress = (scrolled / total) * Math.max(items.length - 1, 1);
      items.forEach((item, index) => {
        item.style.transform = `translate3d(0, ${place(index, progress)}%, 0)`;
      });
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [cards.length]);

  if (cards.length === 0) return null;

  return (
    <section
      ref={rootRef}
      className="card-deck"
      style={{ height: `${cards.length * 100}vh` }}
      aria-label="About"
    >
      <div ref={pinRef} className="card-deck-pin">
        {cards.map((card, index) => (
          <article
            key={card.id}
            className="deck-card"
            style={{
              zIndex: index + 1,
              transform: index === 0 ? "translate3d(0, 0, 0)" : "translate3d(0, 100%, 0)",
            }}
          >
            <p className="label">{card.number}</p>
            <h2 className="mt-3 max-w-3xl font-serif text-4xl tracking-tight md:text-5xl">{card.title}</h2>
            <div className="mt-6 max-w-2xl">
              <RichText text={card.body} />
            </div>
            {card.quote ? (
              <blockquote className="mt-10 max-w-3xl">
                <p className="font-serif text-3xl leading-tight italic md:text-4xl">{card.quote.text}</p>
                {card.quote.attribution ? <footer className="label mt-4">{card.quote.attribution}</footer> : null}
              </blockquote>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
