import SalesList from '@/sales/features/SalesList/SalesList'
import MainHeader from '@/shared/components/Header'
import PageLayout from '@/shared/components/layouts/pageLayout'
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

