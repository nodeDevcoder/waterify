let data = JSON.parse(document.getElementById('extractLogs-102023214634').innerText).reverse();
Chart.defaults.font.family = 'Montserrat';
let laundryInf = { 'sm': 10, 'md': 14, 'lg': 20, 'xl': 22 };
let logsDChart = new Chart(document.getElementById('logsChart'), {
    type: 'bar',
    data: {
        labels: data.map(log => new Date(log.date).toLocaleDateString({ year: 'numeric', month: 'short', day: 'numeric' })),
        datasets: [{
            label: 'Shower',
            data: data.map(log => Math.round(((log.shower.freq * log.shower.avgTime * 2.5)) * 100) / 100),
            type: 'bar'
        }, {
            label: 'Toilet',
            data: data.map(log => Math.round((log.toilet.freq * 2) * 100) / 100),
            type: 'bar'
        }, {
            label: 'Laundry',
            data: data.map(log => Math.round((log.laundry.freq * laundryInf[log.laundry.load]) * 100) / 100),
            type: 'bar'
        }, {
            label: 'Total',
            data: data.map(log => Math.round(((log.shower.freq * log.shower.avgTime * 2.5) + (log.toilet.freq * 2) + (log.laundry.freq * laundryInf[log.laundry.load])) * 100) / 100),
            type: 'line',
        }
        ]
    },
    options: {
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return context.dataset.label + `: ${context.parsed.y} gallons`;
                    }
                }
            }
        }
    }
});

function updateChart(chart, days) {
    let cdata = [];
    data.forEach((x) => {
        if (Math.round((Date.now() - new Date(x.date)) / (1000 * 60 * 60 * 24)) < (days + 1)) {
            cdata.push(x);
        }
    });
    console.log(cdata)
    chart.data = {
        labels: cdata.map(log => new Date(log.date).toLocaleDateString({ year: 'numeric', month: 'short', day: 'numeric' })),
        datasets: [{
            label: 'Shower',
            data: cdata.map(log => Math.round(((log.shower.freq * log.shower.avgTime * 2.5)) * 100) / 100),
            type: 'bar'
        }, {
            label: 'Toilet',
            data: cdata.map(log => Math.round((log.toilet.freq * 2) * 100) / 100),
            type: 'bar'
        }, {
            label: 'Laundry',
            data: cdata.map(log => Math.round((log.laundry.freq * laundryInf[log.laundry.load]) * 100) / 100),
            type: 'bar'
        }, {
            label: 'Total',
            data: cdata.map(log => Math.round(((log.shower.freq * log.shower.avgTime * 2.5) + (log.toilet.freq * 2) + (log.laundry.freq * laundryInf[log.laundry.load])) * 100) / 100),
            type: 'line',
        }
        ]
    };
    chart.update();
}

Array.from(document.getElementsByClassName('chtime')).forEach(chtime => {
    chtime.addEventListener('click', e => {
        updateChart(logsDChart, parseInt(e.target.getAttribute('data-time')));
        let st = String(data.length)
        let info = {
            '7': 'Last 7 days',
            '30': 'Last 30 days',
            [st]: 'All time'
        };
        document.getElementById('hmtime').innerText = info[e.target.getAttribute('data-time')];
    });
});