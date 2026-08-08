import { describe, it } from 'node:test';
import assert from 'node:assert';
import { DRAX_QUOTES } from '../src/js/constants.js';

describe('Constants Business Logic', () => {
    it('should have DRAX_QUOTES array with correct values', () => {
        assert.ok(Array.isArray(DRAX_QUOTES));
        assert.ok(DRAX_QUOTES.length > 0);
        assert.ok(DRAX_QUOTES.includes('I AM A WARRIOR!'));
        assert.ok(DRAX_QUOTES.includes('NOTHING GOES OVER MY HEAD!'));
        assert.ok(DRAX_QUOTES.includes('DESTROY!'));
    });
});
