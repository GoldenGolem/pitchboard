<template>
  <v-layout align-center justify-center :class="{'cursor--pointer': selectable}" @click="toggle" slot="activator">
    <v-flex sm5>
      <v-badge color="primary" overlap>
        <span slot="badge" v-if="selected" small><v-icon color="white">check</v-icon></span>
        <v-avatar class="mb-1 d-flex" :class="{'grey darken-4': selected, 'transparent': !selected}" size="36px">
          <v-icon v-if="network === 'facebook'" :class="[{ 'social-color--text': !selected, 'white--text': selected }, network]">fa-facebook</v-icon>
          <v-icon v-if="network === 'instagram'" :class="[{ 'social-color--text': !selected, 'white--text': selected }, network]">fa-instagram</v-icon>
          <v-icon v-if="network === 'twitter'" :class="[{ 'social-color--text': !selected, 'white--text': selected }, network]">fa-twitter</v-icon>
          <v-icon v-if="network === 'youtube'" :class="[{ 'social-color--text': !selected, 'white--text': selected }, network]">fa-youtube</v-icon>
          <v-icon v-if="network === 'blog'" :class="[{ 'social-color--text': !selected, 'white--text': selected }, network]">fa-rss</v-icon>
        </v-avatar>
      </v-badge>
    </v-flex>
    <v-flex sm11 class="ml-2">
      <div v-if="network === 'facebook'">Facebook</div>
      <div v-if="network === 'instagram'">Instagram</div>
      <div v-if="network === 'twitter'">Twitter</div>
      <div v-if="network === 'youtube'">YouTube</div>
      <div v-if="network === 'blog'">Blog</div>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    props: {
      network: {
        type: String,
        required: true
      },
      selected: {
        type: Boolean,
        required: true
      },
      label: {
        type: Boolean,
        default: true
      },
      selectable: {
        type: Boolean,
        default: true
      },
    },
    data () {
      return {
      }
    },
    mounted() {
      console.log('selected', this.selected)
    },
    computed: {
    },
    methods: {
      toggle() {
        if (!this.selectable) return
        this.$emit('toggleNetworkSelect', this.network)
        this.$emit('input', this.network)
      }
    }
  }
</script>

<style scoped>
  .cursor--pointer {
    cursor: pointer;
  }
</style>