'use client'
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

const CashboxHeader = () => {
    const router = useRouter();
    // const navigateToCreateStock = useCallback(
    //     () => router.push("/sales/create"),
    //     [router]
    // );

    return (
        <Flex justify="space-between" wrap='wrap' gap={1}>
            <Link href='/stock'>
                <Heading justifyContent='center' as='h1'>Caja</Heading>
            </Link>

            <Box display='flex' gap={2} flexWrap={{ base: 'wrap' }} justifyContent='center' >
                <Button
                    variant="outline"

                    colorScheme="teal"
                >
                    Cerrar Caja
                </Button>

            </Box>
        </Flex>
    );
};

export default CashboxHeader;