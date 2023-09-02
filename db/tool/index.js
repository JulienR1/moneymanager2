import { readFileSync } from "fs";
import { join } from "path";

const [_, __, args] = process.argv;
let input = args ?? "";

if (input === "") {
  process.stdin.on("readable", () => {
    let chunk;
    while (null !== (chunk = process.stdin.read())) {
      input += chunk;
    }
  });

  process.stdin.on("end", main);
} else {
  main();
}

function main() {
  let completeScript = "";

  const files = input.split(/\s/).filter((s) => s.length > 0);
  for (const file of files) {
    const script = readFileSync(join(process.cwd(), "scripts", file), "utf-8");
    completeScript += script + "\n";
  }

  process.stdout.write(completeScript);
}
