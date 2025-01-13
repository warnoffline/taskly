import { useNavigate } from 'react-router-dom';
import Form from '../Form';
import { useUserStore } from '@/store/RootStore';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';

const SignUp: React.FC = observer(() => {
  const { signUp } = useUserStore();
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (email: string, password: string) => {
    if (isNavigating) return;

    setIsNavigating(true);
    try {
      await signUp(email, password);
      navigate('/chat');
    } catch (e) {
      console.error(e);
    } finally {
      setIsNavigating(false);
    }
  };

  return <Form title="Регистрация" handleClick={handleSignUp} />;
});

export default SignUp;
