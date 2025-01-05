import UserStore from './UserStore';

export default class RootStore {
  readonly user = new UserStore();

  destroy(): void {}
}
