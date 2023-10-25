import PageLayout from '@/shared/components/layouts/pageLayout'
import StockCreate from '@/stock/features/StockCreate/StockCreate';
import StockCreateHeader from '@/stock/features/StockCreate/StockCreateHeader';


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
