export default function monetize(quantity: number) {
    if (Math.abs(quantity) >= 1_000_000) {
        return `${(quantity / 1_000_000).toFixed(2)}m`
    }

    if (Math.abs(quantity) >= 1_000) {
        return `${(quantity / 1_000).toFixed(2)}k`
    }

    return `${quantity.toFixed(2)}`
}