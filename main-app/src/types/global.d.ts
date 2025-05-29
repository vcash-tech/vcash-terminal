export {};

declare global {
  interface Window {
    api: {
      print: (voucherCode: string) => Promise<string>;
    };
  }
}
