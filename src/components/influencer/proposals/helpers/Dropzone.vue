<template>
  <vue-transmit class="uploader pt-3"
                tag="div"
                v-bind="options"
                :max-file-size="6000"
                @success="uploaded"
                @removed-file="removed"
                ref="uploader">
    <div class="text-xs-center grey--text pb-3" v-if="upload">
      Drag files here or <a href="#" @click.stop="triggerBrowse">click to upload</a>
    </div>
    <!-- Scoped slot -->
    <template slot="files" slot-scope="props">
      <v-container grid-list-sm class="pt-0 pl-4 pr-4 pb-3">
        <v-layout row wrap>
          <v-flex sm4 v-for="(file, i) in uploadedFiles" :key="file.id">
            <file-card
                :id="file.id"
                :upload="true"
                :uploading="false"
                :thumbnail="['image/png', 'image/jpeg', 'image/gif'].indexOf(file.type) > -1 ? file.path : false"
                :previewImage="file.path"
                :url="file.url"
                :size="file.size"
                :name="file.original_file"
                :uploadedFile="file"
                @download="() => {}"
                @previewImage="previewImage"
                @remove="remove">
            </file-card>
          </v-flex>
        </v-layout>
      </v-container>
    </template>

    <v-dialog v-model="viewImage" transition="fade" max-width="1200px" content-class="elevation-0 text-sm-center">
      <v-btn flat dark large fab @click.native="viewImage = false" class="btn--close">
        <v-icon>close</v-icon>
      </v-btn>
      <img :src="image" class="elevation-1" :style="{ 'max-height': windowHeight - 30 + 'px' }"
           style="max-width: 1180px; object-fit: contain; border: 1px solid #b4b4b4">
    </v-dialog>
  </vue-transmit>
</template>

<script>
  import FileCard from '../../../helpers/FileCard'

  export default {
    components: {
      FileCard
    },
    props: [
      'upload', 'uploadedFiles', 'proposal', 'network'
    ],
    data() {
      return {
        viewImage: false,
        image: null,
        windowHeight: 0
      }
    },
    mounted() {
      this.onResize()
    },
    computed: {
      options: function () {
        return {
          acceptedFileTypes: ['image/*', 'video/*', 'audio/*'],
          url: `${this.$http.defaults.baseURL}/proposal/${this.proposal.id}/upload`,
          clickable: true,
          params: {
            'network': this.network
          },
          headers: {
            'Authorization': this.$http.defaults.headers.common['Authorization']
          }
        }
      }
    },
    methods: {
      triggerBrowse() {
        this.$refs.uploader.triggerBrowseFiles()
      },
      uploaded(file, response) {
        this.$emit('fileUploaded', response.file)
      },
      remove(file) {
        this.$refs.uploader.removeFile(file)
      },
      removed(file) {
        this.$emit('fileRemoved', file.name)
      },
      previewImage(url) {
        this.image = url
        this.viewImage = true
      },
      onResize () {
        this.windowHeight = window.innerHeight
      }
    },
  }
</script>

<style>
  .uploader {
    border: 1px dashed #dddddd;
    border-left: none;
    border-right: none;
    background-color: #eeeeee;
  }

  .v-transmit__upload-area--is-dragging {
    background-color: #d0d0d0;
  }
</style>