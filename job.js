var apiKey = "95ee31820ec45dc8bd2ef7279ba150f4";

//returns an array of job results to be formatted by the front end
function getJobs(stringJobTitle){

    var queryURL = "http://api.adzuna.com/v1/api/jobs/ca/search/1?app_id=e2d98a7c&app_key="+apiKey+"&results_per_page=20&what="+stringJobTitle+"&content-type=application/json&where=toronto";
    var siftedResults = [];
    $.ajax({
        url: queryURL,
        method: "GET"        
    }).then(function(response) {
        i = 0;
        console.log(response.results.length);
        console.log(response);
        //console.log(response)
        response.results.forEach(element => {
            jobLat = element.latitude;
            //console.log(jobLat)
            jobLong = element.longitude;
            //console.log(jobLong)
            compName = element.company.display_name;
            //console.log(compName)
            compCity = element.location.display_name;
            //console.log(compCity)
            jobTitle = element.title;
            //console.log(jobTitle)
            jobSalaryMin = element.salary_min;
            //console.log(jobSalaryMin)
            jobSalaryMax = element.salary_max;
            //console.log(jobSalaryMax)
            jobDesc = element.description;
            //console.log(jobDesc)
            jobTime = element.contract_time;
            //console.log(jobTime)
            jobAdButton = element.redirect_url;
            //console.log(jobAdButton)
        
            //TODO: logic to determine if the salary and location is valid to send back
            let strSalary = "";
            

            let jobInfo = {
                JobTitle: jobTitle,
                SalaryMinimum: jobSalaryMin,
                SalaryMaximum: jobSalaryMax,
                JobDescription: jobDesc,
                CompanyName: compName,
                CompanyCity: compCity,
                jobUrl: jobAdButton,
                jobContract: jobTime
            };
            siftedResults.push(jobInfo);
            
        });
        console.log(siftedResults);
        return siftedResults;
        //console.log("Job Object String/Job Title: " + jobInfo.JobTitle + "Job Description: " + jobInfo.JobDescription)


            /*for (i = 0; i < response.results.length; i++) {
                $(".job-display")
                    .append($("<div>").addClass("job-card")
                        .append($("<p>").text(response.results[i].location.display_name))
                            
                    )
            }*/
            // for (i = 0; i < response.results.length; i++) {
            //     $(".job-display")
            //         .append($("<div>").addClass("job-card").on("click", mapDisplay)
            //             .append($("<p>").html("Job Title: " + response.results[i].title))
            //                 .append($("<p>").html("Salary Range: " + response.results[i].salary_min + "-" + response.results[i].salary_max))
            //                     .append($("<p>").html("Job Description " + response.results[i].description))
            //                         .append($("<p>").html("City: " + response.results[i].location.display_name))
                                        

                            
            //         )
            // }

            // function mapDisplay(){
            //     $(".info-display")
            //     .append($("<div>").addClass("map-card"))
            //         .append($("<p>").html("Latitude :" + jobLat))
            //             .append($("<p>").html("Longitude " +  jobLong))
            //                 .append($("<button>").text("Go to Job Ad").on("click", function(){window.location = jobAdButton + this.id;}))
            // }
            

});
}