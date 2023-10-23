'use client'
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Center,
    Text,
    Button,
    Link,
    Modal,
    ModalHeader,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    Badge,
    ModalFooter,
    useDisclosure,
    useToast,
    IconButton,
    Input,
    Box,
    Flex,
} from '@chakra-ui/react'
import ProductRepository from '../data/repository/Product.repository';
import { useEffect, useState } from 'react';
import Product from '../data/interfaces/Product';
import formatDatetime from '../../shared/utils/formatDate';
import Loading from '@/app/loading';
import { OxygenFont, RobotoFont, RubikFont, scFont } from '@/shared/utils/fonts';
import { FiTrash2 } from 'react-icons/fi';
import StockSearchbar from './StockSearchbar';


export default function StockList() {

    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [data, setData] = useState<Product[] | null>(null);
    const [initialData, setInitialData] = useState<Product[]>();
    // const [filteredData, setFilteredData] = useState<Product[] | null>(null);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [isDeleted, setIsDeleted] = useState<boolean>(false)
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
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
        if (searchBarValue) {
            const filteredData = initialData?.filter((prod: Product) => prod.name.toUpperCase().includes(searchBarValue?.toUpperCase()));
            filteredData ? setData(filteredData) : setData(initialData)
        } else {
            setData(initialData)
        }

    }, [searchBarValue])

    function openDeleteModal(id: number, name: string) {
        setDeleteProdId(id)
        setDeleteProdName(name)
        onOpen()
        setDeleteModal(true)
    }

    async function deleteProd() {
        try {
            const prod = await ProductRepository.delete(deleteProdId)
            setIsDeleted(true)
            toast({
                title: 'Producto eliminado con éxito',
                description: 'Se ha eliminado el producto del stock exitosamente',
                status: 'success',
                duration: 3500,
                isClosable: true,
                position: 'top-right'
            })
            onClose()
            return prod
        } catch (error) {
            setError('Error al eliminar un producto')
        }
    }




    return (
        <>

            {
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
                        ) : data?.length >= 1 ? (
                            <>
                                <TableContainer>
                                    <Table size='sm'>
                                        <Thead>
                                            <Tr>
                                                <Th textAlign='center' className={RubikFont.className} fontSize='0.85rem'>Nombre</Th>
                                                <Th textAlign='center' className={RubikFont.className} fontSize='0.85rem'>Cantidad</Th>
                                                <Th textAlign='center' className={RubikFont.className} fontSize='0.85rem'>Precio de compra</Th>
                                                <Th textAlign='center' className={RubikFont.className} fontSize='0.85rem'>Precio de venta</Th>
                                                <Th textAlign='center' className={RubikFont.className} fontSize='0.85rem'>Último ingreso</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {
                                                data.map((prod: Product) => (
                                                    <Tr key={prod.id}>
                                                        <Td>
                                                            <Badge fontSize='1em' colorScheme='green'>
                                                                {prod.name}
                                                            </Badge>
                                                        </Td>
                                                        <Td>
                                                            <Text className={scFont.className} fontSize='1.2rem' textAlign='center'>{prod.quantity.toFixed(2)} {prod.unit}</Text>
                                                        </Td>
                                                        <Td>
                                                            <Text className={scFont.className} fontSize='1.2rem' textAlign='center'>${prod.buyPrice}</Text>
                                                        </Td>
                                                        <Td>
                                                            <Text className={scFont.className} fontSize='1.2rem' textAlign='center'>${prod.sellPrice}</Text>
                                                        </Td>
                                                        <Td>
                                                            <Text className={scFont.className} fontSize='1.2rem' textAlign='center'>{formatDatetime(prod.updatedAt)}</Text>
                                                        </Td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            <Link href={`stock/${prod.id.toString()}`} mr='2'>
                                                                <Button colorScheme='teal'>Añadir</Button>
                                                            </Link>
                                                            <IconButton
                                                                colorScheme='red'
                                                                variant="outline"
                                                                aria-label="open menu"
                                                                icon={<FiTrash2 />}
                                                                onClick={() => openDeleteModal(prod.id, prod.name)}
                                                            />
                                                        </td>
                                                    </Tr>
                                                ))
                                            }
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                            </>
                        ) : (
                            <Center>
                                <Flex gap={5} alignItems='center'>
                                    <strong>No hay productos, deseas crear uno nuevo?</strong>
                                    <Link href='stock/create'>
                                        <Button colorScheme='teal'>Crear</Button>
                                    </Link>
                                </Flex>
                            </Center>
                        )
                    }
                </>
            }

            {/* modal */}
            {
                deleteModal ? (
                    <Modal
                        isOpen={isOpen}
                        onClose={onClose}
                        isCentered
                        size='xl'
                        motionPreset='slideInBottom'>
                        <ModalOverlay />
                        <ModalContent >
                            <ModalHeader className={RobotoFont.className} textAlign='center' display='flex' justifyContent='center' alignItems='center' gap={2}>
                                ¿Deseas eliminar el producto <Badge fontSize='1em' colorScheme='green'>
                                    {deleteProdName}
                                </Badge>?
                            </ModalHeader>
                            <ModalCloseButton />

                            <ModalFooter>
                                <Button colorScheme='red' mr={3} onClick={onClose}>
                                    Cancelar
                                </Button>
                                <Button colorScheme='green' onClick={deleteProd}>
                                    Confirmar
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal >
                ) : (<></>)
            }

        </>
    )
}
