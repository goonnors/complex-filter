<template>
    <textarea
        name="search-field"
        id="search-field"
        rows="1"
        @focus="$emit('focus-search-field')"
    >
        ping
    </textarea>
</template>

<script>
    export default {
        name: 'SearchField'
    }
</script>
