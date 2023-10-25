'use client'
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { AiOutlineClose } from "react-icons/ai";

const StockCreateHeader = () => {
    const router = useRouter();
    const navigateToStockList = useCallback(
        () => router.push("/stock"),
        [router]
    );

    return (
        <Flex justify="space-between" wrap='wrap' gap={1}>
            <Link href='/stock'>
                <Heading justifyContent='center' as='h1'>Stock</Heading>
            </Link>

            <Box display='flex' gap={2} flexWrap={{ base: 'wrap' }} justifyContent='center' >
                <Button
                    variant="outline"
                    onClick={navigateToStockList}
                    colorScheme="teal"
                    leftIcon={<AiOutlineClose />}
                >
                    Volver a la lista de stock
                </Button>

            </Box>
        </Flex>
    );
};

export default StockCreateHeader;