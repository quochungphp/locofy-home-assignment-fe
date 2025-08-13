export const nodeEnv = process.env.REACT_APP_ENVIRONMENT;

export const serverUrl  : string | undefined =  process.env.REACT_APP_SERVER_URL || "http://localhost:8282/api/v1";

export const googleAppClientId: string =
  process.env.GOOGLE_APP_CLIENT_ID || '1049997005569-580fqd9cofsn4vp70sj0a3v56su4jkv6.apps.googleusercontent.com';
export const googleAppClientSecret: string =
  process.env.GOOGLE_APP_CLIENT_SECRET || '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';

export const apiKey: string =
  process.env.REACT_APP_BACKEND_API_KEY || '7128e63454faba991804da17475ab56f';