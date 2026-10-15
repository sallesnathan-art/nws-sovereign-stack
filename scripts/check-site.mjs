import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
const pagePath = resolve(root, "index.html");

function fail(message) {
  console.error("NWS CHECK FAILED: " + message);
  process.exitCode = 1;
}

if (!existsSync(pagePath)) {
  fail("index.html is missing.");
  process.exit();
}

const html = readFileSync(pagePath, "utf8");
const required = [
  ["HTML doctype", /<!doctype html>/i],
  ["English document language", /<html\b[^>]*\blang=["']en["']/i],
  ["viewport metadata", /<meta\b[^>]*name=["']viewport["']/i],
  ["document title", /<title>[^<]+<\/title>/i],
  ["closing body tag", /<\/body>/i],
  ["closing HTML tag", /<\/html>/i],
  ["NWS identity", /did:nws:nathan-wayne-salles-01/],
  ["Node 0x363 identifier", /0x363/i],
  ["honest browser terminal limitation", /does not execute shell commands/i],
  ["unconfigured checkout disclosure", /checkout.*not configured|not configured.*checkout/i],
];

for (const [name, pattern] of required) {
  if (!pattern.test(html)) fail("Missing required element: " + name);
}

const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]);
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
if (duplicates.length) fail("Duplicate HTML id(s): " + [...new Set(duplicates)].join(", "));

const idSet = new Set(ids);
const localLinks = [...html.matchAll(/\bhref=["']#([^"' ]+)["']/g)].map((match) => match[1]);
for (const id of localLinks) {
  if (id && !idSet.has(id)) fail("Broken in-page link: #" + id);
}

const scriptElementIds = [...html.matchAll(/\bel\(["']([^"']+)["']\)/g)].map((match) => match[1]);
for (const id of scriptElementIds) {
  if (!idSet.has(id)) fail("JavaScript references missing element id: " + id);
}

if (/\bhref=["']javascript:/i.test(html)) fail("javascript: URL found in a link.");
if (!/name=["']description["']/i.test(html)) fail("SEO description metadata is missing.");

if (process.exitCode) process.exit();
console.log("NWS site check passed.");
console.log(" - index.html present");
console.log(" - metadata and page structure present");
console.log(" - " + ids.length + " unique id attributes checked");
console.log(" - " + localLinks.length + " in-page links checked");
console.log(" - " + scriptElementIds.length + " JavaScript element references checked");
console.log("Note: this is a project sanity check, not a full HTML standards validator.");
