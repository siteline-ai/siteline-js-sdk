import { extractIP } from '../utils';

describe('extractIP', () => {
  describe('with Headers object', () => {
    it('extracts from x-forwarded-for (first IP)', () => {
      const headers = new Headers({
        'x-forwarded-for': '203.0.113.1, 198.51.100.1',
      });
      expect(extractIP(headers)).toBe('203.0.113.1');
    });

    it('extracts from x-forwarded-for (single IP)', () => {
      const headers = new Headers({
        'x-forwarded-for': '203.0.113.1',
      });
      expect(extractIP(headers)).toBe('203.0.113.1');
    });

    it('trims whitespace from x-forwarded-for', () => {
      const headers = new Headers({
        'x-forwarded-for': '  203.0.113.1  , 198.51.100.1',
      });
      expect(extractIP(headers)).toBe('203.0.113.1');
    });

    it('extracts from x-real-ip when x-forwarded-for is absent', () => {
      const headers = new Headers({
        'x-real-ip': '203.0.113.2',
      });
      expect(extractIP(headers)).toBe('203.0.113.2');
    });

    it('extracts from cf-connecting-ip when others are absent', () => {
      const headers = new Headers({
        'cf-connecting-ip': '203.0.113.3',
      });
      expect(extractIP(headers)).toBe('203.0.113.3');
    });

    it('prioritizes x-forwarded-for over x-real-ip', () => {
      const headers = new Headers({
        'x-forwarded-for': '203.0.113.1',
        'x-real-ip': '203.0.113.2',
      });
      expect(extractIP(headers)).toBe('203.0.113.1');
    });

    it('prioritizes x-real-ip over cf-connecting-ip', () => {
      const headers = new Headers({
        'x-real-ip': '203.0.113.2',
        'cf-connecting-ip': '203.0.113.3',
      });
      expect(extractIP(headers)).toBe('203.0.113.2');
    });

    it('returns null when no IP headers present', () => {
      const headers = new Headers({
        'content-type': 'application/json',
      });
      expect(extractIP(headers)).toBeNull();
    });
  });

  describe('with plain object', () => {
    it('extracts from x-forwarded-for (string value)', () => {
      const headers = {
        'x-forwarded-for': '203.0.113.1, 198.51.100.1',
      };
      expect(extractIP(headers)).toBe('203.0.113.1');
    });

    it('extracts from x-forwarded-for (array value, first element)', () => {
      const headers = {
        'x-forwarded-for': ['203.0.113.1, 198.51.100.1', '203.0.113.5'],
      };
      expect(extractIP(headers)).toBe('203.0.113.1');
    });

    it('handles empty array', () => {
      const headers = {
        'x-forwarded-for': [],
      };
      expect(extractIP(headers)).toBeNull();
    });

    it('handles undefined values', () => {
      const headers = {
        'x-forwarded-for': undefined,
        'x-real-ip': '203.0.113.2',
      };
      expect(extractIP(headers)).toBe('203.0.113.2');
    });

    it('extracts from x-real-ip', () => {
      const headers = {
        'x-real-ip': '203.0.113.2',
      };
      expect(extractIP(headers)).toBe('203.0.113.2');
    });

    it('extracts from cf-connecting-ip', () => {
      const headers = {
        'cf-connecting-ip': '203.0.113.3',
      };
      expect(extractIP(headers)).toBe('203.0.113.3');
    });

    it('returns null when all headers are undefined', () => {
      const headers = {
        'x-forwarded-for': undefined,
        'x-real-ip': undefined,
        'cf-connecting-ip': undefined,
      };
      expect(extractIP(headers)).toBeNull();
    });

    it('returns null for empty object', () => {
      const headers = {};
      expect(extractIP(headers)).toBeNull();
    });
  });
});
