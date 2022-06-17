<!--
 * @Descripttion: 
 * @version: 1.0
 * @Author: mipaifu328
 * @Date: 2022-06-14 15:32:04
 * @LastEditors: mipaifu328
 * @LastEditTime: 2022-06-17 11:37:03
-->
<script setup lang="ts">
import FromDetail from './FromDettail.vue'
import { onMounted, ref, watch, reactive } from 'vue'
import { Graph, Node, Edge, View } from '@antv/x6'
import createGraph from './graph'
import { Base } from '@antv/x6/lib/shape/base'
import RightMenu from './RightMenu.vue'
import { $ref } from 'vue/macros'

let count = $ref(0)

interface DetailData {
  title: string
  key: string
  value: string
}
interface Position {
  x: number
  y: number
}

interface GraphEventObject {
  e: MouseEvent
  x: number
  y: number
  node?: Node
  edge?: Edge
  view: View
}

let graph: Graph
const detailData = ref<DetailData[]>([])
let currentNode: Edge | Node // 当前节点
let currentDelete: Edge | Node | undefined
let lineColor: string = $ref('#dd0022')
let isRightMenuVisble: boolean = $ref(false)
let rightMenuPosition: Position = $ref({ x: 0, y: 0 })
const { jsonData } = defineProps(['jsonData'])
const emit = defineEmits(['saveJsonData'])

const initFlowChart = () => {
  // #region 初始化画布
  graph = createGraph()

  graph.on('node:click', ({ e, x, y, node, view }) => {
    currentNode = node
    const data = node.getData() || []
    const label = node.getAttrs().label
      ? node.getAttrs().label.text
      : node.getAttrs().text.text

    detailData.value = [{ key: 'label', value: label, title: '标签' }, ...data]
  })

  graph.on('edge:click', ({ e, x, y, edge, view }) => {
    currentNode = edge
    const data = edge.getData() || []
    let label = edge.getLabelAt(0) ? edge.getLabelAt(0)!.attrs!.label.text : ''
    let color = edge.getAttrs().line.stroke
    detailData.value = [
      {
        key: 'label',
        value: label,
        title: '标签',
      },
      {
        key: 'color',
        value: color,
        title: '颜色',
      },
      ...data,
    ]
  })

  graph.on('edge:added', ({ edge, index, options }) => {
    edge.setAttrs({ line: { stroke: lineColor } })
    console.log(lineColor)
  })

  graph.on('cell:contextmenu', (e: GraphEventObject) => {
    isRightMenuVisble = true
    rightMenuPosition = { x: e.x, y: e.y }
    currentDelete = e.node || e.edge
  })
}

watch(
  detailData,
  () => {
    if (detailData.value) {
      // 标签
      let label = detailData.value.filter((item) => item.key === 'label')[0]
        .value
      if (currentNode instanceof Node) {
        ;(currentNode as Base).setLabel(label)
      }
      if (currentNode instanceof Edge) {
        currentNode.setLabels([label])
      }
      // 线颜色
      let colorObj = detailData.value.filter((item) => item.key === 'color')
      if (colorObj[0]) {
        let color = colorObj[0].value
        currentNode.setAttrs({ line: { stroke: color } })
      }
    }
  },
  {
    deep: true,
  }
)

const saveGraph = () => {
  const json = graph.toJSON()
  emit('saveJsonData', JSON.stringify(json))
}

const deleteNode = () => {
  isRightMenuVisble = false
  currentDelete!.remove()
}

const clearGraph = () => {
  graph.clearCells()
}

onMounted(() => {
  initFlowChart()
  graph.fromJSON(JSON.parse(jsonData))
})
</script>

<template>
  <div class="toolbar">
    线颜色： <el-color-picker v-model="lineColor" />
    <el-divider direction="vertical" />
    <el-button type="primary" size="small" @click="saveGraph"> 保存 </el-button>
    <el-divider direction="vertical" />
    <el-button type="danger" size="small" @click="clearGraph"> 清空 </el-button>
  </div>
  <div id="container">
    <div id="stencil"></div>
    <div id="graph-container"></div>
    <FromDetail class="form-detail" :detailData="detailData" />
    <RightMenu
      :visible="isRightMenuVisble"
      :position="rightMenuPosition"
      @deleteNode="deleteNode"
    />
  </div>
</template>

<style scoped>
.toolbar {
  height: 40px;
  line-height: 40px;
}
#container {
  height: 500px;
  display: flex;
  border: 1px solid #dfe3e8;
  position: relative;
}
#stencil {
  width: 180px;
  height: 100%;
  position: relative;
  border-right: 1px solid #dfe3e8;
}
#graph-container {
  width: calc(100% - 180px);
  height: 100%;
}
.x6-widget-stencil {
  background-color: #fff;
}
.x6-widget-stencil-title {
  background-color: #fff;
}
.x6-widget-stencil-group-title {
  background-color: #fff !important;
}
.x6-widget-transform {
  margin: -1px 0 0 -1px;
  padding: 0px;
  border: 1px solid #239edd;
}
.x6-widget-transform > div {
  border: 1px solid #239edd;
}
.x6-widget-transform > div:hover {
  background-color: #3dafe4;
}
.x6-widget-transform-active-handle {
  background-color: #3dafe4;
}
.x6-widget-transform-resize {
  border-radius: 0;
}
.x6-widget-selection-inner {
  border: 1px solid #239edd;
}
.x6-widget-selection-box {
  opacity: 0;
}
</style>
