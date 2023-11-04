import PageLayout from '@/shared/components/layouts/pageLayout'
import React from 'react'
import SalesCreate from '../../../sales/features/SalesCreate/SalesCreate';
import MainHeader from '@/shared/components/Header';

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

