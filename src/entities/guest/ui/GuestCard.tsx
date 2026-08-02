import React, { useState } from 'react';
import { Image, Modal } from 'antd';
import { ZoomInOutlined } from '@ant-design/icons';
import type { Guest } from '../model/types';
import { getGuestInitials } from '../../../shared/lib/guestInitials';
import { useGuestPhoto } from '../../../shared/lib/useGuestPhoto';
import styles from './GuestCard.module.scss';

interface GuestCardProps {
    guest: Guest;
    index?: number;
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
            <span>{getGuestInitials(guest.fullName)}</span>
        </div>
    );
}

export const GuestCard: React.FC<GuestCardProps> = ({ guest, index = 0 }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { photoUrl, fullPhotoUrl, canPreviewPhoto, handleImageError } = useGuestPhoto(guest);

    return (
        <>
            <article
                className={styles.card}
                style={{ '--guest-accent': guest.color, '--card-delay': `${index * 40}ms` } as React.CSSProperties}
                onClick={() => setIsModalOpen(true)}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setIsModalOpen(true);
                    }
                }}
                role="button"
                tabIndex={0}
                aria-label={`Открыть карточку: ${guest.fullName}`}
            >
                <div className={styles.media}>
                    <GuestAvatar
                        guest={guest}
                        photoUrl={photoUrl}
                        className={styles.photo}
                        onError={handleImageError}
                    />
                    <div className={styles.mediaShade} />
                    {guest.category2 && (
                        <span className={styles.roleBadge}>{guest.category2}</span>
                    )}
                </div>

                <div className={styles.body}>
                    <h3 className={styles.name}>{guest.fullName}</h3>
                    {guest.shortDescription && (
                        <p className={styles.description}>{guest.shortDescription}</p>
                    )}
                    <span className={styles.openHint}>Подробнее</span>
                </div>
            </article>

            <Modal
                title={null}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width="min(540px, calc(100vw - 28px))"
                className={styles.modal}
                centered
                destroyOnHidden
            >
                <div
                    className={styles.modalInner}
                    style={{ '--guest-accent': guest.color } as React.CSSProperties}
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
                        <p className={styles.modalEyebrow}>{guest.category1}</p>
                        <h2 className={styles.modalName}>{guest.fullName}</h2>

                        {guest.category2 && (
                            <div className={styles.modalTags}>
                                <span className={styles.modalTag}>{guest.category2}</span>
                            </div>
                        )}

                        {guest.shortDescription && (
                            <p className={styles.modalLead}>{guest.shortDescription}</p>
                        )}

                        {guest.fullDescription && (
                            <p className={styles.modalText}>{guest.fullDescription}</p>
                        )}

                        {guest.specialNotes && (
                            <p className={styles.modalNotes}>{guest.specialNotes}</p>
                        )}
                    </div>
                </div>
            </Modal>
        </>
    );
};
