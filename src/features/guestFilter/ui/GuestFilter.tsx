import React from 'react';
import { Select } from 'antd';
import styles from './GuestFilter.module.scss';

interface GuestFilterProps {
    categories: string[];
    selectedCategory: string | null;
    onCategoryChange: (category: string | null) => void;
}

export const GuestFilter: React.FC<GuestFilterProps> = ({
    categories,
    selectedCategory,
    onCategoryChange,
}) => {
    const options = [
        { label: 'Все категории', value: 'all' },
        ...categories.map((category) => ({ label: category, value: category })),
    ];

    return (
        <label className={styles.field}>
            <span className={styles.label}>Категория</span>
            <Select
                className={styles.control}
                options={options}
                value={selectedCategory || 'all'}
                onChange={(value) => onCategoryChange(value === 'all' ? null : value)}
                size="large"
                showSearch
                optionFilterProp="label"
                placeholder="Выберите категорию"
            />
        </label>
    );
};
