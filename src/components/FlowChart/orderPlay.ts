import { Cell, Edge, Graph } from '@antv/x6'
/*
 * @Descripttion:
 * @version: 1.0
 * @Author: mipaifu328
 * @Date: 2022-06-17 16:58:57
 * @LastEditors: mipaifu328
 * @LastEditTime: 2022-06-22 10:08:42
 */
let graph: Graph
let edgeCells: Cell[] = [] // 边列表
let nodeCells: Cell[] = [] // 节点列表
let saveCells: any[] = [] // 保存画布数据
let sourceNodes = new Set() // 来源节点id集合
let targetNodes = new Set() // 目标节点id集合

let orderCells: Cell[] = [] // 顺序执行的节点
let playCells: PlayCell[] = [] // 播放节点

let treeCells: TreeCell[] = []

export interface PlayCell extends Cell {
  isReplay?: boolean
}

interface NodeInputOutput extends Cell {
  branchEdges: Edge[]
}

export interface TreeCell {
  edge: Edge | null
  node: NodeInputOutput | null
  branch: TreeCell[]
  level: number
}

const initData = () => {
  edgeCells = [] // 边列表
  nodeCells = [] // 节点列表
  saveCells = [] // 保存画布数据
  sourceNodes = new Set() // 来源节点id集合
  targetNodes = new Set() // 目标节点id集合

  orderCells = [] // 顺序执行的节点
  playCells = [] // 播放节点

  treeCells = []
}

// 初始化数据
const initGraphData = (g: Graph) => {
  // 保存画布和节点列表
  initData()
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
    cell.isNode() && nodeCells.push(cell)
    cell.isEdge() && edgeCells.push(cell)
  }
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

const findLast = () => {
  let lastNode: Cell = nodeCells.find((cell: Cell) => {
    if (!sourceNodes.has(cell.id)) {
      return cell
    }
  })!
  return lastNode
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
// 获取顺序执行的节点
const getOrderCells = (g: Graph) => {
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

// 节点添加输入输出线
const initInputOutput = () => {
  for (let cell of nodeCells) {
    let node = cell as NodeInputOutput
    node.branchEdges = []
    for (let edge of edgeCells) {
      if (edge.isEdge()) {
        if ((edge.getSource() as any).cell === node.id) {
          node.branchEdges.push(edge)
        }
      }
    }
  }
}
const isFinishNode = (node: NodeInputOutput) => {
  const finishNode = nodeCells.find((cell: Cell) => {
    if (!sourceNodes.has(cell.id)) {
      return cell
    }
  })!
  return finishNode.id === node.id
}

const getNextCell = (edge: Edge) => {
  const nextCell = nodeCells.find((cell: Cell) => {
    if (cell.id === (edge.getTarget() as any).cell) {
      return cell
    }
  })!
  return nextCell
}

const generateTreeCells = (
  currentNode: NodeInputOutput,
  edge: Edge | null,
  branch: TreeCell[],
  level: number
) => {
  let template = {
    edge: edge,
    node: isFinishNode(currentNode) ? null : currentNode,
    branch: [],
    level,
  }
  branch.push(template)
  const branchEdges = currentNode.branchEdges
  if (!branchEdges || branchEdges.length === 0) return
  if (branchEdges.length > 1) {
    for (let branchEdge of branchEdges) {
      const nextCell = getNextCell(branchEdge) as NodeInputOutput
      generateTreeCells(
        nextCell,
        branchEdge,
        template.branch,
        template.level + 1
      )
    }
  } else {
    const nextCell = getNextCell(branchEdges[0]) as NodeInputOutput
    if (level === 0) {
      generateTreeCells(nextCell, branchEdges[0], branch, level)
    } else {
      generateTreeCells(nextCell, branchEdges[0], template.branch, level + 1)
    }
  }
}

// 获取树结构的节点
const getTreeCells = (g: Graph) => {
  initGraphData(g)
  initInputOutput()
  let firstNode = findStart() as NodeInputOutput
  generateTreeCells(firstNode, null, treeCells, 0)
  // 最后添加结束节点
  let lastNode = findLast() as NodeInputOutput
  treeCells.push({
    edge: null,
    node: lastNode,
    branch: [],
    level: 0,
  })
  return treeCells
}

export { orderPlay, getOrderCells, getTreeCells }
