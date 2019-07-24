let redTimes = new Array(33).fill(0);
let blueTimes = new Array(16).fill(0);

function getRandomLimit(limit) {
    // let rdDate = new Date;
    let str = String(Math.random() * 10000 + limit);
    let rd = str.split(".")[0];
    rd %= limit;
    rd++;
    return rd > limit ? limit : rd;
}

function sortRed(a, b) {
    return b - a; // 从大到小
}

function runOnce() {
    let rd = 0;
    // 红球 <!-- 1-33 *6-->
    let redArr = [];
    for (let i = 0; i < 6; i++) {
        do {
            rd = getRandomLimit(33).toFixed(0);
        } while (redArr.indexOf(rd) >= 0);
        redArr.push(rd);
    }
    redArr.sort(sortRed);

    // 蓝球 <!-- 1-16 *1-->
    let blueA = getRandomLimit(16).toFixed(0);

    // 统计
    redArr.forEach((val) => {
        redTimes[val - 1]++;
    });
    blueTimes[blueA - 1]++;
}

function getHead() {
    // console.log("redTimes:",redTimes);

    let redArr = [];
    let redStr = [];
    let blueArr = [];

    redStr = redStr.concat(redTimes);
    // console.log("redStr",redStr);
    // 数组排序
    redStr.sort(sortRed);
    // 入六个
    let max = [];
    for (let index = 0; index < 6; index++) {
        const element = redStr[index];
        max.push(element);
    }
    // console.log("max",max);

    for (let index = 0; index < max.length; index++) {
        let findOut = -1;
        do {
            findOut = redTimes.indexOf(max[index], (findOut + 1));
            // console.log("findOut",findOut);

            if (findOut > -1) {
                redArr.push(findOut + 1);
            }
        } while (findOut > -1);
    }
    let maxBlue = Math.max.apply(null, blueTimes);
    // console.log("maxBlue",maxBlue);

    let findOut = -1;
    do {
        findOut = blueTimes.indexOf(maxBlue, findOut + 1);
        // console.log("findOut",findOut);
        if (findOut > -1) {
            blueArr.push(findOut + 1);
        }
    } while (findOut > -1);
    return { redArr: redArr, blueArr: blueArr }
}

function getHead2() {
    // 备份数组
    let redTime2 = [];
    redTime2 = redTime2.concat(redTimes);
    let resRed = [];
    let blueRes = [];
    let index = -1;
    while (resRed.length < 6) {
        let max = Math.max.apply(null, redTime2);
        index = -1;
        do {
            index = redTime2.indexOf(max, index + 1);
            if (index > -1) {
                resRed.push(index + 1);
                redTime2[index] = 0;
            }
        } while (index > -1);
    }


    let max = Math.max.apply(null, blueTimes);
    index = -1;
    do {
        index = blueTimes.indexOf(max, index + 1);
        if (index > -1) {
            blueRes.push(index + 1);
        }
    } while (index > -1);
    return { redArr: resRed, blueArr: blueRes };
}

/**
 * 设置程序运行几次
 * @param {Number} times 
 */
function run(times) {
    if (times == 0) {
        return {
            redTimes: 0,
            blueTimes: 0,
            hope: 0
        }
    } else {
        while (times) {
            runOnce();
            times--;
        }

        return {
            redTimes: redTimes,
            blueTimes: blueTimes,
            hope: getHead2()
        }
    }
}

module.exports = {
    run: run
}
