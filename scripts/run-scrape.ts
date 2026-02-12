import { runScrape } from '../lib/scrape';

runScrape().then((r) => {
  console.log(r);
  process.exit(0);
});
