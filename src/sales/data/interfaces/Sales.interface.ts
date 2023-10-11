import ISalesDetail from "./SalesDetail.interface"

export default interface ISales {
    id: number
    date: Date
    total: number
    cashBoxId?: number
    stockMovementDetail: ISalesDetail[]
}