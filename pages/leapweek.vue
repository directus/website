<template>
  <BaseContainer id="lw-container">
    <div id="page">
      <section id="header">
        <img src="https://marketing.directus.app/assets/768aa2db-5ad1-4654-921a-dbbc97c6a73e.png" alt="Leap Week">
      </section>

      <div id="content">

        <iframe :src="`https://www.youtube.com/embed/${global.youtube_id}?controls=0`" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

        <!-- <div id="chat">
          <div> 
            <ol id="messages">
              <li v-for="message of messages">
                <p>{{ message.text }}</p>
              </li>
            </ol>
            <div class="new">
              <input type="text" placeholder="Message" v-model="newMessage" @keyup.enter="submitMessage">
            </div>
          </div>
        </div> -->
      </div>

      <div id="resources">
        <h2>Latest Resources</h2>
        <ol id="scrollable">
          <li v-for="resource of resources">
            <a href="#">
              <img :src="`${directus_url}/assets/${resource.image}`" alt="">
              <h3>{{ resource.title }}</h3>
            </a>
          </li>
        </ol>
      </div>

    </div>
  </BaseContainer>
</template>

<script setup>
const directus_url = 'https://leap-week-1.directus.app';
const token = 'ZrsKy-ckUb32x8M18imjEMUO7b2QzDIW';
import { createDirectus, staticToken, rest, realtime, readSingleton, readItems } from '@directus/sdk';
const directus = createDirectus(directus_url).with(staticToken(token)).with(rest()).with(realtime());

const resources = ref([]);
const global = await directus.request(readSingleton('global'));

onMounted(async () => {
  await directus.connect();

  directus.onWebSocket('message', async message => {
    console.log(JSON.stringify(message))
    if(message.type == 'auth' && message.status == 'ok') {
      await subscribe()
    }
  })

  async function subscribe() {
    const { subscription } = await directus.subscribe('timeline', {
      query: { fields: ['*'],  },
      uid: 'timeline'
    });
    for await (const item of subscription) {
      console.log(JSON.stringify(item))
      if(item.event == 'init' && item.uid == 'timeline') {
        resources.value = item.data.filter(i => i.live)
      }
      if(item.event == 'update' && item.uid == 'timeline') {
        resources.value = [...item.data, ...resources.value]
      }
    }
  }

})

useHead({
  bodyAttrs: { class: 'leap' }
})
</script>

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
  .footer-container .base-divider {
    border-color: var(--gray-600);
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
  #lw-container {
    flex: 1;
  }
}
</style>

<style scoped lang="scss">
#page {
  margin-bottom: 2em;
}
#header {
  margin-top: 2em;
  margin-bottom: 2em;
  & img {
    width: 320px;
    margin: 0 auto;
  }
}
#content {
  // display: grid;
  grid-template-columns: auto 300px;
  gap: 2em;
}
iframe {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--rounded-lg);
}
// #chat {
//   background: var(--grad);
//   padding: 1em;
//   #messages {
//     height: 378px;
//     padding-left: 0;
//     list-style: none;
//     margin: 0;
//     overflow-y: scroll;
//     display: flex;
//     flex-direction: column;
//     gap: 1em;
//   }
//   .new {
//     padding-top: 1em;
//     input {
//       width: 100%;
//       font-size: 1em;
//       padding: 0.25em 0.35em;
//     }
//   }
// }


#resources {
  width: 100%;
  margin-top: 2em;
  h2 {
    color: white;
    margin-bottom: 1em;
  }
  ol {
    list-style: none;
    overflow-x: scroll;
    display: flex;
    flex-wrap: nowrap;
    padding-left: 0;
    margin-top: 0;
    margin-bottom: 0;
    li {
      flex: 0 0 auto;
      margin-right: 2em;
      display: flex;
      flex-direction: column;
      background: var(--gray-100);
      border-radius: var(--rounded-lg);
      padding: 0.75em;
      a {
        width: 400px;
        text-decoration: none;
        color: var(--foreground);
        img {
          width: 400px;
          border-radius: var(--rounded-md);
        }
        h3 {
          line-height: 1.5;
          font-size: var(--font-size-lg);
          margin-top: 0.5rem;
          margin-bottom: -0.25rem;
        }
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
}

@media (width <= 1088px) {
  #lw-container {
    margin-top: 90px;
  }
  #content {
    grid-template-columns: 1fr;
  }
}
</style>