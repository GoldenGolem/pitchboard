<template>
  <v-card color="white" raised class="card--file">
    <v-layout :row="horizontal" :column="!horizontal" class="ma-0">
      <v-flex class="d-flex align-center justify-center grey lighten-4 pa-0 ma-0"
              :style="{ 'height': thumbnailHeight + 'px' }"
              v-if="uploading">
        <v-progress-circular v-bind:indeterminate="true" :size="16"></v-progress-circular>
      </v-flex>
      <v-card-media
          :src="thumbnail"
          height="120px"
          :height="thumbnailHeight + 'px'"
          class="d-flex grey lighten-3"
          @click.native="$emit('previewImage', previewImage)"
          style="cursor: pointer"
          v-else-if="thumbnail">
      </v-card-media>
      <v-layout :style="{ 'height': thumbnailHeight + 'px' }"
                class="d-flex align-center justify-center grey lighten-4 pa-0 ma-0" v-else>
        <v-icon>fa-file-o</v-icon>
      </v-layout>

      <v-card-title class="pa-2 d-flex">
        <div class="wrap-ellipsis file--title">
          {{ name }}
        </div>
        <div class="grey--text file--description">
          {{ size | fileSize }}
        </div>
        <div class="file--actions">
          <v-btn small icon @click.native="$emit('download', id)">
            <v-icon color="grey">file_download</v-icon>
          </v-btn>
          <v-btn small icon @click.native="$emit('remove', uploadedFile ? uploadedFile : id)" v-if="upload">
            <v-icon color="red">clear</v-icon>
          </v-btn>
        </div>
      </v-card-title>
    </v-layout>
  </v-card>
</template>

<script>

  export default {
    props: {
      id: null,
      upload: {
        type: Boolean,
        default: false
      },
      uploading: Boolean,
      thumbnail: String,
      previewImage: String,
      url: String,
      size: Number,
      name: String,
      uploadedFile: null,
      horizontal: {
        type: Boolean,
        default: false,
      },
      thumbnailHeight: {
        type: Number,
        default: 120
      }
    },
    data() {
      return {
      }
    },
    methods: {
    }
  }
</script>

<style scoped>
  .card--file .file--actions {
    display: none;
  }
  .card--file .file--title {
    width: 100%;
  }
  .card--file .file--description {
    height: 28px;
  }
  .card--file:hover .file--actions {
    display: block;
  }
  .card--file:hover .file--description {
    display: none;
  }
</style>