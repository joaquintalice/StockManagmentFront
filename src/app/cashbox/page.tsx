import CashboxAmount from '@/cashbox/features/CashboxAmount'
import MainHeader from '@/shared/components/Header'

import PageLayout from '@/shared/components/layouts/pageLayout'
import React from 'react'

export default function SalesPage() {
    return (
        <PageLayout>
            {{
                header: (
                    <MainHeader
                        title='Caja'
                        btnText='Cerrar caja'
                        btnHref='#'
                    />
                ),
                content: (
                    <CashboxAmount />
                )
            }}
        </PageLayout>
    )
}

