export const withProvider = <P extends Record<string, unknown>>(
  ProviderComponent: React.FC<{ children: React.ReactNode }>,
  Component: React.FC
) => {
  return (props: P) => {
    return (
      <ProviderComponent>
        {' '}
        <Component {...props} />{' '}
      </ProviderComponent>
    );
  };
};
