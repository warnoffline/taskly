import { useNavigate } from 'react-router-dom';
import Form from '../Form';
import { useUserStore } from '@/store/RootStore';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

const LogIn: React.FC = observer(() => {
  const { login, isAuthenticated, loading } = useUserStore();
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
  };

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate, loading]);

  return <Form title="Вход" handleClick={handleLogin} />;
});

export default LogIn;
