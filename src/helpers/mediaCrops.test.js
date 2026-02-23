import { getCrops, findCropByAlias, findBestCrop } from './mediaCrops';

const sampleMedia = {
  url: '/media/1234/original.jpg',
  crops: [
    { alias: 'thumb', url: '/media/1234/thumb.jpg', width: 320, height: 180 },
    { alias: 'card', url: '/media/1234/card.jpg', width: 600, height: 250 },
    { alias: 'hero', url: '/media/1234/hero.jpg', width: 1600, height: 600 },
  ],
};

describe('mediaCrops helpers', () => {
  test('getCrops returns crops array or empty', () => {
    expect(getCrops(sampleMedia)).toHaveLength(3);
    expect(getCrops(null)).toHaveLength(0);
  });

  test('findCropByAlias finds matching alias', () => {
    expect(findCropByAlias(sampleMedia, 'card')?.url).toBe('/media/1234/card.jpg');
    expect(findCropByAlias(sampleMedia, 'missing')).toBeNull();
  });

  test('findBestCrop prefers alias when provided', () => {
    const c = findBestCrop(sampleMedia, { alias: 'hero', targetWidth: 1200, targetHeight: 400 });
    expect(c.alias).toBe('hero');
  });

  test('findBestCrop chooses best aspect ratio and prefer width', () => {
    const c = findBestCrop(sampleMedia, { targetWidth: 600, targetHeight: 250 });
    expect(c.alias).toBe('card');
  });
});
