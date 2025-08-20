'use client';

import React from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from '@heroui/react';
import { useGeneralStore } from '@/store/generalState';
import CharacterImage from '../common/character';
import { Clover } from '@phosphor-icons/react';
import { useUserStore } from '@/store/userState';
import { useRouter } from 'next/navigation';

export const VictoryModal: React.FC = () => {
    const { isVictoryModalOpen: isOpen, victoryModalType: isVictory, setIsVictoryModalOpen, victoryXp: xp } = useGeneralStore();
    const { xp_points } = useUserStore()

    const onClose = () => {
        setIsVictoryModalOpen(false);
    }

    const router = useRouter();

    return (
        <Modal isOpen={isOpen} onClose={onClose} isDismissable={false} size="sm" backdrop="blur" hideCloseButton={true}>
            <ModalContent>
                {/* {() => ( */}
                <>
                    <ModalHeader className="flex items-center gap-2 text-center justify-center text-2xl font-bold">
                        {isVictory === 'victory' || isVictory === 'restore' ? (
                            <>
                                <CharacterImage src='happy.png' />
                            </>
                        ) : (
                            <>
                                <CharacterImage src='crying.png' />
                            </>
                        )}
                    </ModalHeader>

                    <ModalBody className="text-center space-y-1">
                        {isVictory === 'victory' && (
                            <>
                                <p className="text-lg">You earned</p>
                                <p className="text-3xl font-semibold text-green-500">{xp > 1 ? `${Math.floor(xp)} clovers` : `a clover`}.</p>
                                <p className='flex gap-1 justify-center items-center'><img src="/assets/icons/clover.png" width={35} height={35} />
                                    <span className="text-green-500 font-bold">{Math.floor(xp_points)}</span>
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-300">Great job! Keep it up.</p>
                            </>
                        )}
                        {isVictory === 'loss' && (
                            <>
                                <p className="text-lg text-red-600">You’ve lost all your lives.</p>
                                <p className="text-sm text-gray-500 dark:text-gray-300">Try again after cooldown or restore a heart by reviewing a deck/ a scheduled review.</p>
                            </>
                        )}
                        {isVictory === 'buy' && (
                            <>
                                <p className="text-lg text-red-600">You have no lives to join this session.</p>
                                <p className="text-sm text-gray-500 dark:text-gray-300">Try again after cooldown or restore a heart by reviewing a deck/ a scheduled review. Or Buy a live at profile.</p>
                            </>
                        )}
                        {isVictory === 'restore' && (
                            <>
                                <p className="text-lg text-red-600">A life has restored.</p>
                                <p className="text-sm text-gray-500 dark:text-gray-300">Enjoy learning.</p>
                            </>
                        )}
                    </ModalBody>

                    <ModalFooter className="flex justify-center gap-2">
                        {
                            isVictory === 'victory' &&
                            <Button className='bg-orange-500' variant="solid" onPress={onClose}>
                                Continue
                            </Button>
                        }

                        {isVictory === 'loss' &&
                            <Button onClick={() => router.back()} className='bg-orange-500' variant="solid" onPress={onClose}>
                                Okay
                            </Button>

                        }
                        {isVictory === 'restore' &&
                            <Button className='bg-orange-500' variant="solid" onPress={onClose}>
                                Okay
                            </Button>
                        }

                        {isVictory === 'buy' &&
                            <Button className='bg-orange-500' variant="solid" onPress={onClose}>
                                Okay
                            </Button>
                        }

                    </ModalFooter>
                </>
                {/* )} */}
            </ModalContent>
        </Modal>
    );
};
