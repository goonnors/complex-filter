<template>
    <div class="dynamic-options">
        <ul>
            <li v-for="item in items" :key="item.value">{{ item }}</li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'DynamicOptions',
        props: ['items']
    }
</script>
