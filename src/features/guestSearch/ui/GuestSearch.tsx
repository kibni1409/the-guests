import React from 'react';
import { Input, Space, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface GuestSearchProps {
    value: string;
    onChange: (value: string) => void;
}

export const GuestSearch: React.FC<GuestSearchProps> = ({ value, onChange }) => {
    return (
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
            <Text type="secondary">Поиск по имени</Text>
            <Input
                placeholder="Введите имя гостя..."
                prefix={<SearchOutlined />}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                size="large"
                allowClear
            />
        </Space>
    );
};