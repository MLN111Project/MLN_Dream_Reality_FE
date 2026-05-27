import { useState, useCallback } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { AnimatePresence, motion } from 'framer-motion';
import { LanguageProvider } from './context/LanguageContext';
import { SimulationProvider } from './context/SimulationContext';
import LoadingScreen from './components/LoadingScreen';
import AppRoutes from './routes/AppRoutes';

const appTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#2563eb',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorText: '#1e293b',
    colorTextSecondary: '#475569',
    borderRadius: 12,
    fontFamily: "'Times New Roman', Times, Georgia, serif",
  },
};

function AppContent() {
  const [showLoading, setShowLoading] = useState(true);
  const finishLoading = useCallback(() => setShowLoading(false), []);

  return (
    <ConfigProvider theme={appTheme} locale={viVN}>
      <SimulationProvider>
        <BrowserRouter>
          <AnimatePresence mode="wait">
            {showLoading ? (
              <LoadingScreen key="loading" onFinish={finishLoading} />
            ) : (
              <motion.div
                key="app"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                style={{ minHeight: '100vh' }}
              >
                <AppRoutes />
              </motion.div>
            )}
          </AnimatePresence>
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
