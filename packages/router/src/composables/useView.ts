import {
    computed,
    h,
    PropType,
    toRef,
    Transition,
    TransitionProps,
    unref,
    VNode,
} from 'vue';

export const viewProps = {
    routeKey: {
        type: String,
    },
    transition: {
        type: [Object, String] as PropType<TransitionProps | string>,
    },
};

export const useView = (props: {
    routeKey?: string;
    transition?: TransitionProps | string;
}) => {
    const key = toRef(props, 'routeKey');

    const transitionAttrs = computed(() => {
        if (props.transition) {
            if (typeof props.transition === 'string') {
                return {
                    name: props.transition,
                };
            }

            return props.transition;
        }

        return {};
    });

    const WithTransition = (_: VNode) => {
        if (props.transition) {
            return h(Transition, unref(transitionAttrs), () => _);
        }

        return _;
    };

    return {
        WithTransition,
        key,
    };
};
