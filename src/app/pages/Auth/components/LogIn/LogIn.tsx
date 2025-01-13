import { useNavigate } from 'react-router-dom';
import Form from '../Form';
import { useUserStore } from '@/store/RootStore';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';

const LogIn: React.FC = observer(() => {
  const { login } = useUserStore();
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    if (isNavigating) return;

    setIsNavigating(true);
    try {
      await login(email, password);
      navigate('/chat');
    } catch (e) {
      console.error(e);
    } finally {
      setIsNavigating(false);
    }
  };

  return <Form title="Вход" handleClick={handleLogin} />;
});

export default LogIn;
