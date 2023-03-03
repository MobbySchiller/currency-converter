import { HtmlElements, Rate, Currency } from './types'
import './scss/styles.scss'

const htmlElements: HtmlElements = {
    selectFrom: document.getElementById('select-from'),
    selectTo: document.getElementById('select-to'),
    codeSelectFrom: document.getElementById('select-from-code'),
    codeSelectTo: document.getElementById('select-to-code'),
    swapButton: document.getElementById('swap-button')
}

let currencyFrom: Currency;
let currencyTo: Currency;

window.addEventListener('load', getData)

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

function addPLN(records: Rate[]) {
    const db = records
    db.push({
        currency: 'polski złoty',
        code: 'PLN',
        mid: 1
    })
    db.sort(compare)
    return db
}

function compare(a: any, b: any) {
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
    console.log(currencyFrom, currencyTo)
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
}

function swapCurrencies(): void {
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



