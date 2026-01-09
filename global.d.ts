declare global {
  interface Window {
    ttq: {
      track: (eventName: string, data?: Record<string, unknown>) => void;
    };
  }
}

export default global;
