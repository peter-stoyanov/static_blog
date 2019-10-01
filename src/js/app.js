import bulmaInit from './vendor/bulma';

if (module.hot) {
    module.hot.accept();
}

window.addEventListener('DOMContentLoaded', () => {
    bulmaInit();
});
