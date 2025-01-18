export interface EstimateLine {
    id?: number,
    itemName: string,
    description?: string,
    amount: number,
    unit_price: number,
    tax_percentage?: number,
    tax_value?: number,
    itemTotal: number,
    product_id?: number,
    invoice_id?: number,
}