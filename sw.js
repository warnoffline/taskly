if (navigator.serviceWorker) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('Сервисный работник обновлен! Перезагрузите страницу.');
  });
}
