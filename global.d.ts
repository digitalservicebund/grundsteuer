import "@remix-run/server-runtime";

declare module "@remix-run/server-runtime" {
  interface AppLoadContext {
    clientIp: string;
    online: boolean;
  }
}

export {};
