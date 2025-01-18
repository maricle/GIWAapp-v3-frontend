import { Contact } from "./contact";
import { EstimateLine } from "./estimateLine";

 
export interface Estimate {
    id?: number,
    doctype?: string,
    date: string,     
    description?: string, 
    tipo_comprobante ?: number,
    doc_number?: number,
    // order?:number,
    puntodeventa:string,
    draft:boolean,
    sent_mail :boolean,
    tag_sucursal :string,
    cae ?: string, 
    contact: number,
    desciption ?: string,
    imp_total?: number,
    // imp_tot_conc?: string,
    imp_neto ?: number,
    // imp_ip_ex ?: string,
    impIVA?: number,
    // impTrib?: string,
    // money ?: string,
    // mon_cotiz ?: string,
    deleted ?: string, 
    lines: EstimateLine[]

}
