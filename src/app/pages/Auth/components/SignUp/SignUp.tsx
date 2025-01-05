import { useNavigate } from 'react-router-dom';
import Form from '../Form';
import { useUserStore } from '@/store/RootStore';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

const SignUp: React.FC = observer(() => {
  const { isAuthenticated, signUp, loading } = useUserStore();
  const navigate = useNavigate();

  const handleSignUp = async (email: string, password: string) => {
    await signUp(email, password);
  };

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate, loading]);

  return <Form title="Регистрация" handleClick={handleSignUp} />;
});

export default SignUp;
