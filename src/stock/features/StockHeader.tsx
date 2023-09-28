'use client'
import { Box, Button, Flex, Heading, Icon } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { PiPlantBold } from 'react-icons/pi'

// interface StockHeaderProps {
//     navigateToCreatePeople: () => void;
// }

const StockHeader = () => {
    const router = useRouter();
    const navigateToCreateStock = useCallback(
        () => router.push("/stock/create"),
        [router]
    );

    const navigateToSell = useCallback(
        () => router.push("/stock/sales"),
        [router]
    );

    return (
        <Flex justify="space-between" wrap='wrap' gap={1}>
            <Heading justifyContent='center'>Stock</Heading>

            <Box display='flex' gap={2} flexWrap={{ base: 'wrap' }} justifyContent='center' >
                <Button
                    variant="outline"
                    onClick={navigateToCreateStock}
                    colorScheme="teal"
                >
                    Crear producto
                </Button>

                <Button
                    variant="outline"
                    onClick={navigateToSell}
                    colorScheme="teal"
                >
                    Vender
                </Button>
            </Box>
        </Flex>
    );
};

export default StockHeader;