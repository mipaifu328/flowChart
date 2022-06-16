/*
 * @Descripttion:
 * @version: 1.0
 * @Author: mipaifu328
 * @Date: 2022-06-14 16:25:28
 * @LastEditors: mipaifu328
 * @LastEditTime: 2022-06-14 17:56:07
 */
import { Graph } from "@antv/x6"

const initEvent = (graph: Graph) => {
  // copy cut paste
  graph.bindKey(["meta+c", "ctrl+c"], () => {
    const cells = graph.getSelectedCells()
    if (cells.length) {
      graph.copy(cells)
    }
    return false
  })
  graph.bindKey(["meta+x", "ctrl+x"], () => {
    const cells = graph.getSelectedCells()
    if (cells.length) {
      graph.cut(cells)
    }
    return false
  })
  graph.bindKey(["meta+v", "ctrl+v"], () => {
    if (!graph.isClipboardEmpty()) {
      const cells = graph.paste({ offset: 32 })
      graph.cleanSelection()
      graph.select(cells)
    }
    return false
  })

  //undo redo
  graph.bindKey(["meta+z", "ctrl+z"], () => {
    if (graph.history.canUndo()) {
      graph.history.undo()
    }
    return false
  })
  graph.bindKey(["meta+shift+z", "ctrl+shift+z"], () => {
    if (graph.history.canRedo()) {
      graph.history.redo()
    }
    return false
  })

  // select all
  graph.bindKey(["meta+a", "ctrl+a"], () => {
    const nodes = graph.getNodes()
    if (nodes) {
      graph.select(nodes)
    }
  })

  //delete
  graph.bindKey("backspace", () => {
    const cells = graph.getSelectedCells()
    if (cells.length) {
      graph.removeCells(cells)
    }
  })

  // zoom
  graph.bindKey(["ctrl+1", "meta+1"], () => {
    const zoom = graph.zoom()
    if (zoom < 1.5) {
      graph.zoom(0.1)
    }
  })
  graph.bindKey(["ctrl+2", "meta+2"], () => {
    const zoom = graph.zoom()
    if (zoom > 0.5) {
      graph.zoom(-0.1)
    }
  })

  // 控制连接桩显示/隐藏
  const showPorts = (ports: NodeListOf<SVGElement>, show: boolean) => {
    for (let i = 0, len = ports.length; i < len; i = i + 1) {
      ports[i].style.visibility = show ? "visible" : "hidden"
    }
  }
  graph.on("node:mouseenter", () => {
    const container = document.getElementById("graph-container")!
    const ports = container.querySelectorAll(
      ".x6-port-body"
    ) as NodeListOf<SVGElement>
    showPorts(ports, true)
  })
  graph.on("node:mouseleave", () => {
    const container = document.getElementById("graph-container")!
    const ports = container.querySelectorAll(
      ".x6-port-body"
    ) as NodeListOf<SVGElement>
    showPorts(ports, false)
  })
  // #endregion
}
export default initEvent
