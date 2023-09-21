'use client'
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Button,
    Text,
    Center,
    Heading,
} from '@chakra-ui/react'
import ProductRepository from '../data/repository/Product.repository';
import { useEffect, useState } from 'react';
import Product from '../data/interfaces/Product';

export default function StockList() {
    const [data, setData] = useState<Product[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function getData(): Promise<Product[] | undefined> {
            try {
                setLoading(true)
                const productData = await ProductRepository.getAll();
                setData(productData);
                console.log(productData)
                setLoading(false);
                setError(null)
                return productData
            } catch (error) {
                setLoading(false)
                setError('Error fetching data');
                console.error('Error al obtener datos:', error);
            }
        }

        getData();
    }, []);


    return (
        <>
            {error ? (<Center><Text>{error}</Text></Center>) :
                loading ? (<Center>Cargando...</Center>) :
                    data ? (
                        <>
                            <Center>
                                <Heading as='h1' my='2rem'>
                                    Mercadería
                                </Heading>
                            </Center>
                            <TableContainer>
                                <Table size='md'>
                                    <Thead>
                                        <Tr>
                                            <Th>Nombre</Th>
                                            <Th>Descripción</Th>
                                            <Th>Cantidad</Th>
                                            <Th>Precio de compra</Th>
                                            <Th>Precio de venta</Th>
                                            <Th>Último ingreso</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {
                                            data.map((prod: Product) => (
                                                <Tr key={prod.id}>
                                                    <Td>
                                                        <Text>{prod.name}</Text>
                                                    </Td>
                                                    <Td>
                                                        <Text>{prod.description || 'Sin descripción'}</Text>
                                                    </Td>
                                                    <Td>
                                                        <Text>{prod.quantity} kilos</Text>
                                                    </Td>
                                                    <Td>
                                                        <Text>{prod.buyPrice}$</Text>
                                                    </Td>
                                                    <Td>
                                                        <Text>{prod.sellPrice}$</Text>
                                                    </Td>
                                                    <Td>
                                                        <Text>{prod.date}</Text>
                                                    </Td>
                                                </Tr>
                                            ))
                                        }
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </>
                    ) : (<Center><Text>No hay data</Text></Center>)}
        </>
    )
}
