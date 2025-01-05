import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useUserStore } from '@/store/RootStore';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';

interface IFormInput {
  newPassword: string;
}

const schema = yup
  .object({
    newPassword: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  })
  .required();

const Profile = observer(() => {
  const { user, updatePassword, logout } = useUserStore();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });

  const handleLogout = async () => {
    event?.preventDefault();
    await logout();
    navigate('/auth');
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (data.newPassword) {
        await updatePassword(data.newPassword);
        setSuccessMessage('Пароль успешно обновлён!');
      }
    } catch {
      setError('Ошибка обновления пароля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Профиль</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <p className="mb-2">
            Ваша почта: <strong>{user}</strong>
          </p>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Новый пароль</label>
            <input
              type="password"
              placeholder="Введите новый пароль"
              {...register('newPassword')}
              className={`mt-1 p-2 w-full border ${
                errors.newPassword ? 'border-red-600' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.newPassword && <span className="text-sm text-red-600">{errors.newPassword.message}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
            >
              {loading ? 'Changing...' : 'Сохранить'}
            </button>
            <button className="w-full py-2 px-4 bg-red-500 rounded-md text-white" onClick={handleLogout}>
              Выход
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="mt-4 text-red-600 text-sm">
          <p>{error}</p>
        </div>
      )}
      {successMessage && (
        <div className="mt-4 text-green-600 text-sm">
          <p>{successMessage}</p>
        </div>
      )}
    </div>
  );
});

export default Profile;
