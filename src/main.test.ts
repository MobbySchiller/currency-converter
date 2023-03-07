import { addPLN, createOption, calculatePrices } from './main'
import { describe, it, expect } from 'vitest'

const valuesPLN = {
    currency: 'złoty polski',
    code: 'PLN',
    mid: 1
}

const createOptionExpectedOutput = document.createElement('option');
createOptionExpectedOutput.textContent = 'Złoty Polski';
createOptionExpectedOutput.value = valuesPLN.code;
createOptionExpectedOutput.setAttribute('data-mid', String(valuesPLN.mid));

describe('#addPLN', () => {
    it('returns Polish Zloty', () => {
        expect(addPLN([])).toStrictEqual([valuesPLN])
    })
})

describe('#createOption', () => {
    it('returns option element', () => {
        expect(createOption(valuesPLN)).toStrictEqual(createOptionExpectedOutput)
    })
})

describe('#calculatePrices', () => {
    it('returns {primary: 2, secondary: 0.5}', () => {
        expect(calculatePrices(4, 2)).toStrictEqual({ primary: 2, secondary: 0.5 })
    })
    it('returs {primary: 2.5766, secondary: 0.3881}', () => {
        expect(calculatePrices(10.59, 4.11)).toStrictEqual({ primary: 2.5766, secondary: 0.3881 })
    })
})