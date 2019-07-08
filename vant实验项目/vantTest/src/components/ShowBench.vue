<template>
    <div>
        <h1>H5 画布的使用</h1>
        <Row>
            <Col span="6">
                <Button type="primary" @click="createLine">createBlock</Button>
                <!-- <div class="rectangle" draggable="true">矩形</div> -->
            </Col>
            <Col span="18">
                <Card>
                    <p slot="title">画布</p>
                    <canvas ref="canvas" class="canvas" width="800" height="500"></canvas>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
export default {
    data() {
        return {
            canvasEvm: "", // 可以使用 mounted 注入 画布环境
            canvas: "",
            graphs: [],
            currentGraph: null
        };
    },
    mounted() {
        const that = this;
        that.canvasEvm = this.$refs.canvas.getContext("2d");
        that.canvas = this.$refs.canvas;
    },
    methods: {
        createLine() {
            const that = this;
            // if (that.currentGraph != null) {
            //     that.graphs.push(that.currentGraph);
            // }
            let rectangle = {
                x: 20,
                y: 20,
                width: 150,
                height: 100,
                color: "#" + parseInt(Math.random() * 16 ** 6).toString(16),
                bornNo: that.graphs.length + 1
            };
            rectangle.draw = function() {
                that.canvasEvm.fillStyle = rectangle.color;
                that.canvasEvm.fillRect(
                    rectangle.x,
                    rectangle.y,
                    rectangle.width,
                    rectangle.height
                );
            };
            rectangle.draw();
            that.graphs.push(rectangle);
            that.canvas.addEventListener("click", that.pickEvent);
        },
        createEvent(e) {
            const that = this;
            // console.log("createEvent", e);
            that.clearCanvas();
            that.currentGraph.x = e.offsetX - that.currentGraph.width / 2;
            that.currentGraph.y = e.offsetY - that.currentGraph.height / 2;
            that.currentGraph.draw();
            that.muoseController();
        },
        dropEvent(e) {
            const that = this;
            // console.log("DropEvent");
            that.clearCanvas();
            that.currentGraph.x = e.offsetX - that.currentGraph.width / 2;
            that.currentGraph.y = e.offsetY - that.currentGraph.height / 2;
            that.currentGraph.draw();
            that.canvas.removeEventListener("mousemove", that.mouseMoveEvent);
            that.canvas.addEventListener("click", that.pickEvent);
            that.graphs.push(that.currentGraph);
            that.currentGraph = null;
            // console.log(that.graphs);
            that.canvas.removeEventListener("click", that.dropEvent);
        },
        pickEvent(e) {
            const that = this;
            // console.log(e);
            for (let i = that.graphs.length - 1; i >= 0; i--) {
                const ele = that.graphs[i];
                // console.log(i);
                if (
                    e.offsetX > ele.x &&
                    e.offsetX < ele.x + ele.width &&
                    e.offsetY > ele.y &&
                    e.offsetY < ele.y + ele.height
                ) {
                    // 找到块
                    that.currentGraph = that.graphs.splice(i, 1)[0];
                    // console.log("i:", i, "length:", that.graphs.length);
                    that.canvas.addEventListener(
                        "mousemove",
                        that.mouseMoveEvent
                    );
                    that.canvas.addEventListener("click", that.dropEvent);
                    that.canvas.removeEventListener("click", that.pickEvent);
                    return;
                }
            }
        },
        mouseMoveEvent(e) {
            const that = this;
            // console.log("mouseMoveEvent");
            that.clearCanvas();
            that.currentGraph.x = e.offsetX - that.currentGraph.width / 2;
            that.currentGraph.y = e.offsetY - that.currentGraph.height / 2;
            that.currentGraph.draw();
        },
        muoseController() {
            const that = this;
            that.canvas.addEventListener("mousemove", that.mouseMoveEvent);
            // console.log("removeCreateEvent");
            that.canvas.removeEventListener("click", that.createEvent);
            // console.log("addDropEvent");
            that.canvas.addEventListener("click", that.dropEvent);
        },
        clearCanvas() {
            const that = this;
            that.canvasEvm.fillStyle = "#FFF";
            that.canvasEvm.fillRect(
                0,
                0,
                that.canvas.width,
                that.canvas.height
            );
            that.graphs.forEach(ele => {
                ele.draw();
            });
        }
    }
};
</script>

<style lang="less" scoped>
.canvas {
    // border: 1px solid grey;
    box-shadow: 0px 0px 14px 0px cadetblue;
}
.rectangle {
    background: rgb(199, 64, 64);
    width: 100px;
    height: 80px;
}
</style>