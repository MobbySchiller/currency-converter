export type HtmlElements = {
    selectFrom: HTMLElement | null,
    selectTo: HTMLElement | null,
    codeSelectFrom: HTMLElement | null,
    codeSelectTo: HTMLElement | null,
    swapButton: HTMLElement | null,
    primaryRate: HTMLElement | null,
    secondaryRate: HTMLElement | null,
}

export type Rate = {
    currency: string,
    code: string,
    mid: number
}

export type Currency = {
    code: string,
    mid: number
}
