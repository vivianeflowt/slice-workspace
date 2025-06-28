import { KBarProvider } from 'kbar';

import { kbarActions } from './components/navigation/KBarPortal/actions';
import KBarPortal from './components/navigation/KBarPortal/KBarPortal';
import AppRoutes from './routes/AppRoutes';

const App = () => (
  <KBarProvider actions={kbarActions} options={{ enableHistory: true }}>
    <KBarPortal />
    <AppRoutes />
  </KBarProvider>
);

export default App;
