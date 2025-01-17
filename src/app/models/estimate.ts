import { EstimateLine } from "./estimateLine";

 
export interface Estimate {
    id?: number,
    doctype: string,
    date: Date,     
    description?: string, 
    tipo_comprobante ?: number,
    doc_number?: number,
    // order?:number,
    puntodeventa:string,
    draft:boolean,
    sent_mail :boolean,
    tag_sucursal :string,
    cae ?: string, 
    contact: any,
    desciption ?: string,
    imp_total?: number,
    // imp_tot_conc?: string,
    imp_neto ?: number,
    // imp_ip_ex ?: string,
    // impIVA?: string,
    // impTrib?: string,
    // money ?: string,
    // mon_cotiz ?: string,
    deleted ?: string, 
    lines: EstimateLine[]

}
