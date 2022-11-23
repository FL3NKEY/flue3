<template>
    <div>
        hello world
    </div>
</template>

<script lang="ts">
import { useAppContext } from 'flue3';

export default {
    setup() {
        const { isServer } = useAppContext();
        console.log('is server?', isServer);
    },
};
</script>

<style>
body {
    color: red;
}
</style>
