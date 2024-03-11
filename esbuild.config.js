import esbuild from "esbuild";
import { copy } from "esbuild-plugin-copy";
import { clean } from "esbuild-plugin-clean";
import { outLocaleMessages } from "./src/_locales/localesOut.js";

const preProcess = (processCallback) => {
  return {
    name: "pre-process",
    setup({ onStart: registerOnStartCallback }) {
      registerOnStartCallback(() => {
        processCallback();
      });
    },
  };
};

const args = process.argv.slice(2);
const settings = {
  entryPoints: ["src/sw.ts", "src/popup/popup.tsx"],
  bundle: true,
  outdir: "dist",
  outbase: "src",
  define: {
    "process.env": "{}",
    "process.env.NODE_ENV": ["--development", "--watch"].some((s) =>
      args.includes(s)
    )
      ? `"development"`
      : `"production"`,
    // global: "window",
  },
  // pure: [""],
  minify: args.includes("--production"),
  metafile: true,
  plugins: [
    clean({ patterns: "./dist/*" }),
    copy({
      assets: [
        {
          from: ["./src/manifest.json", "./src/PTicon.png"],
          to: ["./"],
        },
        {
          from: ["./src/popup/popup.html"],
          to: ["./popup"],
        },
        {
          from: ["./src/popup/images/*"],
          to: ["./popup/images"],
        },
      ],
    }),
    preProcess(() => {
      outLocaleMessages("dist");
    }),
  ],
};

(async () => {
  if (args.includes("--watch")) {
    const ctx = await esbuild.context(settings);
    await ctx.watch();
    console.log("watching...");
  } else {
    const result = await esbuild.build(settings);
    const text = await esbuild.analyzeMetafile(result.metafile);
    console.log(text);
  }
})();
