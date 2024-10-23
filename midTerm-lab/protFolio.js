// Function to show selected project name
function showProjectName() {
    const selectedProject = $("#project-dropdown").val();
    $("#project-info").html(`<strong>Selected Project:</strong> ${selectedProject}`);
}

// Function to show selected summary
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

// Function to show pictures
function showPictures() {
    const selectedPicture = $("#pictures-dropdown").val();
    let pictureHtml = '';

    if (selectedPicture === 'Pictures One') {
        pictureHtml = '<img src="images.jfif" alt="Project One Picture" style="width:200px;">';
    } else if (selectedPicture === 'Pictures Two') {
        pictureHtml = '<img src="images.jfif" alt="Project Two Picture" style="width:200px;">';
    } else if (selectedPicture === 'Pictures Three') {
        pictureHtml = '<img src="images.jfif" alt="Project Three Picture" style="width:200px;">';
    }

    $("#pictures-info").html(pictureHtml);
}

// Function to show description
function showDescription() {
    const selectedProject = $("#project-dropdown").val();
    let descriptionText = '';

    if (selectedProject === 'Project One') {
        descriptionText = 'This is a detailed description of Project One.';
    } else if (selectedProject === 'Project Two') {
        descriptionText = 'This is a detailed description of Project Two.';
    } else if (selectedProject === 'Project Three') {
        descriptionText = 'This is a detailed description of Project Three.';
    }

    $("#description-info").html(`<strong>Description:</strong> ${descriptionText}`);
}

// Event listeners for dropdown changes
$(document).ready(function() {
    $("#project-dropdown").change(showProjectName);
    $("#summary-dropdown").change(showSummary);
    $("#pictures-dropdown").change(showPictures);

    // Event listener for description button
    $("#show-description").click(showDescription);
});
