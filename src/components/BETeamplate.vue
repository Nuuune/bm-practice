<template>
	<div>
		<h1>hello test</h1>
		<h3 v-text="dataCo.text"></h3>
		<input v-model="dataCo.text" type="text" />
		<button @click="show">show co</button>
	</div>
</template>

<script>
export default {
	data () {
		return {
			dataCo: null
		}
	},
	methods: {
		show () {
			console.log(this.co.text)
		}
	},
	computed: {
		co () {
			return {
				text: "co"
			}
		}
	},
	created () {
		this.dataCo = this.co;
	}
}


</script>

</style>
