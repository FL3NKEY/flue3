import { FrameworkContext } from '../../types/FrameworkContext.js';
import { App, setupDevtoolsPlugin } from '@vue/devtools-api';

export const createDevtools = (context: FrameworkContext) => {
    if ((context as any).$hasDevtools) return;
    (context as any).$hasDevtools = true;

    setupDevtoolsPlugin({
        id: 'flue3',
        label: 'flue3 SSR Framework',
        packageName: 'flue3',
        app: context.appContext.vueApp as App,
    }, (api) => {
        api.on.inspectComponent((payload) => {
            if (payload.instanceData) {
                const inspectAppContext = { ...context.appContext };
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                delete inspectAppContext.vueApp;

                payload.instanceData.state.push({
                    type: 'flue3',
                    key: 'appContext',
                    editable: false,
                    value: inspectAppContext,
                });
            }
        });
    });
};
