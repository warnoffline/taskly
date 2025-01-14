import { NavLink } from 'react-router-dom';
import { AlarmClockCheckIcon, SettingsIcon, UserIcon } from 'lucide-react';

const Header = () => {
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-colors hover:stroke-blue-500 active:stroke-blue-700 ${isActive ? 'stroke-blue-500' : ''}`;

  return (
    <div className="w-full flex justify-center sticky top-0 bg-chatLight-header dark:bg-chatDark-header z-10 border-b py-1 border-gray-300">
      <div className="w-center flex justify-between py-3">
        <NavLink to={'/chat'}>{(isActive) => <AlarmClockCheckIcon className={getNavLinkClass(isActive)} />}</NavLink>
        <div className="flex gap-2">
          <NavLink to="/settings">{(isActive) => <SettingsIcon className={getNavLinkClass(isActive)} />}</NavLink>
          <NavLink to="/profile">{(isActive) => <UserIcon className={getNavLinkClass(isActive)} />}</NavLink>
        </div>
      </div>
    </div>
  );
};

export default Header;
