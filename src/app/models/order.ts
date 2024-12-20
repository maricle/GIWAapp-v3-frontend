export interface Order {
    id?: number,
    name: string,
    date: string,
    description: string,
    priority: number,
    contact: number,
    status: number,
    customer_name?: string,
    status_desc?:string

}
