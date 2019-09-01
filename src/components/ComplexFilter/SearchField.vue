<template>
    <textarea
        :value="value"
        name="search-field"
        id="search-field"
        rows="1"
        @focus="$emit('focus-search-field')"
        @input="onInputSearchField($event.target.value)"
    ></textarea>
</template>

<script>
    export default {
        name: 'SearchField',
        props: ['value'],
        data: () => ({
            query: ''
        }),
        methods: {
			onInputSearchField(value) {
				this.$emit('input-search-field', value);
            }
        }
    }
</script>
