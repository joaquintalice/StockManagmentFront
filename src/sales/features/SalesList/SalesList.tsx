'use client'
import formatDatetime from '@/shared/utils/formatDate'
import { Badge, Box, Button, Center, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Table, TableContainer, Tag, Tbody, Td, Text, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import ISales from '../../data/interfaces/Sales.interface'
import { SalesRepository } from '../../data/repository/SalesRepository'
import { RobotoFont, scFont } from '@/shared/utils/fonts'
import ICreateSalesDetail from '../../data/interfaces/SalesDetail.interface'
import Loading from '@/app/loading'

export default function SalesList() {


    const { isOpen, onOpen, onClose } = useDisclosure();
    const [data, setData] = useState<ISales[]>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(true);
    const [detailModal, setDetailModal] = useState<boolean>(false)
    const [currentDetailData, setCurrentDetailData] = useState<ICreateSalesDetail[]>([])
    const [currentSale, setCurrentSale] = useState<ISales>()

    const [currentPage, setCurrentPage] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    async function getData() {
        try {
            const itemsPerPage = 10;
            const offset = (currentPage - 1) * itemsPerPage;
            const { stockMovement, totalElements } = await SalesRepository.getAll(offset);


            if (!stockMovement) {
                setError(true)
                return
            }

            const totalPages = Math.ceil(totalElements / itemsPerPage);

            setTotalPages(totalPages)
            setTotalElements(totalElements)
            setData(stockMovement)
            setLoading(false)

        } catch (error) {
            setLoading(false)
            setError(true)
        }
    }

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    useEffect(() => {
        setLoading(true);
        setError(false);
        setDetailModal(false);
        getData();
    }, [currentPage]);


    async function setDetail(data: ICreateSalesDetail[], sale: ISales) {
        setCurrentDetailData(data)
        setCurrentSale(sale)
        setDetailModal(true)
        onOpen()
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const getPageRange = () => {
        const maxButtons = 5;
        let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        let end = start + maxButtons - 1;

        if (end > totalPages) {
            end = totalPages;
            start = Math.max(1, end - maxButtons + 1);
        }

        return Array.from({ length: end - start + 1 }, (_, index) => start + index);
    };

    const pageNumbers = getPageRange()

    return (
        <>


            {
                loading ? (<Loading />) : (
                    <>
                        <Center fontSize={23} alignItems='center' gap={2} display='flex'>
                            <Text>
                                Página:
                            </Text>
                            <Tag colorScheme='green' fontSize={23}>
                                {currentPage}/{totalPages}
                            </Tag>
                        </Center>
                        <Flex justify='center' gap={5}>
                            <Button onClick={handlePreviousPage} isDisabled={currentPage === 1} colorScheme='whatsapp'>
                                Página Anterior
                            </Button>
                            <Box display='flex' gap={2}>
                                {pageNumbers.map((page, index) => (
                                    <Button key={index} colorScheme='teal' onClick={() => handlePageChange(page)}>
                                        {page}
                                    </Button>
                                ))}
                            </Box>
                            <Button onClick={handleNextPage} isDisabled={currentPage * 10 >= totalElements} colorScheme='whatsapp'>
                                Página Siguiente
                            </Button>
                        </Flex>
                        <TableContainer>
                            <Table size='md' variant='striped' colorScheme='whatsapp'>
                                <Thead>
                                    <Tr>
                                        <Th textAlign='center' fontSize='0.85rem'>Fecha</Th>
                                        <Th textAlign='center' fontSize='0.85rem'>Total</Th>
                                        <Th textAlign='center' fontSize='0.85rem'>Detalles</Th>

                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {
                                        error ? (<>No hay ventas registradas</>) :
                                            !data ? (
                                                <Tr>
                                                    <Td>
                                                        < Loading />
                                                    </Td>
                                                </Tr>
                                            ) :
                                                data.map((prod: ISales, index) => (
                                                    <Tr key={index}>
                                                        <Td textAlign='center'>
                                                            <Badge fontSize='1.2em' colorScheme='green' textAlign='center'>
                                                                {formatDatetime(prod.date)}
                                                            </Badge>
                                                        </Td>
                                                        <Td fontSize='1.2rem' textAlign='center'>
                                                            ${prod.total}
                                                        </Td>
                                                        <Td style={{ textAlign: 'center' }}>
                                                            <Button colorScheme='teal' onClick={() => setDetail(prod.stockMovementDetail, prod)}>
                                                                Ver detalles
                                                            </Button>
                                                        </Td>
                                                    </Tr>
                                                ))
                                    }
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </>
                )
            }

            {
                detailModal && (<Modal
                    isOpen={isOpen}
                    onClose={onClose}
                    isCentered
                    size='5xl'
                    motionPreset='slideInBottom'>
                    <ModalOverlay />
                    <ModalContent >
                        <ModalHeader className={RobotoFont.className} textAlign='center' display='flex' justifyContent='center' alignItems='center' gap={3}>
                            Detalles de la venta registrada en la fecha:
                            <Tag colorScheme='green' fontSize={27}>
                                {
                                    formatDatetime(currentSale.date)
                                }
                            </Tag>
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <TableContainer className={scFont.className} mt='1.2rem' fontSize={20}>
                                <Table>
                                    <Thead>
                                        <tr>
                                            <th>
                                                Producto
                                            </th>
                                            <th>
                                                Cantidad
                                            </th>
                                            <th>
                                                Precio de venta
                                            </th>
                                            <th>
                                                Total
                                            </th>
                                        </tr>
                                    </Thead>
                                    <Tbody>
                                        {
                                            currentDetailData.map((producto, index) =>
                                            (
                                                <tr key={index + 20}>
                                                    <Td textAlign='center' fontSize={18}>
                                                        <Tag colorScheme='green' fontSize={17}>
                                                            {
                                                                producto.prodName
                                                            }
                                                        </Tag>
                                                    </Td>
                                                    <Td textAlign='center'>
                                                        {
                                                            producto.quantity
                                                        } {
                                                            producto.unit
                                                        }
                                                    </Td>
                                                    <Td textAlign='center'>
                                                        ${
                                                            producto.sellPrice
                                                        }
                                                    </Td>
                                                    <Td textAlign='center'>
                                                        ${
                                                            (producto.sellPrice * producto.quantity).toFixed(2)
                                                        }
                                                    </Td>
                                                </tr>
                                            )
                                            )
                                        }
                                        {
                                            <tr>
                                                <Td></Td>
                                                <Td></Td>
                                                <Td></Td>
                                                <Td textAlign='center' fontSize={28} fontWeight='bold'>${currentSale.total}</Td>
                                            </tr>
                                        }
                                    </Tbody>
                                </Table>
                            </TableContainer>

                            <Tag colorScheme='teal'>Beneficio total: ${currentDetailData.reduce((totalBenefit, prod) => {
                                const worth = (prod.sellPrice - prod.buyPrice) * prod.quantity;
                                return totalBenefit + worth;
                            }, 0)}</Tag>

                        </ModalBody>

                        <ModalFooter>

                            <Button colorScheme='red' mr={3} onClick={onClose}>
                                Cerrar
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal >)
            }

        </>
    )
}
