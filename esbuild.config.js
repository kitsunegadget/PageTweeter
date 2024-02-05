import esbuild from "esbuild";
import { copy } from "esbuild-plugin-copy";
import { clean } from "esbuild-plugin-clean";

const args = process.argv.slice(2);
const settings = {
  entryPoints: ["src/sw.ts", "src/popup/popup.ts"],
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
          to: ["./dist"],
        },
        {
          from: ["./src/popup/popup.html"],
          to: ["./popup/popup"],
        },
        {
          from: ["./src/popup/images/*"],
          to: ["./popup/images/images"],
        },
        {
          from: ["./src/_locales/**/*"],
          to: ["./_locales"],
          keepStructure: true,
        },
      ],
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
