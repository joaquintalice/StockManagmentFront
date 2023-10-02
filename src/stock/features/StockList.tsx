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
    ModalBody,
    Badge,
    ModalFooter,
    useDisclosure,
    useToast,
} from '@chakra-ui/react'
import ProductRepository from '../data/repository/Product.repository';
import { useEffect, useState } from 'react';
import Product from '../data/interfaces/Product';
import formatDatetime from '../../shared/utils/formatDate';
import Loading from '@/app/loading';
import DeleteModal from '../components/DeleteModal';
import { RobotoFont } from '@/shared/utils/fonts';


export default function StockList() {

    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [data, setData] = useState<Product[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [isDeleted, setIsDeleted] = useState<boolean>(false)
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [deleteProdId, setDeleteProdId] = useState<number>();
    const [deleteProdName, setDeleteProdName] = useState<string>();

    useEffect(() => {
        setIsDeleted(false)
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
    }, [isDeleted]);

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
            {error ? (<Center><Text>{error}</Text></Center>) :
                loading ? (<Loading />) :
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
                                                        <Text>{formatDatetime(prod.updatedAt)}</Text>
                                                    </Td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <Link href={`stock/${prod.id.toString()}`} mr='2'>
                                                            <Button colorScheme='teal'>Editar</Button>
                                                        </Link>
                                                        <Button colorScheme='red' onClick={() => openDeleteModal(prod.id, prod.name)}>x</Button>
                                                    </td>
                                                </Tr>
                                            ))
                                        }
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </>
                    ) : (<Center><Text>No hay data</Text></Center>)}


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
                            <ModalHeader className={RobotoFont.className} textAlign='center'>
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
