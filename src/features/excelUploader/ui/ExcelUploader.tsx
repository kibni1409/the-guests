import React from 'react';
import { Upload, message } from 'antd';
import { FileExcelOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import styles from './ExcelUploader.module.scss';

const { Dragger } = Upload;

interface ExcelUploaderProps {
    onUpload: (file: File) => void;
    loading: boolean;
}

export const ExcelUploader: React.FC<ExcelUploaderProps> = ({ onUpload, loading }) => {
    const props: UploadProps = {
        name: 'file',
        multiple: false,
        accept: '.xlsx,.xls,.csv',
        beforeUpload: (file) => {
            const isValid =
                file.name.endsWith('.xlsx') ||
                file.name.endsWith('.xls') ||
                file.name.endsWith('.csv');

            if (!isValid) {
                message.error('Пожалуйста, загрузите файл Excel (.xlsx, .xls, .csv)');
                return false;
            }

            onUpload(file);
            return false;
        },
        showUploadList: false,
    };

    return (
        <div className={styles.wrapper}>
            <Dragger {...props} disabled={loading} className={styles.dragger}>
                <p className="ant-upload-drag-icon">
                    <FileExcelOutlined className={styles.icon} />
                </p>
                <p className={`ant-upload-text ${styles.text}`}>
                    Нажмите или перетащите файл Excel сюда
                </p>
            </Dragger>
        </div>
    );
};
