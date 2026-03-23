#!/usr/bin/env node
/**
 * Rebuild ticket-ids.json from ticket IDs copied out of Google Sheets (or any CSV-like text).
 *
 * Google Sheets: select the ticket ID column, copy, then either:
 *
 *   # Save paste as sheet-ids.txt (recommended for long lists — avoids shell length limits)
 *   node scripts/update-ticket-ids-from-sheets.js --file sheet-ids.txt
 *
 *   # Or paste into stdin (Unix: Ctrl+D after paste; Windows: Ctrl+Z Enter)
 *   node scripts/update-ticket-ids-from-sheets.js
 *
 *   # Or pipe the clipboard (macOS)
 *   pbpaste | node scripts/update-ticket-ids-from-sheets.js
 *
 * Short lists can be passed as arguments (commas and/or spaces):
 *
 *   node scripts/update-ticket-ids-from-sheets.js 2738561,2738565 2738628
 */

const fs = require('fs');
const path = require('path');

const outPath = path.join(__dirname, '..', 'ticket-ids.json');

function parseIds(text) {
  return text
    .split(/[\s,]+/u)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const n = parseInt(s, 10);
      if (Number.isNaN(n)) {
        console.warn(`Skipping non-numeric token: ${s}`);
        return null;
      }
      return n;
    })
    .filter((n) => n !== null);
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

async function main() {
  const args = process.argv.slice(2);
  const fileIdx = args.indexOf('--file');
  let raw;

  if (fileIdx !== -1) {
    const p = args[fileIdx + 1];
    if (!p) {
      console.error('Missing path after --file');
      process.exit(1);
    }
    args.splice(fileIdx, 2);
    raw = fs.readFileSync(path.resolve(process.cwd(), p), 'utf8');
  } else if (args.length > 0) {
    raw = args.join('\n');
  } else if (!process.stdin.isTTY) {
    raw = await readStdin();
  } else {
    console.error(
      'Usage:\n' +
        '  node scripts/update-ticket-ids-from-sheets.js --file sheet-ids.txt\n' +
        '  node scripts/update-ticket-ids-from-sheets.js <id1,id2,...>\n' +
        '  pbpaste | node scripts/update-ticket-ids-from-sheets.js\n'
    );
    process.exit(1);
  }

  const ids = parseIds(raw);
  if (ids.length === 0) {
    console.error('No valid numeric ticket IDs found.');
    process.exit(1);
  }

  const payload = {
    ticketIds: ids,
    description:
      'Zendesk ticket IDs for browser scripts. Regenerate from Google Sheets with: node scripts/update-ticket-ids-from-sheets.js --file …',
    lastUpdated: new Date().toISOString().slice(0, 10),
    totalTickets: ids.length
  };

  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2) + '\n', 'utf8');
  console.log(`Wrote ${ids.length} ticket IDs to ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
