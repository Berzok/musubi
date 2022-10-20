<template>
  <Transition name="slide-fade">
    <div id="sidebar" v-if="visible" :class="activeClass()">
      <div class="navbar-header">
        <button class="btn" @click="hide" type="button">
          <span class="fa-solid fa-times"/>
        </button>
      </div>
      <ul>
        <li v-for="i in menuItems" :key="i.name">
          {{ i.name }}
        </li>
      </ul>
    </div>
  </Transition>
  <button v-show="!visible" id="navbar_toggle" @click="visible = !visible" class="btn">
    <span :class="buttonIcon()"></span>
  </button>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore as userStore } from '@/store/user';
import axios from "axios";
import { mapActions, mapState } from 'pinia';

export default defineComponent({
    name: 'Navbar',
    components: {},
    computed: {},
    data() {
        return {
            menuItems: [
                {
                    name: 'Lorem'
                },
                {
                    name: 'Ipsum',
                },
                {
                    name: 'Chocolatl'
                }
            ],
            visible: false
        }
    },
    methods: {
        activeClass(): string {
            return this.visible ? 'visible' : '';
        },
        buttonIcon() {
            return this.visible ? 'fa-solid fa-times' : 'fa-solid fa-bars';
        },
        hide() {
            this.visible = false;
        },
    },
    setup() {
        const user = userStore();
        //const isLoggedIn = computed(() => store.getters.isLogged);
        return {user};
    },
});
</script>

<style scoped>
#sidebar {
    background-color: darkslateblue;
    border-right: 1px dashed goldenrod;
    color: thistle;
    max-width: 20rem;
    height: 100%;
    font-family: "Lato", Helvetica, "Roboto", Arial, sans-serif;
    transition: all 1s;
    min-width: 11rem;
    position: fixed;
    width: auto;
    left: -13rem;
    z-index: 10;
}

.navbar-header {
    display: flex;
    justify-content: right;
}

.visible {
    left: 0 !important;
}

#navbar_toggle {
    position: fixed;
}

/*
  Enter and leave animations can use different
  durations and timing functions.
*/
.slide-fade-enter-active, .slide-fade-leave-active {
    transition: all 1s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(-14rem);
    opacity: 0;
    width: 0;
}

</style>