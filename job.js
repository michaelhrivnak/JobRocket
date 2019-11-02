var queryURL = "http://api.adzuna.com/v1/api/jobs/ca/search/1?app_id=e2d98a7c&app_key=95ee31820ec45dc8bd2ef7279ba150f4&results_per_page=20&what=javascript%20developer&content-type=application/json&where=toronto"
console.log (queryURL)
$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response) {
    i = 0;
    console.log(response.results.length)
    //console.log(response)
    jobLat = (response.results[i].latitude);
    //console.log(jobLat)
    jobLong = (response.results[i].longitude);
    //console.log(jobLong)
    compName = (response.results[i].company.display_name)
    //console.log(compName)
    compCity = (response.results[i].location.display_name)
    //console.log(compCity)
    jobTitle = (response.results[i].title)
    //console.log(jobTitle)
    jobSalaryMin = (response.results[i].salary_min)
    //console.log(jobSalaryMin)
    jobSalaryMax = (response.results[i].salary_max)
    //console.log(jobSalaryMax)
    jobDesc = (response.results[i].description)
    //console.log(jobDesc)
    jobTime = (response.results[i].contract_time)
    //console.log(jobTime)
    jobAdButton = (response.results[i].redirect_url)
    //console.log(jobAdButton)

    let jobInfo = {
        JobTitle: jobTitle,
        SalaryMinimum: jobSalaryMin,
        SalaryMaximum: jobSalaryMax,
        JobDescription: jobDesc,
        CompanyName: compName,
        CompanyCity: compCity,

    };
    console.log("Job Object String/Job Title: " + jobInfo.JobTitle + "Job Description: " + jobInfo.JobDescription)


        /*for (i = 0; i < response.results.length; i++) {
            $(".job-display")
                .append($("<div>").addClass("job-card")
                    .append($("<p>").text(response.results[i].location.display_name))
                        
                )
        }*/
                for (i = 0; i < response.results.length; i++) {
            $(".job-display")
                .append($("<div>").addClass("job-card").on("click", mapDisplay)
                    .append($("<p>").html("Job Title: " + response.results[i].title))
                        .append($("<p>").html("Salary Range: " + response.results[i].salary_min + "-" + response.results[i].salary_max))
                            .append($("<p>").html("Job Description " + response.results[i].description))
                                .append($("<p>").html("City: " + response.results[i].location.display_name))
                                    

                        
                )
        }

        function mapDisplay(){
            $(".info-display")
            .append($("<div>").addClass("map-card"))
                .append($("<p>").html("Latitude :" + jobLat))
                    .append($("<p>").html("Longitude " +  jobLong))
                         .append($("<button>").text("Go to Job Ad").on("click", function(){window.location = jobAdButton + this.id;}))
        }
        

});