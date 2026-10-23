import SweatMap from "../src/sweatmap.ts";

//Runs fn and prints how long it took
const time = (label: string, fn: () => void): void => {
  const start = performance.now();

  fn();

  console.log(`${label.padEnd(40)}${(performance.now() - start).toFixed(1).padStart(10)} ms`);
};

const setKeys = (myMap: SweatMap, count: number, prefix = "key"): void => {
  for (let i = 0; i < count; i++) myMap.set(`${prefix}${String(i)}`);
};

time("constructor", () => new SweatMap());
time("constructor + first set()", () => new SweatMap().set("first"));
time("constructor + first set() (custom ranges)", () =>
  new SweatMap({ additional_ranges: { "a-z": { start: "61", end: "7A" } } }).set("first"),
);

for (const count of [1_000, 5_000, 20_000, 100_000]) {
  time(`set() x${count.toLocaleString("en-US")}`, () => {
    setKeys(new SweatMap(), count);
  });
  time(`set() x${count.toLocaleString("en-US")} (cssSafe)`, () => {
    setKeys(new SweatMap({ cssSafe: true }), count);
  });
}

const myMap = new SweatMap({ cssSafe: true });

setKeys(myMap, 20_000);
time("delete() + set() after 20,000 keys", () => {
  myMap.delete("key10000");
  myMap.set("replacement");
});

time("bytes() x100,000", () => {
  for (let i = 0; i < 100_000; i++) myMap.bytes("my-class-name-☃");
});
time("cssSafeString() x100,000", () => {
  for (let i = 0; i < 100_000; i++) myMap.cssSafeString("my-class-name");
});
