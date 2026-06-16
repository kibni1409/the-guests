import React, { useState } from 'react';
import { Card, Image, Modal, Tag, Typography } from 'antd';
import { ZoomInOutlined } from '@ant-design/icons';
import type { Guest } from '../model/types';
import { getGuestInitials } from '../../../shared/lib/guestInitials';
import { useGuestPhoto } from '../../../shared/lib/useGuestPhoto';
import styles from './GuestCard.module.scss';

const { Text, Paragraph } = Typography;

interface GuestCardProps {
    guest: Guest;
}

function GuestAvatar({
    guest,
    photoUrl,
    className,
    onError,
}: {
    guest: Guest;
    photoUrl: string | null;
    className: string;
    onError?: () => void;
}) {
    if (photoUrl) {
        return (
            <img
                src={photoUrl}
                alt={guest.fullName}
                className={className}
                loading="lazy"
                onError={onError}
            />
        );
    }

    return (
        <div className={`${className} ${styles.initialsAvatar}`} aria-label={guest.fullName}>
            {getGuestInitials(guest.fullName)}
        </div>
    );
}

export const GuestCard: React.FC<GuestCardProps> = ({ guest }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { photoUrl, fullPhotoUrl, canPreviewPhoto, handleImageError } = useGuestPhoto(guest);

    const cardStyle = {
        '--guest-accent': guest.color,
    } as React.CSSProperties;

    const categoryStyle = {
        backgroundColor: `${guest.color}20`,
        color: guest.color,
        border: `1px solid ${guest.color}`,
    };

    return (
        <>
            <Card
                className={styles.card}
                style={cardStyle}
                hoverable
                onClick={() => setIsModalOpen(true)}
            >
                <div className={styles.cardHeader}>
                    <GuestAvatar
                        guest={guest}
                        photoUrl={photoUrl}
                        className={styles.avatar}
                        onError={handleImageError}
                    />
                </div>

                <div className={styles.cardContent}>
                    <h3 className={styles.name}>{guest.fullName}</h3>
                    {guest.category2 && (
                        <div className={styles.category} style={categoryStyle}>
                            {guest.category2}
                        </div>
                    )}
                    {guest.shortDescription && (
                        <Text className={styles.description}>{guest.shortDescription}</Text>
                    )}
                </div>
            </Card>

            <Modal
                title={null}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width="min(560px, calc(100vw - 32px))"
                className={styles.modal}
                centered
                destroyOnHidden
            >
                <div className={styles.modalHero}>
                    {canPreviewPhoto && photoUrl ? (
                        <div className={styles.modalPhotoWrapper}>
                            <Image
                                src={photoUrl}
                                alt={guest.fullName}
                                className={styles.modalPhoto}
                                rootClassName={styles.modalPhotoRoot}
                                preview={{
                                    src: fullPhotoUrl ?? photoUrl,
                                    mask: (
                                        <span className={styles.previewMask}>
                                            <ZoomInOutlined />
                                            Увеличить
                                        </span>
                                    ),
                                }}
                                onError={handleImageError}
                            />
                            <span className={styles.photoHint}>Нажмите, чтобы увеличить</span>
                        </div>
                    ) : (
                        <GuestAvatar
                            guest={guest}
                            photoUrl={photoUrl}
                            className={styles.modalPhoto}
                            onError={handleImageError}
                        />
                    )}
                </div>

                <div className={styles.modalBody}>
                    <h2 className={styles.modalName}>{guest.fullName}</h2>

                    <div className={styles.modalTags}>
                        {guest.category1 && (
                            <Tag color={guest.color} className={styles.modalTag}>
                                {guest.category1}
                            </Tag>
                        )}
                        {guest.category2 && (
                            <Tag className={styles.modalTag}>{guest.category2}</Tag>
                        )}
                    </div>

                    {guest.shortDescription && (
                        <Paragraph className={styles.modalDescription}>
                            <strong>Кратко:</strong> {guest.shortDescription}
                        </Paragraph>
                    )}

                    {guest.fullDescription && (
                        <Paragraph className={styles.modalDescription}>
                            <strong>Подробнее:</strong> {guest.fullDescription}
                        </Paragraph>
                    )}

                    {guest.specialNotes && (
                        <Paragraph className={`${styles.modalDescription} ${styles.modalNotes}`}>
                            <strong>Особые отметки:</strong> {guest.specialNotes}
                        </Paragraph>
                    )}
                </div>
            </Modal>
        </>
    );
};
