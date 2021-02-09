<template lang="pug">
div
  v-dialog(
    v-model="dialogOpen",
    width="500 ",
    :fullscreen="$vuetify.breakpoint.xsOnly"
  )
    v-card.modal
      v-card-title.title
        .close-button
          a(@click="dialogOpen = false") {{ $t('general.closeButton') }}
        .title-text {{ $t('import.title') }}
      .description
        div {{ $t('import.description') }}
        br
        a(href="instruksjoner.pdf", target="_blank")
          v-icon.icon mdi-cloud-download
          span {{ $t('import.descriptionFile') }}
        br
        br
        a(href="mal.xlsx")
          v-icon.icon mdi-cloud-download
          span {{ $t('import.fileTemplate') }}
      .file-selector
        input(
          type="file",
          ref="csvFile",
          accept=".csv",
          style="display: none",
          @change="onFileSelected"
        )
        div {{ $t('import.instruction') }}
        .file-box
          v-btn.ndla-btn(
            @click="$refs.csvFile.click()",
            color="#20588F",
            rounded,
            dark
          ) Velg fil
          label(v-if="fileName == ''") {{ $t('import.noFileChosen') }}
          label.file-selected(v-else) {{ fileName }}

      v-card-actions.actions
        v-btn.ndla-btn(
          @click="onImportClicked",
          color="#20588F",
          rounded,
          dark,
          :disabled="!file"
        ) 
          div {{ $t('import.importButton') }}
        v-btn.ndla-btn.close-btn(@click="dialogOpen = false", rounded) {{ $t('import.closeWindowButton') }}
      .end-tag
</template>

<script>
import { readFile, readFileObject } from "@/js/fileTools";

export default {
  data() {
    return {
      dialogOpen: false,
      fileName: "",
      file: null,
    };
  },
  methods: {
    openDialog() {
      this.dialogOpen = true;
      this.fileName = "";
      this.file = null;
      if (this.$refs.csvFile) this.$refs.csvFile.value = "";
    },
    onImportClicked() {
      this.$emit("fileSelected", this.file);
      this.dialogOpen = false;
    },
    async onFileSelected() {
      this.file = this.$refs.csvFile.files[0];
      this.fileName = this.file.name;
    },
  },
};
</script>

<style lang="scss" scoped>
$sideMargin: 24px;
$darkBlue: #20588f;

.modal.v-card ::v-deep {
  font-size: 18px;
  text-align: left;

  & > div {
    margin-left: $sideMargin;
    margin-right: $sideMargin;
  }

  .title {
    // .v-card__title {
    // position: relative;
    padding: 16px 0 5px 0;
    margin: 0 $sideMargin 16px $sideMargin;
    border-bottom: 1px solid #a5bcd3;
    flex-direction: column;
    // }
  }

  .title-text {
    align-self: flex-start;
    margin-top: -10px;
    font-weight: 900;
    color: $darkBlue;
  }
  .close-button {
    align-self: flex-end;
    font-size: 18px;
    font-weight: normal;
  }

  .description,
  .example {
    margin: 0 $sideMargin;
    margin-bottom: 30px;
    text-align: left;
    padding: 20px;
    background: #eff0f2;
    font-size: 16px;
    font-weight: 900;

    a,
    div,
    div.file-selector {
      color: black;
      text-decoration: none;
    }
    .icon {
      color: black;
      transform: translateY(-3px);
    }
    span {
      margin-left: 15px;
    }
  }

  .description {
    margin-bottom: 20px;
  }

  .file-selector {
    .file-box {
      border: 1px solid $darkBlue;
      padding: 11px 16px;
    }

    label {
      padding-left: 15px;
    }
    label.file-selected {
      color: black !important;
    }
  }

  .actions {
    margin-top: 40px;
    padding-left: 0;

    .close-btn {
      margin-left: 30px !important;
      background: white !important;
      color: $darkBlue !important;
      border: 2px solid $darkBlue;
    }

    .theme--dark.v-btn.v-btn--disabled:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
      background: rgba(32, 88, 143, 0.5) !important;
      color: white !important;
    }
  }
  .end-tag {
    height: 15px;
  }

  .ndla-btn {
    padding-left: 18px;
    padding-right: 18px;
  }

  .close-button a {
    color: $darkBlue !important;
    border-bottom: 1px solid $darkBlue;
    padding-bottom: 3px;
    text-decoration: none;
  }
}
</style>