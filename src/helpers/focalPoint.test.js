import { focalPointToAnchor } from './focalPoint';

describe('focalPointToAnchor', () => {
  test('returns center when focalPoint missing', () => {
    expect(focalPointToAnchor(null)).toBe('center');
  });

  test('accepts {left,top} shape and formats to x,y', () => {
    expect(focalPointToAnchor({ left: 0.5, top: 0.5 })).toBe('0.50,0.50');
    expect(focalPointToAnchor({ left: 1, top: 0 })).toBe('1.00,0.00');
  });

  test('accepts {x,y} shape', () => {
    expect(focalPointToAnchor({ x: 0.1234, y: 0.9876 })).toBe('0.12,0.99');
  });

  test('clamps out-of-range values', () => {
    expect(focalPointToAnchor({ left: -1, top: 2 })).toBe('0.00,1.00');
  });

  test('returns center if values are not numbers', () => {
    expect(focalPointToAnchor({ left: 'foo', top: 'bar' })).toBe('center');
  });
});
