import mri from 'mri';
import { dev, build } from './framework.js';

(async () => {
    const args = mri(process.argv.slice(2));
    const command = args._[0];

    if (command === 'dev') {
        await dev();
    } else if (command === 'build') {
        await build();
    }
})();
