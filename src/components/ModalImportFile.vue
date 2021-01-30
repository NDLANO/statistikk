<template lang="pug">
div
  v-dialog(v-model="dialogOpen", width="50%")
    v-card.modal
      v-card-title.title
        .close-button
          a(@click="dialogOpen = false") Lukk
        .title-text Last opp data
      .example
        div Eksempelfil for data import (Excel)
      .description
        div Slik gjør du det på beste måte...
      .file-selector
        input(
          type="file",
          ref="csvFile",
          accept=".csv",
          style="display: none",
          @change="onFileSelected"
        )
        div Last opp datafil
        .file-box
          v-btn(@click="$refs.csvFile.click()") Velg fil
          v-label(v-if="fileName == ''") Ingen fil er valgt
          v-label(v-else) {{ fileName }}

      v-card-actions
        v-btn(@click="onImportClicked", :disabled="!file") Last inn
        v-btn(@click="dialogOpen = false") Lukk vindu
</template>

<script>
import { readFile, readFileObject } from "@/js/fileTools";

export default {
  data() {
    return {
      dialogOpen: true,
      fileName: "",
      file: null,
    };
  },
  methods: {
    openDialog() {
      this.dialogOpen = true;
    },
    onImportClicked() {
      this.$emit("fileSelected", this.file);
      this.dialogOpen = false;
      this.fileName = "";
      this.file = null;
    },
    async onFileSelected() {
      console.log(
        "App.onFileSelected: File selected = ",
        this.$refs.csvFile.files[0]
      );
      this.file = this.$refs.csvFile.files[0];
      this.fileName = this.file.name;
    },
  },
};
</script>

<style lang="scss" scoped>
$sideMargin: 24px;
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
  }
  .close-button {
    align-self: flex-end;
    font-size: 18px;
    font-weight: normal;
  }

  .example {
    margin: 0 $sideMargin;
    text-align: left;
    padding: 20px;
    background: #eff0f2;
    font-size: 16px;
    font-weight: 900;
  }

  .description {
    margin-top: 25px;
    margin-bottom: 30px;
  }

  .file-selector {
    .file-box {
      border: 1px solid #20588f;
      padding: 11px 16px;
    }
  }
}
</style>