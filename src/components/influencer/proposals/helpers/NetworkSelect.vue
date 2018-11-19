<template>
  <v-tooltip bottom :disabled="!profile || label">
  <v-layout align-center justify-center :class="{'cursor--pointer': profile && selectable}" @click="toggle" slot="activator">
    <v-flex :sm5="label" :sm16="!label">
      <v-badge color="purple" overlap>
        <span slot="badge" v-if="selected"><v-icon color="white">check</v-icon></span>
        <v-avatar class="grey mb-1 d-flex" :class="{'darken-4': selected, 'lighten-2': !selected}" size="40px">
          <v-icon v-if="network === 'facebook'" :color="selected ? 'white' : (!profile ? 'grey' : 'primary')">fa-facebook</v-icon>
          <v-icon :dark="selected" v-if="network === 'instagram'" :color="selected ? 'white' : (!profile ? 'grey' : 'primary')">fa-instagram</v-icon>
          <v-icon :dark="selected" v-if="network === 'twitter'" :color="selected ? 'white' : (!profile ? 'grey' : 'primary')">fa-twitter</v-icon>
          <v-icon :dark="selected" v-if="network === 'youtube'" :color="selected ? 'white' : (!profile ? 'grey' : 'primary')">fa-youtube</v-icon>
          <v-icon :dark="selected" v-if="network === 'blog'" :color="selected ? 'white' : (!profile ? 'grey' : 'primary')">fa-rss</v-icon>
        </v-avatar>
      </v-badge>
    </v-flex>
    <v-flex sm11 class="pl-1" v-if="label">
      <div v-if="network === 'facebook'">Facebook</div>
      <div v-if="network === 'instagram'">Instagram</div>
      <div v-if="network === 'twitter'">Twitter</div>
      <div v-if="network === 'youtube'">YouTube</div>
      <div v-if="network === 'blog'">Blog</div>
      <div class="grey--text wrap-ellipsis" v-if="this.profile">
          {{ profile.name ? profile.name : profile.title }}
      </div>
      <div v-else>
        <a href="#" class="primary--text">Connect</a>
      </div>
    </v-flex>
  </v-layout>
    <span v-if="this.profile">{{ profile.name ? profile.name : profile.title }}</span>
  </v-tooltip>
</template>

<script>
  export default {
    props: {
      network: {
        type: String,
        required: true
      },
      profile: {
        type: Object
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
        if (!this.profile || !this.selectable) return
        this.$emit('toggleNetworkSelect', this.network)
      }
    }
  }
</script>

<style scoped>
  .cursor--pointer {
    cursor: pointer;
  }
</style>