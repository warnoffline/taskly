import { useUserStore } from '@/store/RootStore';
import { observer } from 'mobx-react-lite';
import { useCallback, useState } from 'react';
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';

const Auth: React.FC = observer(() => {
  const { setError } = useUserStore();
  const [isLogIn, setIsLogIn] = useState<boolean>(true);

  const handleAuth = useCallback(() => {
    setError('');
    setIsLogIn(!isLogIn);
  }, [isLogIn, setError]);

  return (
    <div className="text-center flex flex-col w-100 gap-2 p-5">
      {isLogIn ? <LogIn /> : <SignUp />}
      <div>
        <p>{isLogIn ? `Ещё нет аккаунта?` : 'Уже есть аккаунт?'}</p>
        <button onClick={handleAuth}>{isLogIn ? 'Регистрация' : 'Войти'}</button>
      </div>
    </div>
  );
});

export default Auth;
