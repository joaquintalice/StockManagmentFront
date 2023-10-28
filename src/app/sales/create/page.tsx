import PageLayout from '@/shared/components/layouts/pageLayout'
import MainHeader from '@/stock/features/StockHeader'
import React from 'react'
import SalesCreate from '../../../sales/features/SalesCreate/SalesCreate';

export default function SalesPage() {
    return (
        <PageLayout>
            {{
                header: (
                    <MainHeader
                        title='Ventas'
                        btnText='Volver a la lista de ventas'
                        btnHref='/sales'
                    />
                ),
                content: <SalesCreate />,
            }}
        </PageLayout>
    )
}

