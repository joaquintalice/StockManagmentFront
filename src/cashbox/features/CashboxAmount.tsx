'use client'
import { Box, Stat, StatHelpText, StatLabel, StatNumber, Tag, Text } from '@chakra-ui/react'
import CashboxRepository from '../data/repository/CashboxRepository'
import React, { useEffect, useState } from 'react'
import formatDatetime from '@/shared/utils/formatDate';
import ICashbox from '../data/interfaces/ICashbox';

export default function CashboxAmount() {

    const [cashboxData, setCashboxData] = useState<ICashbox>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        setError(false)
        async function getCashbox() {
            const cashbox = await CashboxRepository.getById(1);
            setLoading(false)
            if (!cashbox) {
                setError(true)
            }
            setCashboxData(cashbox)
        }
        getCashbox();
    }, [])

    return (
        <>
            {
                loading ? (
                    <Box>
                        <Text>
                            Loading...
                        </Text>
                    </Box>
                ) :
                    error ? (
                        <Box textAlign='center'>
                            <Text>Caja no registrada</Text>
                        </Box>
                    ) : (
                        <Box textAlign='center'>
                            <Stat >
                                <StatLabel fontSize={40}>Monto actual de la caja</StatLabel>
                                <StatNumber my={5}>
                                    <Tag fontSize={60} colorScheme='green'>
                                        ${cashboxData?.amount}
                                    </Tag>
                                </StatNumber>
                                <StatHelpText fontSize={20} display='flex' justifyContent='center' alignItems='center' gap={3}>
                                    Último registro:
                                    <Tag colorScheme='green' fontSize={20}>
                                        {
                                            formatDatetime(cashboxData?.updatedAt)
                                        }
                                    </Tag>
                                </StatHelpText>
                            </Stat>
                        </Box>
                    )
            }

        </>
    )
}
