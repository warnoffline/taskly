import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useUserStore } from '@/store/RootStore';
import { observer } from 'mobx-react-lite';

interface IFormInput {
  email: string;
  password: string;
}

type FormProps = {
  title: string;
  handleClick: (email: string, password: string) => void;
};

const schema = yup
  .object({
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  })
  .required();

const Form: React.FC<FormProps> = observer(({ title, handleClick }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });
  const { loading, error } = useUserStore();

  const onSubmit: SubmitHandler<IFormInput> = (data) => handleClick(data.email, data.password);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md bg-white shadow-md rounded-lg p-6 space-y-6 text-start">
      <h2 className="text-2xl font-semibold text-gray-800 text-center">{title}</h2>

      <div className="flex flex-col space-y-1">
        <label htmlFor="email" className="text-gray-700 font-medium ">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Введите почту"
          {...register('email')}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col space-y-1">
        <label htmlFor="password" className="text-gray-700 font-medium">
          Пароль
        </label>
        <input
          id="password"
          type="password"
          placeholder="Введите пароль"
          {...register('password')}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      {/* Submit Button */}
      <button
        disabled={loading}
        type="submit"
        className={`w-full bg-blue-500 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Loading...' : 'Войти'}
      </button>
    </form>
  );
});

export default Form;
