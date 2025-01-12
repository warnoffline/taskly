import NotificationStore from './NotificationStore';
import UserStore from './UserStore';

export default class RootStore {
  readonly user = new UserStore();
  readonly notification = new NotificationStore();

  destroy(): void {}
}
