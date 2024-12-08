import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-center flex justify-between py-3">
        <Link to={'/'}>logo</Link>
        <div className="flex gap-2">
          <Link to="/settings">settings</Link>
          <Link to="/profile">profile</Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
