<template>
    <div class="center">
        <Row>
            <Col span="8">
                <table>
                    <tr>
                        <td v-for="(item, index) in redArr" :key="index">
                            <div class="red ball">{{item}}</div>
                        </td>
                        <td>
                            <div class="blue ball">{{blueA}}</div>
                        </td>
                        <td>
                            <Button type="warning" size="large" @click="changeBalls">Go!</Button>
                        </td>
                    </tr>
                </table>
            </Col>
            <Col span="8">
                <table>
                    <tr v-for="(group, index) in history" :key="index">
                        <td v-for="(redBall, idx) in group[0]" :key="idx">
                            <div class="red ball">{{redBall}}</div>
                        </td>
                        <td>
                            <div class="blue ball">{{group[1]}}</div>
                        </td>
                    </tr>
                </table>
            </Col>
            <Col span="8">
                <!-- 统计处 -->
                <!-- 出现次表 -->
                <div id="timesChart" class="chart-box"></div>
            </Col>
        </Row>
    </div>
</template>

<script>
export default {
    name: "",
    data() {
        return {
            redArr: [],
            blueA: 0,
            history: [],
            timesChart: null
        };
    },
    mounted() {
        const that = this;
        that.timesChart = that.$echarts.init(document.getElementById("timesChart"));
        that.changeBalls();
    },
    methods: {
        changeBalls() {
            const that = this;
            let rd = 0;
            // 红球 <!-- 1-33 *6-->
            that.redArr = [];
            for (let i = 0; i < 6; i++) {
                do {
                    rd = that.getRandomLimit(33).toFixed(0);
                } while (that.redArr.indexOf(rd) >= 0);
                that.redArr.push(rd);
            }
            that.redArr.sort(that.sortRed);
            // 蓝球 <!-- 1-16 *1-->
            that.blueA = that.getRandomLimit(16).toFixed(0);

            //写入历史
            that.history.unshift([that.redArr, that.blueA]);
            that.updateTimesChart();
        },
        getRandomLimit(limit) {
            let rd = Math.random() * 100 + limit;
            rd %= limit;
            return Number((++rd).toFixed(0));
        },
        sortRed(a, b) {
            return a - b;
        },
        updateTimesChart() {
            const that = this;
            let opt = {
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "cross",
                        crossStyle: {
                            color: "#999"
                        }
                    }
                },
                legend: {
                    data: ["红球", "蓝球"]
                },
                xAxis: [
                    {
                        type: "category",
                        data: new Array(33)
                            .fill("")
                            .map((item, index) => index + 1),
                        axisPointer: {
                            type: "shadow"
                        }
                    }
                ],
                yAxis: [
                    {
                        type: "value",
                        name: "出现",
                        min: 0,
                        axisLabel: {
                            formatter: "{value} 次"
                        }
                    }
                ],
                series: [
                    {
                        name: "红球",
                        type: "bar",
                        data: (function(params) {
                            let res = new Array(33).fill(0);
                            that.history.forEach(group => {
                                group[0].forEach(ele => {
                                    res[ele - 1]++;
                                });
                            });
                            return res;
                        })()
                    },
                    {
                        name: "蓝球",
                        type: "line",
                        data: (function(params) {
                            let res = new Array(16).fill(0);
                            that.history.forEach(group => {
                                res[group[1] - 1]++;
                            });
                            return res;
                        })()
                    }
                ]
            };
            that.timesChart.setOption(opt);
        }
    }
};
</script>

<style lang="less" scoped>
.center {
    margin: 0 auto;
    text-align: center;
}
.ball {
    height: 50px;
    width: 50px;
    display: inline-block;
    border-radius: 25px;
    color: white;
    font-size: 25px;
    line-height: 50px;
}
.blue {
    background: rgb(0, 119, 255);
}
.red {
    background: rgb(170, 0, 0);
}
tr td {
    margin: 0 3px;
    display: inline-table;
}
.chart-box {
    width: 100%;
    height: 400px;
}
</style>