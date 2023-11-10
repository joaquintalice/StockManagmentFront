'use client'
import formatDatetime from '@/shared/utils/formatDate'
import { Badge, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Table, TableContainer, Tag, Tbody, Td, Text, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react'
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

    useEffect(() => {
        setLoading(false)
        setError(false)
        setDetailModal(false)
        async function getData() {
            try {
                const data = await SalesRepository.getAll();
                if (!data) {
                    setError(true)
                    return
                }
                const sortedDataByMostRecentDate = data.slice().sort((a: ISales, b: ISales) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    return dateB.getTime() - dateA.getTime();
                });
                setData(sortedDataByMostRecentDate)
                setLoading(false)

            } catch (error) {
                setLoading(false)
                setError(true)
            }
        }
        getData()
    }, [])

    async function setDetail(data: ICreateSalesDetail[], sale: ISales) {
        setCurrentDetailData(data)
        setCurrentSale(sale)
        setDetailModal(true)
        onOpen()
    }

    return (
        <>


            {
                loading ? (<Loading />) : (
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
