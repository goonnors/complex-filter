<template>
    <div>
        <v-data-table
            :headers="headers"
            :items="items"
        />
    </div>
</template>

<script>
	export default {
		props: ['items', 'headers']
    }
</script>
