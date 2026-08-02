import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import { GuestListPage } from '../pages/GuestListPage/ui/GuestListPage';

const theme = {
    token: {
        colorPrimary: '#9a7b4f',
        colorText: '#181c1b',
        colorTextSecondary: '#5f6763',
        colorBgContainer: '#f7f5f1',
        colorBorder: 'rgba(24, 28, 27, 0.12)',
        borderRadius: 14,
        fontFamily: "var(--font-body), 'Segoe UI', sans-serif",
        controlHeightLG: 46,
    },
    components: {
        Select: {
            optionSelectedBg: 'rgba(154, 123, 79, 0.12)',
        },
        Input: {
            activeBorderColor: '#9a7b4f',
            hoverBorderColor: 'rgba(154, 123, 79, 0.55)',
        },
    },
};

export function App() {
    return (
        <ConfigProvider locale={ruRU} theme={theme}>
            <GuestListPage />
        </ConfigProvider>
    );
}
