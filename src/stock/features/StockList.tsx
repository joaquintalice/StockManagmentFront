'use client'
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Text,
    Center,
    Spinner,
    Button,
    Link,
} from '@chakra-ui/react'
import ProductRepository from '../data/repository/Product.repository';
import { useEffect, useState } from 'react';
import Product from '../data/interfaces/Product';
import formatDatetime from '../../shared/utils/formatDate';


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
                setLoading(false);
                setError(null)
                return productData
            } catch (error) {
                setLoading(false)
                setError('No hay ningún producto registrado');
            }
        }
        getData();
    }, []);


    return (
        <>
            {error ? (<Center><Text>{error}</Text></Center>) :
                loading ? (<Center mt='5rem'><Spinner color='red.500' size='lg' /></Center>) :
                    data ? (
                        <>

                            <TableContainer>
                                <Table size='md'>
                                    <Thead>
                                        <Tr>
                                            <Th>Nombre</Th>
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
                                                        <Text>{prod.quantity} kilos</Text>
                                                    </Td>
                                                    <Td>
                                                        <Text>{prod.buyPrice}$</Text>
                                                    </Td>
                                                    <Td>
                                                        <Text>{prod.sellPrice}$</Text>
                                                    </Td>
                                                    <Td>
                                                        <Text>{formatDatetime(prod.date)}</Text>
                                                    </Td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <Link href={`stock/${prod.id.toString()}`}>
                                                            <Button colorScheme='teal'>Editar</Button>
                                                        </Link>
                                                    </td>
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
