import React from 'react';
import { Select, Space, Typography } from 'antd';

const { Text } = Typography;

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
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
            <Text type="secondary">Фильтр по категориям</Text>
            <Select
                options={options}
                value={selectedCategory || 'all'}
                onChange={(value) => onCategoryChange(value === 'all' ? null : value)}
                size="large"
                style={{ width: '100%' }}
                showSearch
                optionFilterProp="label"
                placeholder="Выберите категорию"
            />
        </Space>
    );
};
