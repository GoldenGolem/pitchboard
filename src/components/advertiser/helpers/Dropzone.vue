<template>
  <vue-transmit class="uploader"
                tag="div"
                v-bind="options"
                ref="uploader"
                :max-file-size="3000"
                @success="uploaded"
                @removed-file="removed"
                >
    <!--@removed-file="remove"-->
    <div class="text-xs-center grey--text pt-3 pb-3" v-if="upload">
      Drag files here or <a href="#" @click.prevent.stop="triggerBrowse">click to upload</a>
    </div>
    <!-- Scoped slot -->
    <template slot="files" slot-scope="props">
      <v-container grid-list-sm class="pt-0 pl-4 pr-4 pb-3">
        <v-layout row wrap>
          <v-flex sm4 v-for="(file, i) in props.files" :key="file.id">
            <file-card
                :id="file.id"
                :upload="true"
                :uploading="file.upload.progress < 100"
                :thumbnail="file.dataUrl"
                :previewImage="file.url"
                :url="file.url"
                :size="file.size"
                :name="file.name"
                :uploadedFile="file"
                @download="() => {}"
                @previewImage="previewImage"
                @remove="remove">
            </file-card>
          </v-flex>
        </v-layout>
      </v-container>
    </template>

    <v-dialog v-model="viewImage" transition="fade" max-width="auto" content-class="elevation-0 text-sm-center">
      <v-btn flat dark large fab @click.native="viewImage = false" class="btn--close">
        <v-icon>close</v-icon>
      </v-btn>
      <v-card flat color="transparent">
        <img :src="image" style="max-height: 700px" class="elevation-2">

        <!--<v-card-media :src="image" height="700px" contain class="elevation-1">-->

        <!--</v-card-media>-->
        <!--<img :src="image" style="max-width: 1190px">-->
      </v-card>
    </v-dialog>
  </vue-transmit>
</template>

<script>
  import FileCard from '../../helpers/FileCard'

  export default {
    components: {
      FileCard
    },
    props: [
      'upload', 'initialFiles'
    ],
    data() {
      return {
        viewImage: false,
        image: null,
        options: {
//          acceptedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'],
          url: this.$http.defaults.baseURL + '/campaign/upload',
          clickable: true,
          headers: {
            'Authorization': this.$http.defaults.headers.common['Authorization']
          }
        }
      }
    },
    watch: {
      'initialFiles': function () {

        console.log('initial files changes')

        for (let file of this.initialFiles) {
          this.$refs.uploader.files.push({
            id: file.id,
            name: file.original_file,
            upload: {
              progress: 100
            },
            size: file.size,
            accepted: true,
            status: "success",
            type: file.type,
            dataUrl: file.path,
            url: file.path
          })
        }
      }
    },
    methods: {
      triggerBrowse() {
        this.$refs.uploader.triggerBrowseFiles()
      },
      uploaded(file, response) {
        file.url = response.full_path
        this.$emit('fileUploaded', {
          'name': file.name,
          'path': response.path,
          'size': file.size,
          'type': file.type
        })
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
      }
    },
  }
</script>

<style>
  .uploader {
    border: 1px dashed #dddddd;
    border-top: none;
  }

  .v-transmit__upload-area {
    /*position: absolute;*/
    /*top: 0;*/
    /*left: 0;*/
    /*bottom: 0;*/
    /*right: 0;*/
  }

  .v-transmit__upload-area--is-dragging {
    background-color: #eeeeee;
  }

</style>