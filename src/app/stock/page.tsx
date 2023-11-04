import MainHeader from '@/shared/components/Header';
import PageLayout from '@/shared/components/layouts/pageLayout';
import StockList from '@/stock/features/StockList/StockList';

export default async function StockPage() {


    return (
        <PageLayout>
            {{
                header: (
                    <MainHeader
                        title='Stock'
                        btnHref='/stock/create'
                        btnText='Crear Producto'
                    />
                ),
                content: <StockList />,
            }}
        </PageLayout>
    );
};
