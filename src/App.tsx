import React from 'react';
import { ThemeProvider } from './presentation/components/ThemeContext';
import { AppNavigator } from './presentation/navigation/AppNavigator';

const App = () => {
    return (
        <ThemeProvider>
            <AppNavigator />
        </ThemeProvider>
    );
};

export default App;
