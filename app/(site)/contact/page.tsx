import type { Metadata } from "next";
import { ContactForm } from "@/components/site/ContactForm";
import { getSite } from "@/lib/data";
import { linkRel } from "@/lib/utils";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const { settings, links } = await getSite();
  return (
    <div className="shell pb-24 pt-14 md:pt-20">
      <div className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h1 className="section-title">{settings.contactHeading}</h1>
          {settings.contactIntro ? <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">{settings.contactIntro}</p> : null}
          {settings.email ? (
            <a href={`mailto:${settings.email}`} className="mt-8 block font-serif text-2xl italic md:text-3xl">
              {settings.email}
            </a>
          ) : null}
          {links.length > 0 ? (
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
              {links.map((link) => (
                <a key={link.id} href={link.url} className="nav-link" {...linkRel(link.url)}>
                  {link.title}
                </a>
              ))}
            </div>
          ) : null}
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
