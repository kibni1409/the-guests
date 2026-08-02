import React, { useMemo, useState } from 'react';
import { Empty } from 'antd';
import { GUESTS, GuestCard } from '../../../entities/guest';
import { GuestFilter } from '../../../features/guestFilter/ui/GuestFilter';
import { GuestSearch } from '../../../features/guestSearch/ui/GuestSearch';
import styles from './GuestListPage.module.scss';

export const GuestListPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categories = useMemo(
        () => [...new Set(GUESTS.map((guest) => guest.category1).filter(Boolean))],
        [],
    );

    const filteredGuests = useMemo(() => {
        const normalizedTerm = searchTerm.trim().toLowerCase();

        return GUESTS.filter((guest) => {
            const matchesSearch =
                !normalizedTerm || guest.fullName.toLowerCase().includes(normalizedTerm);
            const matchesCategory = !selectedCategory || guest.category1 === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, selectedCategory]);

    return (
        <div className={styles.page}>
            <div className={styles.atmosphere} aria-hidden />

            <header className={styles.header}>
                <div className={styles.brandBlock}>
                    <p className={styles.brand}>Гости</p>
                    <h1 className={styles.title}>Кто будет рядом</h1>
                    <p className={styles.subtitle}>
                        Короткий гид по людям за праздничным столом — имена, роли и пара тёплых
                        деталей, чтобы никого не перепутать.
                    </p>
                </div>
                <div className={styles.headerMeta}>
                    <span className={styles.metaValue}>{GUESTS.length}</span>
                    <span className={styles.metaLabel}>гостей</span>
                </div>
            </header>

            <main className={styles.content}>
                <section className={styles.filtersPanel} aria-label="Поиск и фильтры">
                    <div className={styles.filtersGrid}>
                        <GuestSearch value={searchTerm} onChange={setSearchTerm} />
                        <GuestFilter
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onCategoryChange={setSelectedCategory}
                        />
                    </div>
                    <p className={styles.stats}>
                        Показано {filteredGuests.length} из {GUESTS.length}
                    </p>
                </section>

                {filteredGuests.length === 0 ? (
                    <div className={styles.emptyState}>
                        <Empty description="Никого не нашлось — попробуйте другой запрос" />
                    </div>
                ) : (
                    <section className={styles.guestGrid} aria-label="Список гостей">
                        {filteredGuests.map((guest, index) => (
                            <GuestCard key={guest.id} guest={guest} index={index} />
                        ))}
                    </section>
                )}
            </main>
        </div>
    );
};
