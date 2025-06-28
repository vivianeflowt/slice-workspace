import { ChatWindow } from '../../windows/Chat/ChatWindow';
import { Window } from '../../../components/ui/Window/Window';

export const DashboardPage = () => {
  return (
    <div
      className="dashboard-root"
      style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#181A20' }}
    >
      {/* TopBar fixa */}
      <header
        style={{
          height: 56,
          background: '#23252b',
          display: 'flex',
          alignItems: 'center',
          padding: '0 2rem',
          borderBottom: '1px solid #222',
        }}
      >
        <div style={{ fontWeight: 700, color: '#fff', letterSpacing: 1 }}>LOGO</div>
        <div style={{ flex: 1 }} />
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: '#222',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#4af',
            fontWeight: 600,
          }}
        >
          {/* Avatar placeholder */}
          <span>👤</span>
        </div>
      </header>

      {/* Grid principal de janelas */}
      <main
        style={{ flex: 1, display: 'flex', gap: '1rem', padding: '1rem', background: '#181A20' }}
      >
        {/* Janela de Chat */}
        <Window title="Chat">
          <ChatWindow />
        </Window>
        {/* Placeholder para futuras janelas (ex: gráficos, listas) */}
        <Window title="Gráficos">
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#444',
            }}
          >
            [Gráficos aqui]
          </div>
        </Window>
      </main>
    </div>
  );
};
