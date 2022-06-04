const dev = process.env.NODE_ENV === "development";
export const _debugLog_ = dev ? console.log : undefined;
