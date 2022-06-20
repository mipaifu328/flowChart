import { Cell, CellView, Graph } from '@antv/x6'
/*
 * @Descripttion:
 * @version: 1.0
 * @Author: mipaifu328
 * @Date: 2022-06-17 16:58:57
 * @LastEditors: mipaifu328
 * @LastEditTime: 2022-06-20 14:53:51
 */
let graph: Graph
let edgeCells: Cell[] = []
let nodeCells: Cell[] = []
let saveCells: any[] = []
let sourceNodes = new Set()
let targetNodes = new Set()

export interface PlayCell extends Cell {
  isReplay?: boolean
}

let orderCells: Cell[] = []
let playCells: PlayCell[] = []

// 初始化数据
const initGraphData = (g: Graph) => {
  // 保存画布和节点列表

  graph = g
  const cells = graph.getCells()
  saveCells = graph.toJSON().cells

  // 收集源节点和目标节点 id 集合
  for (let saveCell of saveCells) {
    if (saveCell.shape === 'edge') {
      sourceNodes.add(saveCell.source.cell)
      targetNodes.add(saveCell.target.cell)
    }
  }

  for (let cell of cells) {
    cell.isEdge() && edgeCells.push(cell)
    cell.isNode() && nodeCells.push(cell)
  }

  console.log(cells, saveCells)
}

const sleep = (ms: number = 1000) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const findStart = () => {
  let startNode: Cell = nodeCells.find((cell: Cell) => {
    if (!targetNodes.has(cell.id)) {
      return cell
    }
  })!
  return startNode
}

const generateOrderCells = (root: Cell) => {
  const saveEdges = saveCells.filter((cell) => {
    return cell.shape === 'edge' && cell.source.cell === root.id
  })

  for (let saveEdge of saveEdges) {
    const edge = edgeCells.find((cell: Cell) => {
      if (cell.id === saveEdge.id) {
        return cell
      }
    })
    const node = nodeCells.find((cell: Cell) => {
      if (cell.id === saveEdge.target.cell) {
        return cell
      }
    })
    if (edge && node) {
      orderCells.push(edge)
      orderCells.push(node)
      playCells.push(node)
      ;(edge as PlayCell).isReplay = true
      playCells.push(edge)
      generateOrderCells(node)
    }
  }
}

const getOrderCells = (g: Graph) => {
  orderCells = []
  playCells = []
  initGraphData(g)
  orderCells.push(findStart())
  playCells.push(findStart())
  generateOrderCells(findStart())
  return orderCells
}

const orderPlay = async (g: Graph) => {
  getOrderCells(g)
  graph.clearCells()
  for (const cell of playCells) {
    cell.isEdge() && graph.addEdge(cell)
    cell.isNode() && graph.addNode(cell)
    await sleep(300)
  }
}

export { orderPlay, getOrderCells }
