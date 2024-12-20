import { Doctype } from "./doctype";

export interface Customer {
    id: number,
    razon_social: string,
    last_name: string,
    name: string,
    email: string,
    phone: string,
    cellphone: string,
    doc_number: string,
    designer: string,
    enable?: string,
    supplier?: string,
    created_at?: Date,
    updated_at?: Date,
    tax_condition: number,
    doc_type: number
}
