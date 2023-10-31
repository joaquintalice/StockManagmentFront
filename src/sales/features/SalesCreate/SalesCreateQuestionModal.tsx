import { RobotoFont } from '@/shared/utils/fonts';
import { Badge, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react'

interface questionModalProps {
    isOpen: boolean
    onClose: () => void

}

const SalesCreateQuestionModal: React.FC<questionModalProps> = ({ isOpen, onClose }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={() => onClose()}
            isCentered
            size='4xl'
            motionPreset='slideInBottom'
        >
            <ModalOverlay />
            <ModalContent >
                <ModalHeader className={RobotoFont.className} textAlign='center'>
                    ¿Desea generar otra venta?
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text>
                        Presiona
                        <Badge fontSize='1em' colorScheme='green'>
                            Si
                        </Badge> para mantenerte en esta página y generar otra venta.
                    </Text>
                    <Text>
                        Presiona <Badge fontSize='1em' colorScheme='red'>
                            No
                        </Badge> para salir hacia el registro de ventas.
                    </Text>
                </ModalBody>

                <ModalFooter>
                    <Link href='/sales'>
                        <Button colorScheme='red' mr={3}>
                            No
                        </Button>
                    </Link>
                    <Button colorScheme='green' onClick={() => { onClose(); }}>
                        Si
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal >
    )
}

export default SalesCreateQuestionModal