import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import { GuestListPage } from '../pages/GuestListPage/ui/GuestListPage';

export function App() {
    return (
        <ConfigProvider locale={ruRU}>
            <GuestListPage />
        </ConfigProvider>
    );
}