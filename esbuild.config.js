import esbuild from "esbuild";
import { copy } from "esbuild-plugin-copy";
import { clean } from "esbuild-plugin-clean";

(async () => {
  const args = process.argv.slice(2);

  const result = await esbuild.build({
    entryPoints: ["src/sw.ts", "src/popup/popup.ts"],
    bundle: true,
    outdir: "dist",
    outbase: "src",
    define: {
      "process.env": "{}",
      "process.env.NODE_ENV": args.includes("--development")
        ? `"development"`
        : `"production"`,
      // global: "window",
    },
    // pure: [""],
    minify: args.includes("--production"),
    metafile: true,
    watch: args.includes("--watch"),
    plugins: [
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
      clean({ patterns: "./dist/*" }),
    ],
  });

  const text = await esbuild.analyzeMetafile(result.metafile);
  console.log(text);
})();
