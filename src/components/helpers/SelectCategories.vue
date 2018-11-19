<template>
  <div>
    <v-layout row wrap>
      <v-flex sm3 v-for="category in categories" @click="select(category)" class="category text-xs-center grey--text text--darken-2 mb-4" :key="category.id">
        <v-badge color="primary" overlap>
          <span slot="badge" v-if="selected.indexOf(category.id) > -1"><v-icon color="white">check</v-icon></span>
          <v-avatar class="grey lighten-4 mb-2" :size="iconSize" :class="{'grey lighten-4': selected.indexOf(category.id) === -1, 'grey darken-4': selected.indexOf(category.id) > -1 }">
            <img :src="'/static/categories/' + category.icon + (selected.indexOf(category.id) > -1 ? '-hover' : '') + '.png'">
          </v-avatar>
        </v-badge>
        <br>
        {{ category.name }}
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  export default {
    components: {
    },
    props: {
      categories: Array,
      selected: Array,
      iconSize: {
        type: [String, Number],
        default: "75px"
      }
    },
    data() {
      return {
      }
    },
    mounted() {

    },
    methods: {
      select(category) {
        this.$emit('categorySelected', category)
      }
    }
  }
</script>

<style scoped>
  .category {
    cursor: pointer
  }
</style>