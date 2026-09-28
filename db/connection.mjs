import postgres from 'postgres';

export function connect() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('DATABASE_URL is not set.');
    process.exit(1);
  }
  // TLS follows the URL's sslmode (Neon connection strings include ?sslmode=require); a plain
  // postgres:// URL, as used for local and Docker Compose databases, connects without TLS.
  return postgres(url, { max: 1, onnotice: () => {} });
}
