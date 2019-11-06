//Test call for 20 javascript Developpers
var queryURL = "http://api.adzuna.com/v1/api/jobs/ca/search/1?app_id=e2d98a7c&app_key=95ee31820ec45dc8bd2ef7279ba150f4&results_per_page=20&what=javascript%20developer&content-type=application/json&where=toronto"
//Actual call for 
//var queryURL = "http://api.adzuna.com/v1/api/jobs/ca/search/1?app_id=e2d98a7c&app_key=95ee31820ec45dc8bd2ef7279ba150f4&results_per_page=20&what=" + job + "&content-type=application/json&where=toronto"
console.log (queryURL)
$.ajax({
    url: queryURL,
    method: "GET"

}).then(function(response) {
    
                for (i = 0; i < response.results.length; i++) {
                    jobLat = (response.results[i].latitude);
                    jobLong = (response.results[i].longitude);
                    compName = (response.results[i].company.display_name)
                    compCity = (response.results[i].location.display_name)
                    jobTitle = (response.results[i].title)
                    jobSalaryMin = (response.results[i].salary_min)
                    jobSalaryMax = (response.results[i].salary_max)
                    jobDesc = (response.results[i].description)
                    jobTime = (response.results[i].contract_time)
                    jobAdButton = (response.results[i].redirect_url)
                    jobCat = (response.results[i].category.label)
                    
                    var jobInfo = {
                        //Info needed for job card
                        JobTitle: jobTitle,
                        SalaryMinimum: jobSalaryMin,
                        SalaryMaximum: jobSalaryMax,
                        JobDescription: jobDesc,
                        //Info needed for job card and GoogleMapAPI input
                        CompanyName: compName,
                        CompanyCity: compCity,
                        //Info needed for GoogleMap API
                        JobLat: jobLat,
                        JobLong: jobLong
                        
                    }

                    console.log(jobInfo)

                            $("div .card")
                                .append($("<div>").addClass("card-body")
                                    .on("click", function mapDisplay(){
                                        $("div .info-display")
                                            .append($("<div>").addClass("map-card"))
                                                .append($("<p>").html("Latitude :" + response.results[i].latitude))
                                                    .append($("<p>").html("Longitude " +  response.results[i].longitude))})
                                    .append($("<p>").html("Job Title: " + response.results[i].title).addClass("card-title"))
                                        .append($("<p>").html("Salary Range: " + response.results[i].salary_min + "-" + response.results[i].salary_max).addClass("card-text"))
                                            .append($("<p>").html("Job Description " + response.results[i].description).addClass("card-text"))
                                                .append($("<p>").html("City: " + response.results[i].location.display_name).addClass("card-text"))
                                                    .append($("<button>").text("Go to Job Ad")
                                                        .on("click", function goToAd(){ 
                                                            window.location = response.results[i].redirect_url}))
                                                        

   )





                }   
       /*           
    $(".btn").on("click", function(event){//Taking input button info and feeding it to API query field
        event.preventDefault();
        var job = $(".#job").val().trim();
    }
    */

});










