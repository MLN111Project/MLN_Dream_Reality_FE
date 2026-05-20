import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import viVN from 'antd/locale/vi_VN';
import enUS from 'antd/locale/en_US';
import { AnimatePresence } from 'framer-motion';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { SimulationProvider } from './context/SimulationContext';
import LoadingScreen from './components/LoadingScreen';
import AppRoutes from './routes/AppRoutes';

const darkTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#8b5cf6',
    colorBgContainer: 'rgba(20, 20, 40, 0.8)',
    colorBgElevated: 'rgba(15, 15, 30, 0.95)',
    colorText: '#f8fafc',
    colorTextSecondary: 'rgba(248, 250, 252, 0.7)',
    borderRadius: 12,
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
  },
};

function AppContent() {
  const [showLoading, setShowLoading] = useState(true);
  const { lang } = useLanguage();
  const antLocale = lang === 'vi' ? viVN : enUS;

  return (
    <ConfigProvider theme={darkTheme} locale={antLocale}>
      <SimulationProvider>
        <BrowserRouter>
          <AnimatePresence>
            {showLoading && (
              <LoadingScreen onFinish={() => setShowLoading(false)} />
            )}
          </AnimatePresence>
          {!showLoading && <AppRoutes />}
        </BrowserRouter>
      </SimulationProvider>
    </ConfigProvider>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
