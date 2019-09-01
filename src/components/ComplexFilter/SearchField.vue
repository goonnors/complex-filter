<template>
    <textarea
        v-model="query"
        name="search-field"
        id="search-field"
        rows="1"
        @focus="$emit('focus-search-field')"
        @input="onInputSearchField"
    ></textarea>
</template>

<script>
    export default {
        name: 'SearchField',
        data: () => ({
            query: ''
        }),
        methods: {
			onInputSearchField() {
				this.$emit('input-search-field', this.query);
            }
        }
    }
</script>
