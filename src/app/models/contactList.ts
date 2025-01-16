import { Address } from "./address";
import { Doctype } from "./doctype";
import { Taxcondition } from "./taxcondition";

export interface ContactList {
    id: number,
    razon_social: string,
    last_name: string,
    name: string,
    email: string,
    phone: string,
    cellphone: string,
    doc_number: number,
    designer: string,
    enable?: string,
    supplier?: string,
    created_at?: Date,
    updated_at?: Date,
    tax_condition: Taxcondition,
    doc_type: Doctype,
    addresses: Address[]
}
