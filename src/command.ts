import yargs from "yargs/yargs";
import { promises as fs } from "fs";
import { mbtiles2tilejson } from ".";

const argv = yargs(process.argv.slice(2))
  .option("output", {
    type: "string",
    alias: "o",
    description: "Filepath to output generated TileJSON",
  })
  .option("url", {
    type: "string",
    description: "(Require) Base URL of tiles {url}{z}/{x}/{y}.{format}",
    demandOption: true,
  })
  .help()
  .parseSync();

const main = async () => {
  const input = argv._[0] as string;
  if (!input || input === "") {
    console.info("Usage:");
    console.info("\tmbtiles2tilejson [.mbtiles] {options}");
    console.info("\tmbtiles2tilejson --help");
    process.exit(1);
  }
  const output = await mbtiles2tilejson(input, argv.url);
  if (argv.output) {
    await fs.writeFile(argv.output, output);
  } else {
    console.log(output);
  }
};

(async () => {
  try {
    await main();
  } catch (error) {
    console.error(error);
  }
})();
