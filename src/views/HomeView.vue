<script setup>
import { ref, nextTick } from 'vue';
import axios from '@axios'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { useRouter } from 'vue-router';

const loading = ref(false);
const input = ref('');
const session = ref(null);
const messages = ref([]);
const messageContainer = ref(null);
const router = useRouter();


const scrollToBottom = () => {
  nextTick(() => {
    const container = messageContainer.value;
    container.scrollTop = container.scrollHeight;
  });
};

const ask = () => {
  if (input.value === '') {
    return
  }

  messages.value.push({
    text: input.value,
    sent: true
  })
  scrollToBottom()

  loading.value = true;

  const text = input.value
  input.value = ''
  
  axios.post('/ask', {
    question: text,
    chat: session.value
  }).then(r => {
    const { message, chat } = r.data

    session.value = chat
    messages.value.push({
      text: message,
      sent: false
    })

    scrollToBottom()
    
  }).catch(e => {
    toast.error('Error sending message', {
      autoClose: 3000,
    })
    console.error(e);
  }).finally(() => {
    loading.value = false
  })
};

const clear = () => {
  messages.value = []
  session.value = null
};

const logout = () => {
  axios.post('/logout', {}).then(() => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    
    toast.success('Logged out', {
      autoClose: 3000,
    })

    // route go to login
    router.push({ name: 'login' })
  }).catch(e => {
    toast.error('Error logging out', {
        autoClose: 3000,
      })
      console.error(e);
  })
};
</script>

<template>
  <div class="flex items-center h-screen p-4 lg:justify-center">
    <div
      class="flex flex-col overflow-hidden bg-white rounded-md shadow-lg max md:flex-row md:flex-1 lg:max-w-screen-md h-full"
    >
      <div
        class="p-4 py-6 text-white bg-blue-500 md:w-80 md:flex-shrink-0 md:flex md:flex-col md:items-center md:justify-evenly"
      >
        <div class="my-3 text-4xl font-bold tracking-wider text-center">
          <a href="#">HIJIFFY</a>
        </div>
        <p class="mt-6 text-xl font-bold text-center text-gray-300 md:mt-0">
          Google Dialogflow Chat
        </p>
        <div>
          <p
            class="text-sm font-bold text-center text-gray-300 md:mt-0 hover:underline cursor-pointer"
            @click="clear"
          >
            Clear chat
          </p>
          <p
            class="mt-6 text-sm font-bold text-center text-gray-300 md:mt-0 hover:underline cursor-pointer"
            @click="logout"
          >
            Logout
          </p>
        </div>
      </div>
      <div class="bg-white md:flex-1">
        <div class="flex flex-col items-center justify-center h-full">

          <div class="flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden">



            <div class="flex flex-col flex-grow h-0 p-4 overflow-auto" ref="messageContainer">
              <div
                v-for="(message, i) in messages"
                :key="i"
              >
                <div v-if="!message.sent" class="flex w-full mt-2 space-x-3 max-w-xs">
                  <div>
                    <div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
                      <p class="text-sm">{{ message.text }}</p>
                    </div>
                  </div>
                </div>
                <div v-else class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
                  <div>
                    <div class="bg-blue-500 text-white p-3 rounded-l-lg rounded-br-lg">
                      <p class="text-sm">{{ message.text }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div class="bg-gray-300 p-4">
              <input
                v-model="input"
                class="flex items-center h-10 w-full px-3 text-sm"
                type="text"
                placeholder="Type your message…"
                @keyup.enter="ask"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>