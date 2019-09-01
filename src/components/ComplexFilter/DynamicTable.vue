<template>
    <table>
        <tbody>
            <tr v-for="item in items" :key="item.value">
                <td>{{ item }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script>
	export default {
		props: ['items', 'headers']
    }
</script>
