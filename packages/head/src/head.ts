import { definePlugin } from 'flue3';
import { createHead, renderHeadToString } from '@vueuse/head';

export const createHeadPlugin = definePlugin(({ appContext }, initialHead) => {
    const head = createHead(initialHead);
    appContext.vueApp.use(head);

    appContext.hooks.hook('render:after', async (renderPartials) => {
        try {
            const renderedHead = await renderHeadToString(head);

            [
                'headTags',
                'bodyTags',
                'htmlAttrs',
                'bodyAttrs',
            ].forEach((partialName) => {
                const renderPartialsKey = partialName as keyof Omit<typeof renderPartials, 'teleports'>;
                const renderedHeadKey = partialName as keyof Awaited<ReturnType<typeof renderHeadToString>>;
                // eslint-disable-next-line no-param-reassign
                renderPartials[renderPartialsKey] += renderedHead[renderedHeadKey];
            });
        } catch (err) {
            console.error(err);
        }
    });
});

export { useHead } from '@vueuse/head';
