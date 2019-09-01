<template>
    <textarea
        name="search-field"
        id="search-field"
        rows="1"
        @focus="$emit('focus-search-field')"
        @input="onInput"
    ></textarea>
</template>

<script>
    export default {
        name: 'SearchField',
        methods: {
			onInput() {
				console.log('onInput');
            }
        }
    }
</script>
