import type { CollectionEntry } from 'astro:content';

type Project = CollectionEntry<'projects'>['data'];

/** Inline style for letterboxed previews (previewFit: contain). */
export function mediaStyle(project: Project): string | undefined {
  return project.previewFit === 'contain'
    ? `object-fit: contain; background-color: ${project.previewBackdrop}`
    : undefined;
}

export function hasVideo(project: Project): boolean {
  return Boolean(project.preview.webm || project.preview.mp4);
}
