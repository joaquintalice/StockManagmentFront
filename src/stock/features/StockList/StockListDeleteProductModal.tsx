// DeleteProductModal.js
import React from 'react';
import {
    Modal,
    ModalHeader,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalFooter,
    Button,
} from '@chakra-ui/react';
import { Badge } from '@chakra-ui/react';

interface DeleteProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    productName: string;
}

const DeleteProductModal: React.FC<DeleteProductModalProps> = ({ isOpen, onClose, onConfirm, productName }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size='xl' motionPreset='slideInBottom'>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign='center' display='flex' justifyContent='center' alignItems='center' gap={2}>
                    ¿Deseas eliminar el producto <Badge fontSize='1em' colorScheme='green'>
                        {productName}
                    </Badge>?
                </ModalHeader>
                <ModalCloseButton />

                <ModalFooter>
                    <Button colorScheme='red' mr={3} onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button colorScheme='green' onClick={onConfirm}>
                        Confirmar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DeleteProductModal;