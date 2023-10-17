'use client'
import formatDatetime from '@/shared/utils/formatDate'
import { Badge, Button, IconButton, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import ISales from '../data/interfaces/Sales.interface'
import { SalesRepository } from '../data/repository/SalesRepository'

export default function SalesList() {

    const [data, setData] = useState<ISales[]>([{}]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(true);

    useEffect(() => {
        setLoading(false)
        setError(false)
        async function getData() {
            try {
                const data = await SalesRepository.getAll();
                if (!data) {
                    setError(true)
                    return
                }
                setData(data)
                setLoading(false)

            } catch (error) {
                setLoading(true)
            }
        }
        getData()
    }, [])

    return (
        <>


            {
                loading ? (<>Cargando...</>) : (
                    <TableContainer>
                        <Table size='md'>
                            <Thead>
                                <Tr>
                                    <Th textAlign='center' fontSize='0.85rem'>Fecha</Th>
                                    <Th textAlign='center' fontSize='0.85rem'>Total</Th>
                                    <Th textAlign='center' fontSize='0.85rem'>Detalles</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    error ? (<>No hay ventas registradas</>) : data.map((prod: ISales) => (
                                        <Tr key={prod.id}>
                                            <Td textAlign='center'>
                                                <Badge fontSize='1em' colorScheme='green'>
                                                    <Text fontSize='1.2rem' textAlign='center'>{formatDatetime(prod.date)}</Text>
                                                </Badge>
                                            </Td>
                                            <Td>
                                                <Text fontSize='1.2rem' textAlign='center'>{prod.total}$</Text>
                                            </Td>
                                            <td style={{ textAlign: 'center' }}>
                                                <Button colorScheme='teal'>Detalles</Button>
                                            </td>
                                        </Tr>
                                    ))
                                }
                            </Tbody>
                        </Table>
                    </TableContainer>
                )
            }

        </>
    )
}
