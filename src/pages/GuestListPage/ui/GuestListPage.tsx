import React, { useEffect, useState } from 'react';
import { Button, Layout, Typography, Empty, Spin, message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import type { Guest } from '../../../entities/guest/model/types';
import { GuestCard } from '../../../entities/guest/ui/GuestCard';
import { ExcelUploader } from '../../../features/excelUploader/ui/ExcelUploader';
import { GuestFilter } from '../../../features/guestFilter/ui/GuestFilter';
import { GuestSearch } from '../../../features/guestSearch/ui/GuestSearch';
import { parseExcelToGuests } from '../../../shared/lib/excelParser';
import {
    clearGuestsStorage,
    loadGuestsFromStorage,
    saveGuestsToStorage,
} from '../../../shared/lib/guestStorage';
import styles from './GuestListPage.module.scss';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export const GuestListPage: React.FC = () => {
    const [guests, setGuests] = useState<Guest[]>(() => loadGuestsFromStorage());
    const [filteredGuests, setFilteredGuests] = useState<Guest[]>(() => loadGuestsFromStorage());
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categories = [...new Set(guests.map((guest) => guest.category1).filter(Boolean))];

    useEffect(() => {
        if (guests.length > 0) {
            saveGuestsToStorage(guests);
        } else {
            clearGuestsStorage();
        }
    }, [guests]);

    const applyFilters = (sourceGuests: Guest[], term: string, category: string | null) => {
        let filtered = [...sourceGuests];

        if (term.trim()) {
            const normalizedTerm = term.toLowerCase();
            filtered = filtered.filter((guest) =>
                guest.fullName.toLowerCase().includes(normalizedTerm),
            );
        }

        if (category) {
            filtered = filtered.filter((guest) => guest.category1 === category);
        }

        setFilteredGuests(filtered);
    };

    const handleFileUpload = async (file: File) => {
        setLoading(true);
        try {
            const parsedGuests = await parseExcelToGuests(file);
            setGuests(parsedGuests);
            setSearchTerm('');
            setSelectedCategory(null);
            setFilteredGuests(parsedGuests);
            message.success(`Загружено ${parsedGuests.length} гостей`);
        } catch (error) {
            console.error(error);
            message.error('Ошибка при парсинге файла. Проверьте структуру Excel');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        applyFilters(guests, term, selectedCategory);
    };

    const handleCategoryChange = (category: string | null) => {
        setSelectedCategory(category);
        applyFilters(guests, searchTerm, category);
    };

    const handleReset = () => {
        clearGuestsStorage();
        setGuests([]);
        setFilteredGuests([]);
        setSearchTerm('');
        setSelectedCategory(null);
    };

    if (loading) {
        return (
            <div className={styles.loaderContainer}>
                <Spin size="large" tip="Загрузка данных..." />
            </div>
        );
    }

    if (guests.length === 0) {
        return (
            <div className={styles.uploadPage}>
                <div className={styles.uploadCard}>
                    <div className={styles.uploadIntro}>
                        <Title level={2} className={styles.uploadTitle}>
                            Список гостей
                        </Title>
                        <Text className={styles.uploadSubtitle}>
                            Загрузите Excel-файл с гостями — приложение автоматически разложит
                            данные по карточкам на телефоне, планшете и компьютере.
                        </Text>
                    </div>
                    <ExcelUploader onUpload={handleFileUpload} loading={loading} />
                </div>
            </div>
        );
    }

    return (
        <Layout className={styles.layout}>
            <Header className={styles.header}>
                <div className={styles.headerMain}>
                    <Title level={3} className={styles.title}>
                        Список гостей
                    </Title>
                    <Text className={styles.headerMeta}>{guests.length} гостей</Text>
                </div>
                <Button icon={<ReloadOutlined />} onClick={handleReset}>
                    <span className={styles.resetLabel}>Новый файл</span>
                </Button>
            </Header>

            <Content className={styles.content}>
                <section className={styles.filtersPanel}>
                    <div className={styles.filtersGrid}>
                        <GuestSearch value={searchTerm} onChange={handleSearch} />
                        <GuestFilter
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onCategoryChange={handleCategoryChange}
                        />
                    </div>

                    <div className={styles.stats}>
                        Найдено: {filteredGuests.length} из {guests.length}
                    </div>
                </section>

                {filteredGuests.length === 0 ? (
                    <div className={styles.emptyState}>
                        <Empty description="Гости не найдены" />
                    </div>
                ) : (
                    <section className={styles.guestGrid}>
                        {filteredGuests.map((guest) => (
                            <GuestCard key={guest.id} guest={guest} />
                        ))}
                    </section>
                )}
            </Content>
        </Layout>
    );
};
