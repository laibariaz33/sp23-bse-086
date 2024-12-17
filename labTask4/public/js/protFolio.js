
function showProjectName() {
    const selectedProject = $("#project-dropdown").val();
    $("#project-info").html(`<strong>Selected Project:</strong> ${selectedProject}`);
}


function showSummary() {
    const selectedSummary = $("#summary-dropdown").val();
    let summaryText = '';

    if (selectedSummary === 'Summary One') {
        summaryText = 'Lorem ipsum dolor sit amet, summary for Project One.';
    } else if (selectedSummary === 'Summary Two') {
        summaryText = 'Lorem ipsum dolor sit amet, summary for Project Two.';
    } else if (selectedSummary === 'Summary Three') {
        summaryText = 'Lorem ipsum dolor sit amet, summary for Project Three.';
    }

    $("#summary-info").html(`<strong>Summary:</strong> ${summaryText}`);
}


function showPictures() {
    const selectedPicture = $("#pictures-dropdown").val();
    let pictureHtml = '';

    if (selectedPicture === 'Pictures One') {
        pictureHtml = '<img src="./images/images.jfif" alt="Project One Picture" style="width:200px;">';
    } else if (selectedPicture === 'Pictures Two') {
        pictureHtml = '<img src="./images/images.jfif" alt="Project Two Picture" style="width:200px;">';
    } else if (selectedPicture === 'Pictures Three') {
        pictureHtml = '<img src="./images/images.jfif" alt="Project Three Picture" style="width:200px;">';
    }

    $("#pictures-info").html(pictureHtml);
}


function showDescription() {
    const selectedProject = $("#project-dropdown").val();
    let fileName = '';

    if (selectedProject === 'Project One') {
        fileName = '/text/project1.txt';
    } else if (selectedProject === 'Project Two') {
        fileName = '/text/project2.txt';
    } else if (selectedProject === 'Project Three') {
        fileName = '/text/project3.txt';
    } else {
        $("#description-info").html('<strong>Select a project to view its description.</strong>');
        return;
    }

   
    $.ajax({
        url: fileName,
        dataType: 'text',
        success: function(data) {
            $("#description-info").html(`<strong>Description:</strong> ${data}`);
        },
        error: function() {
            $("#description-info").html('<strong>Error loading description.</strong>');
        }
    });
}


$(document).ready(function() {
    $("#project-dropdown").change(showProjectName);
    $("#summary-dropdown").change(showSummary);
    $("#pictures-dropdown").change(showPictures);

    
    $("#show-description").click(showDescription);
});
