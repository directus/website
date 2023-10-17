<template>
  <div id="lw-page">
    <section id="lw-header">
      <img src="https://marketing.directus.app/assets/768aa2db-5ad1-4654-921a-dbbc97c6a73e.png" alt="Leap Week">
    </section>
  </div>
</template>

<style>
body.leap .theme-provider {
  background-image: url('https://marketing.directus.app/assets/f037699a-0087-445b-8841-369405abfb84.svg');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  .footer-container {
    background: var(--primary-900);
  }
  .group-title {
    color: white;
  }
  .footer {
    .logo img, 
    .secondary .socials img:hover {
      filter: brightness(100);
    }
    a {
      color: var(--gray-200);
      &:hover {
        color: var(--gray-300);
      }
    }
  }
}
</style>

<style scoped lang="scss">
#lw-page {
  padding: 2em;
  flex: 1
}
#lw-header {
  & img {
    width: 320px;
    margin: 0 auto;
  }
}
</style>

<script setup>
useHead({
  bodyAttrs: { class: 'leap' }
})
</script>