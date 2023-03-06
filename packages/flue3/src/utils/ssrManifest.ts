import { Manifest } from 'vite';
import { SSRManifest } from '../types/SSRManifest.js';
import path from 'path';

export const ssrManifestImplementCssImportsCollision = (
    ssrManifest: SSRManifest,
    manifest: Manifest,
    basePath: string,
    id?: string,
    refId?: string,
): void => {
    if (!id) {
        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (const id in ssrManifest) {
            ssrManifestImplementCssImportsCollision(ssrManifest, manifest, basePath, id);
        }
    }

    if (id && manifest[id]) {
        const manifestItem = manifest[id];

        if (manifestItem.imports) {
            manifestItem.imports.forEach((importId) => {
                ssrManifestImplementCssImportsCollision(
                    ssrManifest,
                    manifest,
                    basePath,
                    importId,
                    refId ?? id,
                );
            });
        }

        if (manifestItem.css && refId) {
            manifestItem.css.forEach((cssId) => {
                const resolvedUrl = path.join(basePath, cssId);
                if (!ssrManifest[refId].includes(resolvedUrl)) {
                    ssrManifest[refId].push(resolvedUrl);
                }
            });
        }
    }
};
