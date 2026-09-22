import Image from "next/image";
import Link from "next/link";

type CampaignBannerProps = {
  desktop: string;
  mobile: string;
  alt: string;
  href?: string;
  priority?: boolean;
};

export function CampaignBanner({ desktop, mobile, alt, href, priority = false }: CampaignBannerProps) {
  const artwork = (
    <>
      <Image
        src={mobile}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 639px) 100vw, 1px"
        className="object-contain sm:hidden"
        draggable={false}
      />
      <Image
        src={desktop}
        alt={alt}
        fill
        priority={priority}
        sizes="(min-width: 1600px) 1600px, 100vw"
        className="hidden object-contain sm:block"
        draggable={false}
      />
    </>
  );

  return (
    <section className="border-b border-ink bg-ink">
      <div className="relative mx-auto aspect-[9/16] w-full max-w-[1600px] overflow-hidden sm:aspect-video">
        {href ? (
          <Link href={href} className="absolute inset-0 focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-blood">
            {artwork}
          </Link>
        ) : (
          artwork
        )}
      </div>
    </section>
  );
}
