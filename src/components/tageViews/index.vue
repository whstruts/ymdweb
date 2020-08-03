<template>
  <div id="tags-view-container" class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper">
      <router-link
        v-for="(tag, $index) in visitedViews"
        ref="tag"
        :key="tag.path"
        :class="isActive(tag)?'active':''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="span"
        class="tags-view-item"
        @click.middle.native="closeSelectedTag(tag)"
        @contextmenu.prevent.native="openMenu(tag,$event,$index)"
      >
        {{tag.meta.title}}
        <span v-if="!tag.meta.affix && visitedViews.length!=1 " class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)"/>
      </router-link>
    </scroll-pane>
    <ul v-show="visible && visitedViews.length!=1 && !selectedTag.meta.affix" :style="{left:left+'px',top:top+'px'}"
        class="contextmenu">
      <li @click="closeSelectedTag(selectedTag)">
        关闭
      </li>
      <li @click="closeOthersTags">
        关闭其他
      </li>
    </ul>
  </div>
</template>

<script>
  import ScrollPane from './ScrollPane'
  import {
    bus
  } from '../../bus.js'
  import routsAll from '@/router'
  import path from 'path'
  export default {
    components: {ScrollPane},
    data() {
      return {
        visible: false,
        top: 0,
        left: 0,
        selectedTag: {},
        affixTags: [],
        visitedViews: [],
      }
    },
    computed: {
      // routes() {
      //   return this.$store.state.permission.routes
      // }
    },
    watch: {
      $route() {
        this.addTags()
      },
      visible(value) {
        if (value) {
          document.body.addEventListener('click', this.closeMenu)
        } else {
          document.body.removeEventListener('click', this.closeMenu)
        }
      }
    },
    created(){
      bus.$on("closeTag", (view) => {
        // console.log(view)
        this.closeSelectedTag(view);
      })
    },
    mounted() {
      //固定添加了 Affix 属性的路由，避免刷新时数据被清空
      this.initTags();
      this.addTags();
      //当顶部标签被删除时缓存中集合也要被删除
     /* bus.$on("closeRouteTag", view => {
        this.closeSelectedTag(view, true)//别的界面调用的时候。不需要自动选中visitedViews集合中的最后一个
      });*/
    },
    methods: {

      isActive(route) {
        return route.path === this.$route.path
      },

      filterAffixTags(routes, basePath = '/') {
        let tags = []
        routes.forEach(route => {
          if (route.meta && route.meta.affix) {
            const tagPath = path.resolve(basePath, route.path)
            tags.push({
              fullPath: tagPath,
              path: tagPath,
              name: route.name,
              meta: { ...route.meta }
            })
          }
          if (route.children) {
            const tempTags = this.filterAffixTags(route.children, route.path)
            if (tempTags.length >= 1) {
              tags = [...tags, ...tempTags]
            }
          }
        })
        return tags
      },
      initTags() {
        const affixTags = this.affixTags = this.filterAffixTags(routsAll.options.routes)
        for (const tag of affixTags) {
          // Must have tag name
          if (tag.name) {
            this.visitedViews.push(tag);
          }
        }
      },

      closeSelectedTag(view, state) {
        // console.log(view)
        for (const [i, v] of this.visitedViews.entries()) {
          if (v.path === view.path) {
            this.visitedViews.splice(i, 1)
            break
          }
        }
        bus.$emit('closeSelectedTag', view)
        if (!state) {
          this.toLastView(this.visitedViews)
        }

      },
      addTags() {
        let currentRoute = this.$route;
        bus.$emit('addTags', currentRoute)
        if (currentRoute.meta.noCache) { //如果不缓存的话，要每次把路由带的值替换成最新的
          this.visitedViews.forEach((val, i) => {
            if (val.name === currentRoute.name) {
              this.visitedViews[i] = Object.assign({}, currentRoute);
              return;
            }
          })
        }
        if (this.visitedViews.some(v => v.path === currentRoute.path)) return
        if (!currentRoute.meta.breadcrumb) {
          return;
        }
        // console.log(currentRoute,"bbbb")
        this.visitedViews.push(currentRoute);

      },
      closeOthersTags() {
        this.visitedViews = this.visitedViews.filter(v => {
          // log(v)
          if (v.meta.affix) {
            return true
          }
          return v.path === this.selectedTag.path
        })
        bus.$emit('closeOthersTags', this.selectedTag)
        this.$router.push({path: this.selectedTag.path, query: this.selectedTag.query})
      },

      toLastView(visitedViews) {
        const latestView = visitedViews.slice(-1)[0]
        // console.log(latestView, "=====")
        if (latestView) {
          this.$router.push({path: latestView.path, query: latestView.query})
        } else {
        }
      },
      openMenu(tag, e, index) {
        // if (index === 0) {
        //   return
        // }
        // ;
        const menuMinWidth = 105
        const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
        const offsetWidth = this.$el.offsetWidth // container width
        const maxLeft = offsetWidth - menuMinWidth // left boundary
        const left = e.clientX - offsetLeft + 15 // 15: margin right

        if (left > maxLeft) {
          this.left = maxLeft
        } else {
          this.left = left
        }

        this.top = 10
        this.visible = true
        this.selectedTag = tag
      },
      closeMenu() {
        this.visible = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .tags-view-container {
    position: relative;
    width: 100%;
    padding-right: 150px;
    background: #fff;
    box-sizing: border-box;
    .tags-view-wrapper {
      .tags-view-item {
        display: inline-block;
        position: relative;
        cursor: pointer;
        height: 26px;
        line-height: 26px;
        color: #666666;
        background: #fff;
        border: 1px solid #ECEFF6;
        border-right: 0;
        padding: 1px 18px;
        font-size: 12px;
        &:last-of-type {
          margin-right: 15px;
          border-right: 1px solid #ECEFF6;
        }
        &.active {
          background-color: #EDF8FF;
          color: #FFFFFF;
          background: #3A3D41;
          border-color: #3A3D41;
        }
      }
    }
    .contextmenu {
      margin: 0;
      background: #fff;
      z-index: 3000;
      position: absolute;
      list-style-type: none;
      padding: 5px 0;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 400;
      color: #333;
      box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
      li {
        margin: 0;
        padding: 0px 16px;
        cursor: pointer;
        &:hover {
          background: #eee;
        }
      }
    }
  }
</style>

<style lang="scss">
  //reset element css of el-icon-close
  .tags-view-wrapper {

    .tags-view-item {
      position: relative;
      .el-icon-close {
        position: absolute;
        right: 2px;
        top: 1px;
        width: 12px;
        height: 12px;
        line-height: 12px;
        vertical-align: middle;
        border-radius: 50%;
        text-align: center;
        transition: all .3s cubic-bezier(.645, .045, .355, 1);
        transform-origin: 100% 50%;
        z-index: 10;
        font-size: 5px;
        color: #BCBCBC;
        &:hover {
          background-color: #BCBCBC;
          color: #fff;
        }
      }
    }
  }
</style>
