import MainHeader from '@/shared/components/Header';
import PageLayout from '@/shared/components/layouts/pageLayout'
import StockCreate from '@/stock/features/StockCreate/StockCreate';



export default async function StockPage() {


    return (
        <PageLayout>
            {{
                header: (
                    <MainHeader
                        title='Stock'
                        btnHref='/stock'
                        btnText='Volver a la lista de stock'
                    />
                ),
                content: <StockCreate />,
            }}
        </PageLayout>
    );
};
