// Combines coverage reports
const fs = require('fs');
const reports = ['/packages/backend/coverage.txt', '/packages/frontend/coverage.txt']
let coverages = 0;

const run = async () => {
  await reports.forEach(async (report) => {
    const contents = await fs.readFileSync(process.cwd() + report, 'utf-8')
    const result = contents.match(/All\sfiles.*?\s+(.\d\d.\d\d)/);
    const coverage = result[1].trim()
    coverages += parseFloat(coverage)
  })

  console.log(coverages / reports.length)
}

run();

return coverages;