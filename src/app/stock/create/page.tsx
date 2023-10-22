import PageLayout from '@/shared/components/layouts/pageLayout'
import StockCreate from '@/stock/features/StockCreate';
import StockCreateHeader from '@/stock/features/StockCreateHeader';


export default async function StockPage() {


    return (
        <PageLayout>
            {{
                header: (
                    <StockCreateHeader />
                ),
                content: <StockCreate />,
            }}
        </PageLayout>
    );
};
