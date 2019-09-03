<template>
    <div>
        <v-data-table
            :headers="headers"
            :items="items"
            :loading="loading"
        />
    </div>
</template>

<script>
	export default {
		props: ['items', 'headers', 'loading']
  }
</script>
