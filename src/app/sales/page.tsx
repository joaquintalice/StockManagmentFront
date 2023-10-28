import SalesList from '@/sales/features/SalesList/SalesList'
import PageLayout from '@/shared/components/layouts/pageLayout'
import MainHeader from '@/stock/features/StockHeader'
import React from 'react'

export default function SalesPage() {
    return (
        <PageLayout>
            {{
                header: (
                    <MainHeader
                        title='Ventas'
                        btnText='Generar venta'
                        btnHref='/sales/create'
                    />
                ),
                content: <SalesList />,
            }}
        </PageLayout>
    )
}

