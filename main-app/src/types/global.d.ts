export {};

declare global {
  interface Window {
    api: {
      print: () => Promise<string>;
    };
  }
}
