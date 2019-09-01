<template>
    <textarea
        name="search-field"
        id="search-field"
        cols="30"
        rows="10"
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
