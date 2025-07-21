import { describe, expect, it } from 'vitest'

import { getRelativeValue, isRelativeValue, normalizeValue } from '../src/utilities.js'

describe('isRelativeValue', () => {
	it('returns true for a percentage value', () => {
		expect(isRelativeValue('0%')).toBe(true)
		expect(isRelativeValue('100%')).toBe(true)
		expect(isRelativeValue('150%')).toBe(true)
		expect(isRelativeValue('20px')).toBe(false)
		expect(isRelativeValue('1.5rem')).toBe(false)
	})
	it('returns true for a unitless value', () => {
		expect(isRelativeValue('')).toBe(false)
		expect(isRelativeValue('0')).toBe(true)
		expect(isRelativeValue('1.5')).toBe(true)
		expect(isRelativeValue(0)).toBe(true)
		expect(isRelativeValue(1.5)).toBe(true)
	})
})

describe('getRelativeValue', () => {
	it('returns a floating point number from a percentage value', () => {
		expect(getRelativeValue('0%')).toBe(0)
		expect(getRelativeValue('100%')).toBe(1)
		expect(getRelativeValue('150%')).toBe(1.5)
		expect(getRelativeValue('20px')).toBe(20)
		expect(getRelativeValue('1.5rem')).toBe(1.5)
	})
	it('returns a floating point number from a unitless value', () => {
		expect(getRelativeValue('0')).toBe(0)
		expect(getRelativeValue('1')).toBe(1)
		expect(getRelativeValue('1.5')).toBe(1.5)
		expect(getRelativeValue('150')).toBe(150)
		expect(getRelativeValue(0)).toBe(0)
		expect(getRelativeValue(1)).toBe(1)
		expect(getRelativeValue(1.5)).toBe(1.5)
		expect(getRelativeValue(150)).toBe(150)
		expect(getRelativeValue('20px')).toBe(20)
		expect(getRelativeValue('1.5rem')).toBe(1.5)
	})
})

describe('normalizeValue', () => {
	it('returns a number from a pixel value', () => {
		expect(normalizeValue('0px', 16)).toBe(0)
		expect(normalizeValue('20px', 16)).toBe(20)
	})
	it('returns a number from a rem value', () => {
		expect(normalizeValue('0rem', 16)).toBe(0)
		expect(normalizeValue('1rem', 16)).toBe(16)
		expect(normalizeValue('1.5rem', 16)).toBe(24)
	})
	it('returns a number from a number value', () => {
		expect(normalizeValue(0, 16)).toBe(0)
		expect(normalizeValue(20, 16)).toBe(20)
	})
})
