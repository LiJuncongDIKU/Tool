<template>
    <div class="center">
        <Alert v-if="waiting">
            <Icon type="md-sync" />正在处理……
        </Alert>
        <Row>
            <Col span="8">
                <table>
                    <tr>
                        <td
                            v-if="redArr.length"
                            v-for="(item, index) in redArr"
                            :key="'oneTime'+index"
                        >
                            <div class="red ball">{{item}}</div>
                        </td>
                        <td>
                            <div class="blue ball">{{blueA}}</div>
                        </td>
                        <td>
                            <div>
                                一次统计次
                                <Input-number :min="1" v-model="clTimes" inline></Input-number>
                                <Button
                                    type="warning"
                                    size="large"
                                    @click="changeBallsTimes"
                                    :disabled="disableGo"
                                >Go!</Button>
                            </div>
                        </td>
                    </tr>
                </table>
            </Col>
            <!-- <Col span="8">
                <table style="max-height:500px; overflow:auto;display: block;">
                    <tr v-for="(group, index) in history" :key="'group'+index">
                        <td v-for="(redBall, idx) in group[0]" :key="'redGp'+idx">
                            <div class="red ball">{{redBall}}</div>
                        </td>
                        <td>
                            <div class="blue ball">{{group[1]}}</div>
                        </td>
                    </tr>
                </table>
            </Col> -->
            <Col span="8">
                <!-- 统计处 -->
                <!-- 出现次表 -->
                <div id="timesChart" class="chart-box"></div>
                <h2>{{history.length}}次统计建议:</h2>
                <div
                    v-for="(item, index) in hopeRedBalls"
                    :key="'resRed'+index"
                    class="ball red"
                >{{item.num}}</div>
                <div
                    v-for="(item, index) in blueBalls"
                    :key="'resBlue'+index"
                    class="ball blue"
                >{{item}}</div>
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
            timesChart: null,
            hopeRedBalls: [],
            blueBalls: [],
            disableGo: false,
            clTimes: 1,
            waiting: false
        };
    },
    mounted() {
        const that = this;
        that.timesChart = that.$echarts.init(
            document.getElementById("timesChart")
        );
        // that.changeBalls();
    },
    methods: {
        // 批量跑
        changeBallsTimes() {
            const that = this;
            // let itl = setInterval(function() {
            //     if (!that.clTimes) {
            //         clearInterval(itl);
            //     } else {

            //     }
            // }, 300);
            that.disableGo = true;
            that.waiting = true;
            while (that.clTimes) {
                that.changeBalls();
                that.clTimes--;
            }
            that.waiting = false;
            that.disableGo = false;
            that.clTimes = 1;
            that.updateTimesChart();
        },
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
        },
        getRandomLimit(limit) {
            let rd = Math.random() * 100 + limit;
            rd %= limit;
            rd++;
            return rd > limit ? limit : rd;
        },
        sortRed(a, b) {
            return a - b;
        },
        updateTimesChart() {
            const that = this;
            that.disableGo = true;
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
                            let res = new Array(33)
                                .fill({})
                                .map((currentValue, index) => {
                                    return { num: index + 1, times: 0 };
                                });
                            that.history.forEach(group => {
                                group[0].forEach(ele => {
                                    // console.log(ele - 1);

                                    res[ele - 1].times++;
                                });
                            });
                            // console.log(res);

                            that.hopeRedBalls = [];
                            let temp = new Array(33)
                                .fill({})
                                .map((currentValue, index) => {
                                    return res[index];
                                });
                            // console.log("temp:",temp);
                            temp.sort((a, b) => {
                                return b.times - a.times;
                            });
                            let lastTime = 0; // 最后一个球出现的次数
                            while (true) {
                                let hopeLength = that.hopeRedBalls.length;
                                let aBall = temp[hopeLength];
                                if (
                                    hopeLength >= 6 &&
                                    aBall.times != lastTime
                                ) {
                                    break;
                                }
                                that.hopeRedBalls.push(aBall);
                                lastTime = aBall.times;
                            }
                            that.hopeRedBalls.sort(function(a, b) {
                                return a.num - b.num;
                            });
                            return res.map(currentValue => {
                                return currentValue.times;
                            });
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
                            // console.log(res);
                            let max = 0;
                            that.blueBalls = [];
                            res.forEach((ele, index) => {
                                // console.log(index,ele);
                                if (ele > max) {
                                    that.blueBalls = [];
                                    max = ele;
                                    that.blueBalls.push(index + 1);
                                } else if (ele == max) {
                                    let flag = true;
                                    that.blueBalls.forEach(ball => {
                                        if (ball == index + 1) {
                                            flag = false;
                                        }
                                    });
                                    if (flag) {
                                        that.blueBalls.push(index + +1);
                                    }
                                }
                            });
                            return res;
                        })()
                    }
                ]
            };
            // console.log(that.history)
            that.timesChart.setOption(opt);
            that.disableGo = false;
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