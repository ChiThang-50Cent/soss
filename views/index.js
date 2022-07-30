const getLable = (shopeeLable = [], lazadaLable = []) => {
    let lable = [];
    shopeeLable.forEach((el) => {
        if (lazadaLable.includes(el) && el != "no brand") lable.push(el);
    });
    lable.push("no brand");
    return lable;
};

const getDataForChart = (data = {}, lable = []) => {
    let dataForChart = [];
    let sum = 0;
    lable.forEach((el) => {
        if (data[el] && el != "no brand") {
            dataForChart.push(data[el]);
            sum += data[el];
        }
    });
    dataForChart.push(100 - sum);
    return dataForChart;
};

const createCanvas = () => {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("id", "myChart");
    document.getElementById("chart-container").appendChild(canvas);
};

const removeCanvas = () => {
    const canvas = document.getElementById("myChart");
    if (canvas) document.getElementById("chart-container").removeChild(canvas);
};

const drawChart = (labels, shopeeChartData, lazadaChartData) => {
    labels.forEach((el, index) => {
        labels[index] = el.toUpperCase();
    });
    const data = {
        labels: labels,
        datasets: [{
                label: "Shopee",
                data: shopeeChartData,
                borderColor: "gba(54, 162, 235)",
                backgroundColor: "rgba(54, 162, 235, 0.7)",
            },
            {
                label: "Lazada",
                data: lazadaChartData,
                borderColor: "gba(201, 203, 207)",
                backgroundColor: "rgba(201, 203, 207, 0.7)",
            },
        ],
    };
    const config = {
        type: "bar",
        data: data,
        options: {
            indexAxis: "y",
            elements: {
                bar: {
                    borderWidth: 1,
                },
            },
            responsive: true,
        },
    };
    const myChart = new Chart(document.getElementById("myChart"), config);
};

const submitBtn = document.getElementById("submit-btn");
const input = document.getElementById("q");
const spinner = document.getElementById("spinner");

submitBtn.addEventListener("click", async() => {
    removeCanvas();

    const time_1 = new Date().getTime();

    const inputValue = input.value;

    spinner.hidden = false;

    const res = await fetch(`/api/search?keyword=${inputValue}`);
    const data = await res.json();

    spinner.hidden = true;

    //console.log(data);

    const shopeeLable = Object.keys(data.shopeeData);
    const lazadaLable = Object.keys(data.lazadaData);

    const lable = getLable(shopeeLable, lazadaLable);
    const shopeeChartData = getDataForChart(data.shopeeData, lable);
    const lazadaChartData = getDataForChart(data.lazadaData, lable);

    // console.log(lable);
    // console.log(shopeeChartData);
    // console.log(lazadaChartData);

    console.log(-Math.round(time_1 / 1000 - new Date().getTime() / 1000));

    createCanvas();

    drawChart(lable, shopeeChartData, lazadaChartData);
});