

beforeAll(async () => {
  await page.goto('http://localhost:9000/');
});

it('should be titled "webpack example page"', async () => {
  await expect(page.title()).resolves.toMatch('Webpack example page');
});

it("should have x.y.z preloaded", async () => {
  const link = await page.$("link");

  expect(await link.evaluate(l => l.rel)).toBe('prefetch');
});