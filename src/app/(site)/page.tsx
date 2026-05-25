import type { Metadata } from 'next';
import { ArtistHomePage } from '@/components/press-kit';
import { sherinArtist } from '@/data/artists/sherin';
import { buildArtistMetadata, buildArtistJsonLd } from '@/lib/seo';
import { resolveArtist } from '@/lib/airtable';
import { getRequestedArtistSlug, type ArtistSearchParams } from '@/lib/requested-artist';

type PageProps = {
  searchParams?: ArtistSearchParams;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const artist = await resolveArtist(await getRequestedArtistSlug(searchParams, sherinArtist.slug));
  return buildArtistMetadata(artist, '/');
}

export default async function HomePage({ searchParams }: PageProps) {
  const artist = await resolveArtist(await getRequestedArtistSlug(searchParams, sherinArtist.slug));
  const jsonLd = buildArtistJsonLd(artist);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArtistHomePage artist={artist} />
    </>
  );
}
