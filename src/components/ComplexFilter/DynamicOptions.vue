<template>
    <div class="dynamic-options">
        <ul>
            <li
                v-for="item in items"
                :key="item"
                @click="onItemClick(item)"
            >{{ item }}</li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'DynamicOptions',
        props: ['items'],
        methods: {
            onItemClick(item) {
                this.$emit('dynamic-option-click', item);
            }
        }
    }
</script>
