const registerControl = function(domId) {
    return {
        data() {
            return {
                onAdd: (map) => {
                    this._map = map
                    this._container = document.getElementById(domId)
                    return this._container
                },
                onRemove: () => {
                    this._container.parentNode.removeChild(this._container)
                    this._map = undefined
                }
            }
        }
    }
}

const registerDomControl = function(domId) {
    const domElem = document.getElementById(domId)
    const _this = domElem

    domElem.onAdd = (map) => {
        _this._map = map
        _this._container = document.getElementById(domId)
        return _this._container
    }

    domElem.onRemove = () => {
        _this._container.parentNode.removeChild(_this._container)
        _this._map = undefined
    }

    return domElem
}

class DragDomElem {
    constructor(dragElem, domElem) {
        this.dragElem = dragElem
        this.box = domElem
        this.box.onselectstart = ()=>false
        this.init()
    }
    init() {
        this.dragElem.addEventListener('mousedown', (e)=>{
            e = e || window.event
            this.distX = e.clientX - this.box.offsetLeft
            this.distY = e.clientY - this.box.offsetTop
            this.box.style.position = "absolute"

            document.onmousemove = this.onMouseMove.bind(this)
            document.onmouseup = this.onMouseUp.bind(this)
        }, false)
    }
    onMouseMove(e) {
        e = e || window.event
        this.box.style.left = e.clientX - this.distX + "px"
        this.box.style.top = e.clientY - this.distY + "px"
        this.box.style.right = "auto"
        this.box.style.bottom = "auto"
    }
    onMouseUp(e) {
        document.onmousemove = null
        document.onmouseup = null
    }
}

class LimitDragDomElem extends DragDomElem {
    constructor(dragElem, dragBoxDomElem, limitBoxDomElem){
        super(dragElem, dragBoxDomElem)
        this.limitBox = limitBoxDomElem
        this.limitBoxComputedStyle = getComputedStyle(this.limitBox, null)
        this.limitLeft = 0
        this.limitTop = 0
        this.limitRight = this.limitBox.offsetWidth - this.box.offsetWidth - parseInt(this.limitBoxComputedStyle.borderWidth) * 2
        this.limitBottom = this.limitBox.offsetHeight - this.box.offsetHeight - parseInt(this.limitBoxComputedStyle.borderWidth) * 2
    }
    onMouseMove(e) {
        e = e || window.event
        super.onMouseMove()
        if (this.box.offsetLeft < this.limitLeft) {
            this.box.style.left = 0
        }
        if (this.box.offsetTop < this.limitTop) {
            this.box.style.top = 0
        }
        if (this.box.offsetLeft > this.limitRight) {
            this.box.style.left = this.limitRight + "px"
        }
        if (this.box.offsetTop > this.limitBottom) {
            this.box.style.top = this.limitBottom + "px"
        }
    }
}

class StackedNode {
    constructor(domElem = null, zIndex = 0, prev= null, next= null) {
        this.dom = domElem
        this.zIndex = zIndex
        this.prev = prev
        this.next = next
    }
}

class StackedDomList {

    dummyHead
    baseZIndex
    events

    constructor(domList, baseZIndex=10, ...events) {
        this.dummyHead = new StackedNode()
        this.dummyTail = new StackedNode()
        this.dummyHead.next = this.dummyTail
        this.dummyTail.prev = this.dummyHead
        this.baseZIndex = baseZIndex
        this.events = events

        let zIndex = this.baseZIndex + domList.length - 1;
        for (let dom of domList) {
            const stackedNode = new StackedNode(dom, zIndex--)
            this.insertTail(stackedNode)
            this.syncNodeZIndex(stackedNode)
            this.registerEvents(stackedNode, events)
        }
    }

    // 尾插节点
    insertTail(stackedNode) {
        stackedNode.next = this.dummyTail
        stackedNode.prev = this.dummyTail.prev
        stackedNode.prev.next = stackedNode
        stackedNode.next.prev = stackedNode
    }

    // 头插节点
    insertHead(stackedNode) {
        stackedNode.prev = this.dummyHead
        stackedNode.next = this.dummyHead.next
        stackedNode.prev.next = stackedNode
        stackedNode.next.prev = stackedNode
    }

    syncNodeZIndex(stackedNode, zIndex) {
        stackedNode.zIndex = zIndex
        stackedNode.dom.style.zIndex = zIndex
    }

    moveToHead(stackedNode) {
        stackedNode.prev.next = stackedNode.next
        stackedNode.next.prev = stackedNode.prev
        this.insertHead(stackedNode)

        // refresh all indexes
        let curNode = this.dummyTail.prev
        let curZIndex = this.baseZIndex
        while (curNode !== this.dummyHead) {
            this.syncNodeZIndex(curNode, curZIndex)
            curNode = curNode.prev
            curZIndex++
        }
    }

    registerEvents(stackedNode, events) {
        const _this = this
        const dom = stackedNode.dom

        for (let eventName of events) {
            dom.addEventListener(eventName, (e)=>{
                _this.moveToHead(stackedNode)
            }, false)
        }
    }
}

export {
    registerControl,
    registerDomControl,
    DragDomElem,
    LimitDragDomElem,
    StackedNode,
    StackedDomList
}