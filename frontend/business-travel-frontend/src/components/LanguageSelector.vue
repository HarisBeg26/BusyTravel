<template>
  <div class="language-selector">
    <label for="language">{{ $t('selectLanguage') }}</label>
    <select id="language" v-model="selectedLanguage" @change="changeLanguage">
      <option value="en">English</option>
      <option value="sl">Slovenščina</option>
      <option value="bs">Bosanski</option>
    </select>
  </div>
</template>

<script>
export default {
  name: "LanguageSelector",
  data() {
    return {
      selectedLanguage: this.$i18n.locale, // Get the current language
    };
  },
  methods: {
    changeLanguage() {
      this.$i18n.locale = this.selectedLanguage; // Update i18n language
      localStorage.setItem("language", this.selectedLanguage); // Persist language choice
    },
  },
};
</script>

<style scoped>
.language-selector {
  margin: 10px;
  font-family: Arial, sans-serif;
}
label {
  margin-right: 5px;
  font-weight: bold;
}
select {
  padding: 5px;
  font-size: 14px;
}
</style>
