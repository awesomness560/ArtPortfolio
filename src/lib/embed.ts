/** Turns a YouTube or Vimeo watch/share URL into its embeddable player URL. */
export function toEmbedUrl(url: string): string {
  const u = new URL(url);
  const host = u.hostname.replace(/^www\./, '');

  if (host === 'youtu.be') return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}`;
  if (host.endsWith('youtube.com') || host === 'youtube-nocookie.com') {
    const id = u.searchParams.get('v') ?? u.pathname.split('/').pop();
    return `https://www.youtube-nocookie.com/embed/${id}`;
  }

  if (host === 'vimeo.com') {
    // Unlisted Vimeo links look like vimeo.com/<id>/<hash>.
    const [id, hash] = u.pathname.split('/').filter(Boolean);
    return `https://player.vimeo.com/video/${id}${hash ? `?h=${hash}` : ''}`;
  }

  return url; // Already an embed URL (e.g. player.vimeo.com).
}
