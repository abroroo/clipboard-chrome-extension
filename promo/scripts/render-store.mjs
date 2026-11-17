// Renders every Chrome Web Store asset into out/store/ as 24-bit PNG (no alpha).
import { execSync } from "node:child_process";
import { mkdirSync } from "node:fs";
mkdirSync("out/store", { recursive: true });
const ids = ["StoreIcon", "TileSmall", "TileMarquee", "Shot1", "Shot2", "Shot3", "Shot4", "Shot5"];
for (const id of ids) {
  execSync(`npx remotion still ${id} out/store/${id}.raw.png --image-format=png --log=error`, { stdio: "inherit" });
  // strip the alpha channel: the store rejects PNGs with alpha
  execSync(`ffmpeg -y -loglevel error -i out/store/${id}.raw.png -pix_fmt rgb24 out/store/${id}.png && rm out/store/${id}.raw.png`);
  console.log("rendered", id);
}
