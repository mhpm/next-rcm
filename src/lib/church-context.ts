export function getChurchSlugFromHost(host: string): string {
  const cleanHost = host.split(':')[0];

  if (cleanHost.includes('.')) {
    const parts = cleanHost.split('.');

    if (
      parts.length >= 3 &&
      (parts[1] === 'myapp' || parts[1] === 'churchapp')
    ) {
      return parts[0];
    }

    return parts[0];
  }

  return 'default';
}

export function isValidChurchSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/;
  return slugRegex.test(slug);
}
