import { useNavigate } from 'react-router-dom';
import Form from '../Form';
import { useUserStore } from '@/store/RootStore';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';

const SignUp: React.FC = observer(() => {
  const { signUp, isAuthenticated } = useUserStore();
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSignUp = async (email: string, password: string) => {
    if (isNavigating) return;

    setIsNavigating(true);
    try {
      await signUp(email, password);
    } catch (e) {
      console.error(e);
    } finally {
      setIsNavigating(false);
    }
  };

  useEffect(() => {
    if (!isNavigating && isAuthenticated) {
      navigate('/chat');
    }
  }, [isNavigating, isAuthenticated, navigate]);

  return <Form title="Регистрация" handleClick={handleSignUp} />;
});

export default SignUp;
