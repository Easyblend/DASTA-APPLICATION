
(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();

    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Sidebar Toggler
    $('.sidebar-toggler').click(function () {
        $('.sidebar, .content').toggleClass("open");
        return false;
    });


    // Progress Bar
    $('.pg-bar').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, {offset: '80%'});


    // Calender
    $('#calender').datetimepicker({
        inline: true,
        format: 'L'
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        items: 1,
        dots: true,
        loop: true,
        nav : false
    });


    // Chart Global Color
    Chart.defaults.color = "#6C7293";
    Chart.defaults.borderColor = "#000000";


    // Worldwide Sales Chart
   var gyroXData = [];
   var gyroYData = [];
   var gyroZData = [];

// Create a chart
var ctx1 = $("#worldwide-sales").get(0).getContext("2d");
var myChart1 = new Chart(ctx1, {
    type: "bar",
    data: {
        labels: ["2016", "2017", "2018", "2019", "2020", "2021", "2022"],
        datasets: [{
                label: "Gyro X",
                data: gyroXData,
                backgroundColor: "rgba(235, 22, 22, .7)"
            },
            {
                label: "Gyro Y",
                data: [8, 35, 40, 60, 70, 55, 75],
                backgroundColor: "rgba(235, 22, 22, .5)"
            },
            {
                label: "Gyro Z",
                data: [12, 25, 45, 55, 65, 70, 60],
                backgroundColor: "rgba(235, 22, 22, .3)"
            }
        ]
    },
    options: {
        responsive: true
    }
});

var time =[]
// Fetch data from API and update the chart
function fetchDataFromAPI(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Add the latest gyro X data to the array
            gyroXData.push(data.data.gyro_raw[0]);
            gyroYData.push(data.data.gyro_raw[1]);
            gyroZData.push(data.data.gyro_raw[2]);  
            
            time.push((data.data.time_us/1000000).toFixed(1))
            // Ensure gyroXData only stores data for the last 10 seconds (or 10 data points)
            if (gyroXData.length > 10) {
                gyroXData.shift(); // Remove the oldest data point
                gyroYData.shift();
                gyroZData.shift();
                time.shift();
            }
            console.log(data.data.time_us)
            // Update the chart with the new data
            myChart1.data.datasets[0].data = gyroXData;
            myChart1.update(); // Update the chart
        })
        .catch(error => console.error(error));
}

// Fetch data every 2 seconds
setInterval(() => {
    myChart2.update();
    fetchDataFromAPI("http://localhost:8000/recent_data/");
}, 3000);


    // Salse & Revenue Chart Multi Line Chart
    var ctx2 = $("#salse-revenue").get(0).getContext("2d");
    var myChart2 = new Chart(ctx2, {
        type: "line",
        data: {
            labels: time,
            datasets: [{
                    label: "X-axis",
                    data: gyroXData,
                    backgroundColor: "rgba(22, 235, 22, .2)",
                    fill: true
                },
                {
                    label: "Y-axis",
                    data: gyroYData,
                    backgroundColor: "rgba(22, 22, 235, .2)",
                    fill: true
                },
                  {
                    label: "Z-axis",
                    data: gyroZData,
                    backgroundColor: "rgba(235, 22, 22, .2)",
                    fill: true
                }
            ]
            },
        options: {
            responsive: true
        }
    });
    


    // Single Line Chart
    var ctx3 = $("#line-chart").get(0).getContext("2d");
    var myChart3 = new Chart(ctx3, {
        type: "line",
        data: {
            labels: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150],
            datasets: [{
                label: "Salse",
                fill: false,
                backgroundColor: "rgba(235, 22, 22, .7)",
                data: [7, 8, 8, 9, 9, 9, 10, 11, 14, 14, 15]
            }]
        },
        options: {
            responsive: true
        }
    });


    // Single Bar Chart
    var ctx4 = $("#bar-chart").get(0).getContext("2d");
    var myChart4 = new Chart(ctx4, {
        type: "bar",
        data: {
            labels: ["Italy", "France", "Spain", "USA", "Argentina"],
            datasets: [{
                backgroundColor: [
                    "rgba(235, 22, 22, .7)",
                    "rgba(235, 22, 22, .6)",
                    "rgba(235, 22, 22, .5)",
                    "rgba(235, 22, 22, .4)",
                    "rgba(235, 22, 22, .3)"
                ],
                data: [55, 49, 44, 24, 15]
            }]
        },
        options: {
            responsive: true
        }
    });


    // Pie Chart
    var ctx5 = $("#pie-chart").get(0).getContext("2d");
    var myChart5 = new Chart(ctx5, {
        type: "pie",
        data: {
            labels: ["Italy", "France", "Spain", "USA", "Argentina"],
            datasets: [{
                backgroundColor: [
                    "rgba(235, 22, 22, .7)",
                    "rgba(235, 22, 22, .6)",
                    "rgba(235, 22, 22, .5)",
                    "rgba(235, 22, 22, .4)",
                    "rgba(235, 22, 22, .3)"
                ],
                data: [55, 49, 44, 24, 15]
            }]
        },
        options: {
            responsive: true
        }
    });


    // Doughnut Chart
    var ctx6 = $("#doughnut-chart").get(0).getContext("2d");
    var myChart6 = new Chart(ctx6, {
        type: "doughnut",
        data: {
            labels: ["Italy", "France", "Spain", "USA", "Argentina"],
            datasets: [{
                backgroundColor: [
                    "rgba(235, 22, 22, .7)",
                    "rgba(235, 22, 22, .6)",
                    "rgba(235, 22, 22, .5)",
                    "rgba(235, 22, 22, .4)",
                    "rgba(235, 22, 22, .3)"
                ],
                data: [55, 49, 44, 24, 15]
            }]
        },
        options: {
            responsive: true
        }
    });

    
})(jQuery);

