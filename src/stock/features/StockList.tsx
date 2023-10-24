'use client'
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    TableContainer,
    Center,
    Text,
    Button,
    Link,
    useDisclosure,
    useToast,
    Flex,
} from '@chakra-ui/react'
import ProductRepository from '../data/repository/Product.repository';
import { useEffect, useState } from 'react';
import Product from '../data/interfaces/Product';
import Loading from '@/app/loading';
import StockSearchbar from './StockListSearchbar';
import StockTableRow from './StockListTableRow';
import DeleteProductModal from './StockListDeleteProductModal';


export default function StockList() {

    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [data, setData] = useState<Product[]>();
    const [initialData, setInitialData] = useState<Product[]>();
    // const [filteredData, setFilteredData] = useState<Product[] | null>(null);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [isDeleted, setIsDeleted] = useState<boolean>(false)
    const [deleteProdId, setDeleteProdId] = useState<number>();
    const [deleteProdName, setDeleteProdName] = useState<string>();

    const [searchBarValue, setSearchBarValue] = useState<string>('');

    useEffect(() => {

        setIsDeleted(false)
        async function getData(): Promise<Product[] | undefined> {
            try {
                setLoading(true)
                const productData = await ProductRepository.getAll();

                productData.sort((a: Product, b: Product): number => {
                    const nameA = a.name.toUpperCase(); // Convierte a mayúsculas para ser case-insensitive
                    const nameB = b.name.toUpperCase();
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                    return 0; // Si los nombres son iguales
                });

                setInitialData(productData)
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
    }, [isDeleted]);

    useEffect(() => {
        setIsDeleted(false);

        async function getData(): Promise<void> {
            try {
                setLoading(true);
                const productData = await ProductRepository.getAll();
                productData.sort((a: Product, b: Product) => a.name.localeCompare(b.name));
                setInitialData(productData);
                setData(productData);
                setLoading(false);
                setError(null);
            } catch (error) {
                setLoading(false);
                setError('No hay ningún producto registrado');
            }
        }

        getData();
    }, [isDeleted]);

    useEffect(() => {
        if (searchBarValue && initialData && initialData.length > 0) {
            const filteredData = initialData.filter((prod) =>
                prod.name.toUpperCase().includes(searchBarValue.toUpperCase())
            );
            setData(filteredData);
        } else {
            setData(initialData);
        }
    }, [searchBarValue, initialData]);

    const openDeleteModal = (id: number, name: string) => {
        setDeleteProdId(id);
        setDeleteProdName(name);
        onOpen();
    };

    const deleteProd = async (): Promise<void> => {
        try {
            if (deleteProdId) {
                await ProductRepository.delete(deleteProdId);
                setIsDeleted(true);
                toast({
                    title: 'Producto eliminado con éxito',
                    description: 'Se ha eliminado el producto del stock exitosamente',
                    status: 'success',
                    duration: 3500,
                    isClosable: true,
                    position: 'top-right',
                });
                onClose();
            }
        } catch (error) {
            setError('Error al eliminar un producto');
        }
    };

    return (
        <>
            {
                !error && <StockSearchbar searchBarValue={searchBarValue} setSearchBarValue={setSearchBarValue} />
            }

            {
                error ? (
                    <Center>
                        <Text>{error}</Text>
                    </Center>
                ) : loading ? (
                    <Loading />
                ) : data && data.length >= 1 ? (
                    <TableContainer>
                        <Table size='sm'>
                            <Thead>
                                <Tr>
                                    <Th textAlign='center'>Nombre</Th>
                                    <Th textAlign='center'>Cantidad</Th>
                                    <Th textAlign='center'>Precio de compra</Th>
                                    <Th textAlign='center'>Precio de venta</Th>
                                    <Th textAlign='center'>Último ingreso</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {data.map((prod) => (
                                    <StockTableRow key={prod.id} product={prod} onDelete={openDeleteModal} />
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Center>
                        <Flex gap={5} alignItems='center'>
                            <strong>No hay productos, ¿deseas crear uno nuevo?</strong>
                            <Link href='stock/create'>
                                <Button colorScheme='teal'>Crear</Button>
                            </Link>
                        </Flex>
                    </Center>
                )
            }

            {
                deleteProdId && deleteProdName && (
                    <DeleteProductModal
                        isOpen={isOpen}
                        onClose={onClose}
                        onConfirm={deleteProd}
                        productName={deleteProdName}
                    />
                )
            }
        </>
    );
}