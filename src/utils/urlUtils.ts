export const isValidHttpUrl = (string: string): boolean => {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return false;
  }

  try {
    const hostname = url.hostname;
    const domainPattern = /^[a-zA-Z0-9.-]+$/;
    if (!domainPattern.test(hostname)) {
      return false;
    }

    if (!hostname.includes('.')) {
      return false;
    }
    const parts = hostname.split('.');
    if (parts.length < 2 || parts[parts.length - 1].length === 0) {
      return false;
    }
    const lastPartPattern = /^[a-zA-Z]+$/;
    if (!lastPartPattern.test(parts[parts.length - 1])) {
      if (
        parts.length === 4 &&
        parts.every(
          part => /^\d+$/.test(part) && parseInt(part, 10) >= 0 && parseInt(part, 10) <= 255,
        )
      ) {
        return true;
      } else if (parts.length > 1 && parts.slice(0, -1).every(part => /^\d+$/.test(part))) {
        return true;
      } else {
        return false;
      }
    }
  } catch (_) {
    return false;
  }

  return true;
};

export const getImageUrl = (url: string) => {
  if (!isValidHttpUrl(url)) {
    console.error('Invalid URL, using placeholder');
    return 'https://placehold.co/400x300/png?text=No+Image';
  }

  if (url.includes('imgur.com') && !url.includes('i.imgur.com')) {
    const imgurId = url.split('/').pop();
    if (imgurId) {
      return `https://i.imgur.com/${imgurId}.jpg`;
    }
  }

  return url;
};
