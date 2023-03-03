import { HtmlElements, Rate, Currency, Prices } from './types'
import './scss/styles.scss'

const htmlElements: HtmlElements = {
    inputFrom: document.getElementById('input-from'),
    inputTo: document.getElementById('input-to'),
    selectFrom: document.getElementById('select-from'),
    selectTo: document.getElementById('select-to'),
    codeSelectFrom: document.getElementById('select-from-code'),
    codeSelectTo: document.getElementById('select-to-code'),
    swapButton: document.getElementById('swap-button'),
    primaryRate: document.getElementById('primary-rate'),
    secondaryRate: document.getElementById('secondary-rate'),
}

let currencyFrom: Currency;
let currencyTo: Currency;

window.addEventListener('load', getData)

if (htmlElements.inputFrom && htmlElements.inputTo) {
    htmlElements.inputFrom.addEventListener('input', (event) => handleInput(event, 'From'))
    htmlElements.inputTo.addEventListener('input', (event) => handleInput(event, 'To'))
}

if (htmlElements.selectFrom && htmlElements.selectTo) {
    htmlElements.selectFrom.addEventListener('change', (event) => changeCurrency(event, 'From'))
    htmlElements.selectTo.addEventListener('change', (event) => changeCurrency(event, 'To'))
}
if (htmlElements.swapButton) {
    htmlElements.swapButton.addEventListener('click', swapCurrencies)
}

async function getData(): Promise<void> {
    try {
        const resp = await fetch('https://api.nbp.pl/api/exchangerates/tables/a?format=json')
        const data = await resp.json()
        const records = await data[0].rates
        const database = await addPLN(records)
        if (htmlElements.selectFrom && htmlElements.selectTo) {
            await addOptions(htmlElements.selectFrom, database)
            await addOptions(htmlElements.selectTo, database)
            currencyFrom = await database[26]
            currencyTo = await database[11]
            displayCurrencies()
        }
    }
    catch (err) {
        console.log(err)
    }
}

function addPLN(records: Rate[]): Rate[] {
    const db = records
    db.push({
        currency: 'polski złoty',
        code: 'PLN',
        mid: 1
    })
    db.sort(compare)
    return db
}

function compare(a: any, b: any): number {
    if (a.currency < b.currency) {
        return -1;
    }
    if (a.currency > b.currency) {
        return 1;
    }
    return 0;
}

function addOptions(selector: HTMLElement, values: Rate[]): void {
    const options = values.map(value => createOption(value))
    options.forEach(option => selector.appendChild(option))
}

function createOption(values: Rate): HTMLOptionElement {
    const { currency, code, mid } = values
    const option: HTMLOptionElement = document.createElement('option')

    const name: string = currency.replace(/\b[a-zA-Ząćęłńóśźż]\S*/g, function (l) {
        return l.charAt(0).toUpperCase() + l.slice(1);
    });

    option.textContent = name
    option.value = code
    option.setAttribute('data-mid', String(mid))

    return option
}

function handleInput(event: Event, type: string): void {
    const userValue = (event.target as HTMLInputElement).value

    const prices = calculatePrices(currencyFrom.mid, currencyTo.mid)

    if (type === 'From' && htmlElements.inputTo instanceof HTMLInputElement) {
        htmlElements.inputTo.value = (Number(userValue) * prices.primary).toFixed(2)
    } else if (type === 'To' && htmlElements.inputFrom instanceof HTMLInputElement) {
        htmlElements.inputFrom.value = (Number(userValue) * prices.secondary).toFixed(2)
    }
}

function changeCurrency(event: Event, type: string): void {
    const code = (event.target as HTMLSelectElement).value
    const selectedOption = (event.target as HTMLSelectElement).options[(event.target as HTMLSelectElement).selectedIndex];
    const selectedOptionMid = selectedOption.getAttribute('data-mid');
    const mid = Number(selectedOptionMid)

    if (type === 'From' && htmlElements.codeSelectFrom) {
        htmlElements.codeSelectFrom.textContent = code
        currencyFrom = {
            code,
            mid
        }
    } else if (type === 'To' && htmlElements.codeSelectTo) {
        htmlElements.codeSelectTo.textContent = code
        currencyTo = {
            code,
            mid
        }
    }
    updateRates()
}

function displayCurrencies(): void {
    if (htmlElements.selectFrom instanceof HTMLSelectElement &&
        htmlElements.selectTo instanceof HTMLSelectElement &&
        htmlElements.codeSelectFrom &&
        htmlElements.codeSelectTo) {
        htmlElements.selectFrom.value = currencyFrom.code
        htmlElements.selectTo.value = currencyTo.code
        htmlElements.codeSelectFrom.textContent = currencyFrom.code
        htmlElements.codeSelectTo.textContent = currencyTo.code
    }
    updateRates()
}

function swapCurrencies(): void {
    swapNames()
    swapValues()
    updateRates()
}

function swapNames(): void {
    const currentCurrencyFrom = currencyFrom
    const currentCurrencyTo = currencyTo
    if (htmlElements.selectFrom instanceof HTMLSelectElement &&
        htmlElements.selectTo instanceof HTMLSelectElement &&
        htmlElements.codeSelectFrom &&
        htmlElements.codeSelectTo) {
        htmlElements.selectFrom.value = currentCurrencyTo.code
        htmlElements.selectTo.value = currentCurrencyFrom.code
        htmlElements.codeSelectFrom.textContent = currentCurrencyTo.code
        htmlElements.codeSelectTo.textContent = currentCurrencyFrom.code
    }
    currencyFrom = currentCurrencyTo
    currencyTo = currentCurrencyFrom
}

function swapValues(): void {
    if (htmlElements.inputFrom instanceof HTMLInputElement &&
        htmlElements.inputTo instanceof HTMLInputElement) {
        const currentInputFromValue = htmlElements.inputFrom.value
        const currentInputToValue = htmlElements.inputTo.value
        htmlElements.inputFrom.value = currentInputToValue
        htmlElements.inputTo.value = currentInputFromValue
    }
}

function updateRates(): void {
    const fromCode = currencyFrom.code
    const toCode = currencyTo.code
    const prices = calculatePrices(currencyFrom.mid, currencyTo.mid)

    if (htmlElements.primaryRate && htmlElements.secondaryRate) {
        htmlElements.primaryRate.textContent = `1 ${fromCode} = ${prices.primary} ${toCode}`
        htmlElements.secondaryRate.textContent = `1 ${toCode} = ${prices.secondary} ${fromCode}`
    }
}

function calculatePrices(fromRate: number, toRate: number): Prices {
    const prices = {
        primary: Number((fromRate / toRate).toFixed(4)),
        secondary: Number((toRate / fromRate).toFixed(4))
    }
    return prices
}



