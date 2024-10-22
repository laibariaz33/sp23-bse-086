$(document).ready(function () {
    const API_URL = "https://jsonplaceholder.typicode.com/comments";
    let currentEditId = null; 

   function loadComments() {
        $.get(API_URL, function (comments) {
            $('#commentsList').empty();
            comments.forEach(comment => {
                $('#commentsList').append(`
                    <div class="card mt-3" data-id="${comment.id}">
                        <div class="card-body">
                            <h5 class="card-title">${comment.name}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">${comment.email}</h6>
                            <p class="card-text">${comment.body}</p>
                            <button class="btn btn-warning btn-sm editCommentBtn" data-id="${comment.id}">Edit</button>
                            <button class="btn btn-danger btn-sm deleteCommentBtn" data-id="${comment.id}">Delete</button>
                        </div>
                    </div>
                `);
            });
        });
    }
    $('#showAddCommentForm').on('click', function () {
        $('#addCommentForm').slideDown();
    });
    $('#closeAddFormBtn').on('click', function () {
        $('#addCommentForm').slideUp();
    });

    
    // Add new comment
$('#addCommentBtn').on('click', function () {
    const name = $('#name').val().trim();
    const email = $('#email').val().trim();
    const body = $('#body').val().trim();

    // Validation: Ensure all fields are filled
    if (name === "" || email === "" || body === "") {
        alert("Please fill out all fields before adding the comment.");
        return; // Prevent form submission if validation fails
    }

    const newComment = {
        name: name,
        email: email,
        body: body,
        postId: 1
    };

    $.post(API_URL, newComment, function (comment) {
        $('#commentsList').append(`
            <div class="card mt-3" data-id="${comment.id}">
                <div class="card-body">
                    <h5 class="card-title">${comment.name}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${comment.email}</h6>
                    <p class="card-text">${comment.body}</p>
                    <button class="btn btn-warning btn-sm editCommentBtn" data-id="${comment.id}">Edit</button>
                    <button class="btn btn-danger btn-sm deleteCommentBtn" data-id="${comment.id}">Delete</button>
                </div>
            </div>
        `);
        $('#addCommentForm').slideUp(); 
        $('#name').val('');
        $('#email').val('');
        $('#body').val('');
      });
    });

     $(document).on('click', '.deleteCommentBtn', function () {
        const id = $(this).data('id');
        $.ajax({
            url: `${API_URL}/${id}`,
            type: 'DELETE',
            success: function () {
                $(`div[data-id="${id}"]`).remove(); 
            }
        });
    });

    $(document).on('click', '.editCommentBtn', function () {
        const id = $(this).data('id');
        currentEditId = id;
        $.get(`${API_URL}/${id}`, function (comment) {
            $('#editName').val(comment.name);
            $('#editEmail').val(comment.email);
            $('#editBody').val(comment.body);
            $('#editCommentModal').modal('show');
        });
    });

    $('#updateCommentBtn').on('click', function () {
        const updatedComment = {
            name: $('#editName').val(),
            email: $('#editEmail').val(),
            body: $('#editBody').val()
        };

        $.ajax({
            url: `${API_URL}/${currentEditId}`,
            type: 'PUT',
            data: JSON.stringify(updatedComment),
            contentType: 'application/json',
            success: function () {
                $('#editCommentModal').modal('hide');
                $(`div[data-id="${currentEditId}"]`).html(`
                    <div class="card-body">
                        <h5 class="card-title">${updatedComment.name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${updatedComment.email}</h6>
                        <p class="card-text">${updatedComment.body}</p>
                        <button class="btn btn-warning btn-sm editCommentBtn" data-id="${currentEditId}">Edit</button>
                        <button class="btn btn-danger btn-sm deleteCommentBtn" data-id="${currentEditId}">Delete</button>
                    </div>
                `);
            }
        });
    });

    loadComments();
});
