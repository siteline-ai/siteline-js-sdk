export const extractIP = (headers: Headers | Record<string, string | string[] | undefined>): string | null => {
  const get = (name: string): string | null => {
    if (headers instanceof Headers) {
      return headers.get(name);
    }
    const value = headers[name];
    if (Array.isArray(value)) {
      return value[0] ?? null;
    }
    return value ?? null;
  };

  return (
    get('x-forwarded-for')?.split(',')[0].trim() ||
    get('x-real-ip') ||
    get('cf-connecting-ip') ||
    null
  );
};
