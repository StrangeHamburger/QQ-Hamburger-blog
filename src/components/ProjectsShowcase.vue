<script setup>
import { ref } from 'vue'
import { projects } from '../data/content.js'
import ProjectModal from './ProjectModal.vue'

defineProps({ embedded: Boolean })

const active = ref(null)

function openProject(p) { active.value = p }
function closeProject() { active.value = null }
</script>

<template>
  <section class="works" id="works">
    <div class="container">
      <div class="works-head">
        <h2 class="works-title">项目</h2>
        <span class="works-label mono-label">SELECTED WORKS</span>
      </div>

      <!-- 一横排精致小方块 -->
      <div class="tile-row">
        <article
          v-for="(proj, i) in projects"
          :key="proj.no"
          class="tile"
          :class="'tone-' + (i % 3)"
          @click="openProject(proj)"
          role="button"
          :tabindex="0"
          @keydown.enter="openProject(proj)"
        >
          <div class="tile-card">
            <img v-if="proj.image" :src="proj.image" :alt="proj.name" class="tile-img" />
            <template v-else>
              <span class="tile-no">{{ proj.no }}</span>
              <span class="tile-dot" aria-hidden="true"></span>
              <span class="tile-cross" aria-hidden="true"></span>
            </template>
          </div>
          <div class="tile-meta">
            <span class="tile-name">{{ proj.name }}</span>
            <span class="tile-year mono-label">{{ proj.year }}</span>
          </div>
        </article>
      </div>
    </div>

    <!-- 全屏详情弹层（不跳转页面） -->
    <ProjectModal
      v-if="active"
      :embedded="embedded"
      :title="active.name"
      :subtitle="active.desc"
      :meta="active.tag + ' · ' + active.year"
      :body="active.detail"
      :href="active.href"
      @close="closeProject"
    />
  </section>
</template>
