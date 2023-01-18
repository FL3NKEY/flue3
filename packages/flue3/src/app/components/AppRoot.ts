import {
    defineComponent,
    defineAsyncComponent,
    h,
    VNode,
    Suspense,
    onErrorCaptured,
} from 'vue';
import { useError } from '../composables/useError.js';
import { isRedirectError } from '../../utils/error.js';

const AppError = defineAsyncComponent(() => import('./AppError.js'));

export default defineComponent({
    name: 'AppRoot',
    setup(props, { slots }) {
        const { errorState, showError } = useError();

        const removeSPALoading = () => {
            const $loading = document.getElementById(`${FLUE3_APP_ID}-spa-loading`);

            if ($loading) {
                $loading.remove();
            }
        };

        const onResolve = () => {
            removeSPALoading();
        };

        onErrorCaptured((err) => {
            if (!isRedirectError(err) && !errorState.captured) {
                showError(err);
            }

            if (!import.meta.env.SSR) {
                return false;
            }

            return true;
        });

        const Error = (): VNode | VNode[] => {
            if (slots.error) {
                return slots.error(errorState);
            }

            return h(AppError, {
                error: errorState,
            });
        };

        const Root = () => {
            if (errorState.status > 0) {
                return Error();
            }

            return slots.default ? slots.default() : null;
        };

        return () => h(Suspense, {
            onResolve,
        }, {
            default: () => Root(),
        });
    },
});
