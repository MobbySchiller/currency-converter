import { HtmlElements, Currency } from './types'
import './scss/styles.scss'

const htmlElements: HtmlElements = {
    selectFrom: document.getElementById('select-from'),
    selectTo: document.getElementById('select-to'),
}

let currencyFrom: Currency;
let currencyTo: Currency;

window.addEventListener('load', getData)

async function getData(): Promise<void> {
    try {
        const resp = await fetch('https://api.nbp.pl/api/exchangerates/tables/a?format=json')
        const data = await resp.json()
        const records = await data[0].rates
        if (htmlElements.selectFrom && htmlElements.selectTo) {
            await addOptions(htmlElements.selectFrom, records)
            await addOptions(htmlElements.selectTo, records)
            currencyFrom = records[2]
            currencyTo = records[4]
            console.log(currencyFrom, currencyTo)
        }
    }
    catch (err) {
        console.log(err)
    }
}

function addOptions(selector: HTMLElement, values: Currency[]): void {
    const options = values.map(value => createOption(value))
    options.forEach(option => selector.appendChild(option))
}

function createOption(values: Currency): HTMLOptionElement {
    const { currency, code, mid } = values
    const option: HTMLOptionElement = document.createElement('option')

    const name: string = currency.replace(/\b[a-zA-Ząćęłńóśźż]\S*/g, function (l) {
        return l.charAt(0).toUpperCase() + l.slice(1);
    });

    option.textContent = name
    option.value = code
    option.setAttribute('data-value', String(mid))

    return option
}


