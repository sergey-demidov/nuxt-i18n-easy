<template>
  <p v-tr>
    &#8220;I will be translated&#8221;
  </p>
</template>

<script>
export default {
  name: 'IndexVue',
  str1: this.$t('Welcome'),
  str2: 'Inspire'.tr()
}
</script>

<style scoped>

</style>
