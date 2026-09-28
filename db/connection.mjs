import postgres from 'postgres';

export function connect() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('DATABASE_URL is not set.');
    process.exit(1);
  }
  // Neon requires TLS; a local Postgres (localhost/127.0.0.1) does not.
  const local = /@(localhost|127\.0\.0\.1)(:\d+)?\//.test(url);
  return postgres(url, { max: 1, ssl: local ? false : 'require', onnotice: () => {} });
}
