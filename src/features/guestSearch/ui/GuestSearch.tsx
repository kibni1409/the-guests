import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from './GuestSearch.module.scss';

interface GuestSearchProps {
    value: string;
    onChange: (value: string) => void;
}

export const GuestSearch: React.FC<GuestSearchProps> = ({ value, onChange }) => {
    return (
        <label className={styles.field}>
            <span className={styles.label}>Поиск</span>
            <Input
                className={styles.control}
                placeholder="Имя гостя"
                prefix={<SearchOutlined />}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                size="large"
                allowClear
            />
        </label>
    );
};
