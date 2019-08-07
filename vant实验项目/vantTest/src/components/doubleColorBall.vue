<template>
    <div class="center">
        <Row>
            <Col span="8">
                <table>
                    <tr>
                        <!-- <td
                            v-if="redArr.length"
                            v-for="(item, index) in redArr"
                            :key="'oneTime'+index"
                        >
                            <div class="red ball">{{item}}</div>
                        </td>
                        <td>
                            <div class="blue ball">{{blueA}}</div>
                        </td>-->
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
                                <div
                                    style="display: inline-block;position:relative;top:5px;left:10px;"
                                >
                                    <Spin v-if="disableGo"></Spin>
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>
            </Col>
            <Col span="16">
                <!-- 统计处 -->
                <h2>{{one_Time}}次统计建议:</h2>
                <!-- 出现次表 -->
                <div id="timesChart" class="chart-box"></div>
                <div
                    v-for="(item, index) in hopeRedBalls"
                    :key="'resRed'+index"
                    class="ball red"
                >{{item}}</div>
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
            timesChart: null,
            hopeRedBalls: [],
            blueBalls: [],
            disableGo: false,
            clTimes: 1,
            waiting: false,
            one_Time: 0,
            redTimes: [],
            blueTimes: []
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
            let data = new URLSearchParams();
            data.append("times", that.clTimes);
            let instance = that.$axios.create({
                baseURL: "",
                timeout: 1000 * 60 * 60
            });
            instance
                .post("/api", data)
                .then(res => {
                    console.log(res.data);
                    that.redTimes = res.data.redTimes;
                    that.blueTimes = res.data.blueTimes;
                    that.hopeRedBalls = res.data.hope.redArr;
                    that.hopeRedBalls.sort(that.sortRed);
                    that.blueBalls = res.data.hope.blueArr;
                    that.blueBalls.sort(that.sortRed);
                    that.updateTimesChart();
                    that.disableGo = false;
                    that.waiting = false;
                    that.one_Time = that.clTimes;
                    that.clTimes = 0;
                })
                .catch(err => {
                    console.log(err);

                    that.disableGo = false;
                    that.waiting = false;
                    that.one_Time = that.clTimes;
                    that.clTimes = 0;
                    this.$Message.error({ content: "后台出错" });
                });
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
                            formatter: function(value) {
                                let suf = "";
                                if (value >= 10000) {
                                    value /= 10000;
                                    suf = "W" + suf;
                                }
                                if (value >= 1000) {
                                    value /= 1000;
                                    suf = "K" + suf;
                                }
                                return value.toFixed(1) + suf;
                            }
                        }
                    }
                ],
                series: [
                    {
                        name: "红球",
                        type: "bar",
                        data: that.redTimes
                    },
                    {
                        name: "蓝球",
                        type: "line",
                        data: that.blueTimes
                    }
                ]
            };
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
.demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
}
</style>